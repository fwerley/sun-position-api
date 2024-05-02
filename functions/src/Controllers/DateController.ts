import express = require("express");
import SunPosition from "sun-position";

export default {
    async index(req: express.Request, res: express.Response) {
        const sunPosition = SunPosition;
        type Data = {
            lat: number,
            lng: number,
            dateTime: Date
        }
        const data: Data = req.body;
        try {
            sunPosition.setLatitude(data.lat);
            sunPosition.setLongitude(data.lng);
            sunPosition.setDateTime(new Date(data.dateTime));
            res.status(200).json({
                data,
                durationDay: sunPosition.getDurationDay(),
                declinationAngle: sunPosition.getDeclinationAngle(),
                timeZone: await sunPosition.getTimeZone(),
                locTime: await sunPosition.getLocTime(),
                sunTime: await sunPosition.getSunTime(),
                elevation: await sunPosition.getElevation(),
                azimuth: await sunPosition.getAzimuth(),
            });
        } catch (error) {
            res.status(404).send({
                message: `Sua requisição não pode ser atendida\n${error}`,
            });
        }
    },
};
