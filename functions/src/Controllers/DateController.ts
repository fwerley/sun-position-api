import express = require("express");
import { SunPosition } from "sun-position";
import { correctionArrayHour, degreesToRadians } from "../utils";
import { debug } from "firebase-functions/logger";

export default {
    async index(req: express.Request, res: express.Response) {
        type Data = {
            lat: number,
            lng: number,
            dateTime: Date
        }
        type LocTime = {
            moment: Date;
            sunrise: Date;
            sunset: Date;
        };
        const data: Data = req.body;
        const coords = { lat: data.lat, lng: data.lng };
        try {
            const sunPosition = new SunPosition(data.lat, data.lng, new Date(data.dateTime));
            const durationDay = sunPosition.getDurationDay();
            const declinationAngle = sunPosition.getDeclinationAngle();
            const timeZone = await sunPosition.getTimeZone();
            const sunTime = await sunPosition.getSunTime();
            const elevation = await sunPosition.getElevation();
            const azimuth = await sunPosition.getAzimuth();
            const tjy = await trajectory({
                gmtOffset: timeZone.gmtOffset,
                coords, date: new Date(data.dateTime),
            });
            const locTimeData: LocTime = await sunPosition.getLocTime();

            sunPosition.setDateTime(new Date(locTimeData.sunrise));
            const anglesSunrise = { elevation: await sunPosition.getElevation(), azimuth: await sunPosition.getAzimuth() };

            sunPosition.setDateTime(new Date(locTimeData.sunset));
            const anglesSunset = { elevation: await sunPosition.getElevation(), azimuth: await sunPosition.getAzimuth() };
            res.status(200).json({
                data,
                durationDay,
                declinationAngle,
                timeZone,
                locTime: {
                    ...locTimeData,
                    sunriseAngle: {
                        elevation: anglesSunrise.elevation,
                        azimuth: anglesSunrise.azimuth,
                    },
                    sunsetAngle: {
                        elevation: anglesSunset.elevation,
                        azimuth: anglesSunset.azimuth,
                    },
                },
                sunTime,
                elevation,
                azimuth,
                trajectory: tjy,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },

    async timeZone(req: express.Request, res: express.Response) {
        type Data = {
            lat: number,
            lng: number
        }
        const data: Data = JSON.parse(req.body);
        debug(data);
        try {
            const sunPosition = new SunPosition(data.lat, data.lng, new Date());
            const timeZone = await sunPosition.getTimeZone();
            res.status(200).json({
                status: "Success",
                data,
                timeZone,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
};

type TrajectoryInput = {
    gmtOffset: number
    coords: { lat: number, lng: number }
    date: Date
}

// Determinar se a trajetoria do sol  nesse dia será pelo norte ou pelo sul, quando o sol estiver no meio dia solar
const trajectory = async ({ gmtOffset, coords, date }: TrajectoryInput): Promise<string> => {
    const sunPosition = new SunPosition(coords.lat, coords.lng, date);
    // let standardMeridian = (gmtOffset / 3600) * 15;
    // Se Diff for negativo, a localização está ao leste do meridiano
    // padrão horario, assim, a hora aparente é mais tarde que a hora padrão
    // let relativeDiff = standardMeridian - coords.lng;
    // OBS se Diff maior que 15 graus, deve ser feito ajuste
    // no valor da hora também, não somente nos minutos e segundos
    const objectCurrection = currectionTime({ gmtOffset, lng: coords.lng, dateTimeLoc: date });
    const SMT = correctionArrayHour([12, 0, 0], objectCurrection);
    sunPosition.setDateTime(new Date(date.getFullYear(), date.getMonth(), date.getDay(), SMT[0], SMT[1], SMT[2]));
    await sunPosition.getElevation();
    return ((await sunPosition.getAzimuth() >= 90) && (await sunPosition.getAzimuth() <= 270)) ? "S" : "N";
};

const currectionTime = ({ gmtOffset, lng, dateTimeLoc }: { gmtOffset: number, lng: number, dateTimeLoc: Date }) => {
    const date = dateTimeLoc;
    const dateInit = new Date(`01/01/${date.getFullYear()}`);
    const dateEnd = date;
    const diff = Math.floor(dateEnd.getTime() - dateInit.getTime());
    const dayYear = diff / (1e3 * 60 * 60 * 24);
    const x = 360 / 365 * (dayYear - 81);

    const STANDARD_MERIDIAN = gmtOffset ? gmtOffset / (60 * 60) * 15 : Math.round(lng / 15) * 15;
    const currection = (STANDARD_MERIDIAN - lng) * 4 - (9.87 * Math.sin(degreesToRadians(2 * x)) -
        7.53 * Math.cos(degreesToRadians(x)) - 1.5 * Math.sin(degreesToRadians(x)));
    const minutes = Math.floor(currection);
    const seconds = Math.floor((currection - minutes) * 60);
    return {
        minutes,
        seconds,
    };
};
