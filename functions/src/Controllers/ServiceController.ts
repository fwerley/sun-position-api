import express from "express";
import { db } from "../config/firebase";

type accountType = {
    key: string,
    usage: [{
        date: string,
        count: number
    }]
};

export default {
    async generateApiKey(req: express.Request, res: express.Response) {
        const reqDoc = db.collection("users").doc(req.user?.uid);
        const itemDetail = reqDoc.get();
        const dataDb = (await itemDetail).data();
        let account: accountType | any;

        if (dataDb) {
            account = dataDb.apiKey;
        }

        if (account) {
            return res.status(429).send({
                error: { code: 429, msg: "Maximum number of API keys reached" },
            });
        }
        try {
            // Size key = 30 caracters
            const keyApi = genAPIKey(30);
            const today = new Date().toISOString().split("T")[0];
            await db.collection("users").doc("/" + req.user?.uid + "/").set({
                apiKey: {
                    key: keyApi,
                    usage: [{ date: today, count: 0 }],
                },
            });
            return res.status(200).send({ status: "Success", msg: "Data Saved" });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async refreshToken(req: express.Request, res: express.Response) {
        const apiKey = req.body.apiKey;
        const refshToken = req.body.refreshToken;
        if (!apiKey) {
            res.status(403).json({ error: "No API Key provided" });
        }
        fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "grant_type": "refresh_token",
                "refresh_token": refshToken,
            }).toString(),
        }).then((response) => response.json())
            .then((data) => {
                res.status(200).send({ status: "Success", data });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send({ status: "Failed", msg: error });
            });
    },
    async getApiKey(req: express.Request, res: express.Response) {
        try {
            if (req.user) {
                const reqDoc = db.collection("users").doc("/" + req.user.uid + "/");
                const itemDetail = reqDoc.get();
                const response = (await itemDetail).data();
                return res.status(200).send({ status: "Success", response });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed", msg: error });
        }
    }
};

// const genAPIKey = () => {
//     return [...Array(30)]
//         .map(() => ((Math.random() * 36) | 0).toString(36))
//         .join("");
// };

let genAPIKey = (n: number = 16) => [...crypto.getRandomValues(new Uint8Array(n))]
    .map((x, i) => (i = x / 255 * 61 | 0, String.fromCharCode(i + (i > 9 ? i > 35 ? 61 : 55 : 48)))).join(``);
