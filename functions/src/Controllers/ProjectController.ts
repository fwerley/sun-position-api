import express = require("express");
import { db } from "../config/firebase";

async function fetchTimeZone(data: { lat: any, lng: any }) {
    const response = await fetch(
        `https://timeapi.io/api/timezone/coordinate?latitude=${data.lat}&longitude=${data.lng}`
    );
    return await response.json();
}

export default {
    async create(req: express.Request, res: express.Response) {
        let { name, lat, lng } = JSON.parse(req.body);
        const dataTimeZone = await fetchTimeZone({lat,lng});
        const timeZone = {
            zoneName: dataTimeZone.timeZone,
            gmtOffset: dataTimeZone.currentUtcOffset.seconds
        }
        try {
            if (req.user) {
                await db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc().set({
                    createdAt: Date.now(),
                    name,
                    lat,
                    lng,
                    timeZone
                });
                res.status(200).send({ status: "Success", msg: "Data Saved" });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async index(req: express.Request, res: express.Response) {
        try {
            if (req.user) {
                const reqDoc = db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc(req.params.id);
                const itemDetail = reqDoc.get();
                const response = (await itemDetail).data();
                res.status(200).send({ status: "Success", response });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async store(req: express.Request, res: express.Response) {
        type TimeZone = {
            gmtOffset: number
            zoneName: string
        }
        type ResponseItems = {
            tag: string,
            name: string,
            lat: number,
            lng: number,
            timeZone: TimeZone,
            createdAt: Date,
        };
        try {
            if (req.user) {
                const query = db.collection("users").doc("/" + req.user.uid + "/").collection("projects");
                const response: Array<ResponseItems> = [];
                await query.get().then((data) => {
                    const docs = data.docs;
                    docs.map((doc) => {
                        const selectedItem = {
                            tag: doc.id,
                            name: doc.data().name,
                            lat: doc.data().lat,
                            lng: doc.data().lng,
                            timeZone: doc.data().timeZone,
                            createdAt: doc.data().createdAt,
                        };
                        response.push(selectedItem);
                    });
                    return response;
                });
                res.status(200).send({ status: "Success", response });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async put(req: express.Request, res: express.Response) {
        let { name, lat, lng } = JSON.parse(req.body);
        const dataTimeZone = await fetchTimeZone({lat,lng});
        const timeZone = {
            zoneName: dataTimeZone.timeZone,
            gmtOffset: dataTimeZone.currentUtcOffset.seconds
        }
        try {
            if (req.user) {
                await db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc(req.params.id).update({
                    name,
                    lat,
                    lng,
                    timeZone
                });
                res.status(200).send({ status: "Success", msg: "Data Saved" });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async delete(req: express.Request, res: express.Response) {
        try {
            if (req.user) {
                const reqDoc = db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc(req.params.id);
                await reqDoc.delete();
                res.status(200).send({ status: "Success", msg: "Data Deleted" });
            } else {
                throw new Error("The user's credentials may not grant them the required privileges to access the resource");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
};
