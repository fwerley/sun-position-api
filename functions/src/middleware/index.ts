import express from "express";
import { admin, db } from "../config/firebase";

const MAX = 600;

type accountType = {
    key: string,
    usage: [{
        date: string,
        count: number
    }]
};

export default {
    async verifyUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        const idToken = req.headers.authorization; // Assuming ID token is sent in the Authorization header
        try {
            if (idToken) {
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                req.user = decodedToken;
                next();
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error: any) {
            console.error("Error verifying token:", error);
            res.status(401).json({ code: 401, msg: "Unauthorized. Token is invalid", error: error.code });
        }
    },
    async verifyKey(req: express.Request, res: express.Response, next: express.NextFunction) {
        const apiKey = req.header("x-api-key");
        const userId = req.header("x-user-id");
        let account: accountType | any;
        let reqDoc;
        try {
            if (userId) {
                reqDoc = db.collection("users").doc(userId);
                const itemDetail = reqDoc.get();
                const dataDb = (await itemDetail).data();
                if (dataDb) {
                    account = dataDb.apiKey;
                } else {
                    throw new Error("The user's credentials may not grant them the required privileges to access the resource");
                }
            }
        } catch (error) {
            console.error("Error get user token:", error);
            res.status(404).json({ error: "Not found" });
        }
        if (account && Object.is(apiKey, account.key)) {
            const today = new Date().toISOString().split("T")[0];
            const usageCount = account.usage.findIndex((day: { date: string }) => day.date == today);
            if (usageCount >= 0) {
                if (account.usage[usageCount].count >= MAX) {
                    res.status(429).send({
                        error: { code: 429, msg: "Max API calls exceeded." },
                    });
                } else {
                    account.usage[usageCount].count++;
                    reqDoc?.update({
                        apiKey: account,
                    });
                    console.log("Good API call", account.usage[usageCount]);
                    next();
                }
            } else {
                account.usage.push({ date: today, count: 1 });
                reqDoc?.update({
                    apiKey: account,
                });
                next();
            }
        } else {
            // Reject request if API key doesn't match
            res.status(403).send({ error: { code: 403, msg: "You not allowed." } });
        }
    },
};
