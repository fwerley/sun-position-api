import express = require("express");
import { db } from "../config/firebase";
import { SunPosition } from "sun-position";

async function fetchTimeZone(data: { lat: number, lng: number }) {
    const sunPosition = new SunPosition(data.lat, data.lng, new Date());
    return await sunPosition.getTimeZone();
}

export default {
    async create(req: express.Request, res: express.Response) {
        const { name, lat, lng } = JSON.parse(req.body);
        const { zoneName, gmtOffset } = await fetchTimeZone({ lat, lng });
        const timeZone = {
            zoneName,
            gmtOffset,
        };
        try {
            if (req.user) {
                await db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc().set({
                    createdAt: Date.now(),
                    name,
                    lat,
                    lng,
                    timeZone,
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
        const { name, lat, lng } = JSON.parse(req.body);
        const { zoneName, gmtOffset } = await fetchTimeZone({ lat, lng });
        const timeZone = {
            zoneName,
            gmtOffset,
        };
        try {
            if (req.user) {
                await db.collection("users").doc("/" + req.user.uid + "/").collection("projects").doc(req.params.id).update({
                    name,
                    lat,
                    lng,
                    timeZone,
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
