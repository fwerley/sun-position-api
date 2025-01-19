
import { z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *   SunData:
 *    type: object
 *    properties:
 *      data:
 *        type: object
 *        properties:
 *         lat:
 *          type: number
 *          description: Entry latitude
 *         lng:
 *          type: number
 *          description: Entry latitude
 *         dateTime:
 *          type: date-time
 *          description: Entry date           
 *      durationDay:
 *       type: array
 *       items:
 *        type: number
 *        description: Array containing the length of the day in hours, minutes and seconds
 *      declinationAngle:
 *       type: number
 *       description: Declination angle
 *      timeZone:
 *       type: object
 *       properties:
 *        gmtOffset:
 *         type: number
 *         description: Offset of GMT in seconds
 *        zoneName:
 *         type: string
 *         description: Name of the respective time zone
 *      locTime:
 *       type: object
 *       properties:
 *        moment:
 *         type: date-time
 *         description: Local search time
 *        sunrise:
 *         type: date-time
 *         description: Local sunrise time
 *        sunset:
 *         type: date-time
 *         description: Local sunset time
 *        sunriseAngle:
 *         type: object
 *         properties:
 *          elevation:
 *           type: number
 *           description: Elevation angle at sunrise
 *          azimuth:
 *           type: number
 *           description: Azimuth angle at sunrise
 *        sunsetAngle:
 *         type: object
 *         properties:
 *          elevation:
 *           type: number
 *           description: Elevation angle at sunset
 *          azimuth:
 *           type: number
 *           description: Azimuth angle at sunset
 *      sunTime:
 *       type: object
 *       properties:
 *        moment:
 *         type: date-time
 *         description: Local solar time
 *        sunrise:
 *         type: date-time
 *         description: Sunrise in solar time
 *        sunset:
 *         type: date-time
 *         description: Sunset in solar time
 *      elevation:
 *       type: number
 *       description: Sun elevation angle for the survey time
 *      azimuth:
 *       type: number
 *       description: Azimuth angle of the Sun for the survey time
 *      trajectory:
 *       type: string
 *       description: Identifies the path of the Sun for the date of entry, N for north and S for south
 *    example:
 *     data: 
 *      lat: 12.543
 *      lng: 12.543
 *      dateTime: 2021-09-01 00:00:00.00
 *     durationDay: [12, 27, 34]
 *     declinationAngle: -10.45
 *     timeZone:
 *      gmtOffset: 0
 *      zoneName: GMT
 *     locTime:
 *      moment: 2021-09-01 00:00:00.00
 *      sunrise: 2021-09-01 06:00:00.00
 *      sunset: 2021-09-01 18:00:00.00
 *      sunriseAngle:
 *       elevation: 0.0045
 *       azimuth: 110.3445
 *      sunsetAngle:
 *       elevation: 0.0005
 *       azimuth: 260.3445
 *     sunTime:
 *      moment: 2021-09-01 01:00:00.00
 *      sunrise: 2021-09-01 07:00:00.00
 *      sunset: 2021-09-01 19:00:00.00
 *     elevation: -45.5645
 *     azimuth: 2.6943
 *     trajectory: N
 */

const Data = z.object({
    lat: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    lng: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    dateTime: z.date()
})

const SunDataSchema = z.object({
    data: Data,
    durationDay: z.number().array(),
    declinationAngle: z.number(),
    timeZone: z.object({
        gmtOffset: z.number(),
        zoneName: z.string(),
    }),
    locTime: z.object({
        moment: z.date(),
        sunrise: z.date(),
        sunset: z.date(),
        sunriseAngle: z.object({
            elevation: z.number(),
            azimuth: z.number(),
        }),
        sunsetAngle: z.object({
            elevation: z.number(),
            azimuth: z.number()
        })
    }),
    sunTime: z.object({
        moment: z.date(),
        sunrise: z.date(),
        sunset: z.date(),
    }),
    elevation: z.number(),
    azimuth: z.number(),
    trajectory: z.string(),
});

export { SunDataSchema };

export type SunData = z.infer<typeof SunDataSchema>;