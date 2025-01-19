import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *           description: The unique identifier for the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         lat:
 *          type: number
 *          description: The latitude of the project
 *         lng:
 *          type: number
 *          description: The longitude of the project
 *         timeZone:
 *          type: object
 *          properties:
 *           gmtOffset:
 *            type: number
 *            description: The GMT offset of the project
 *           zoneName:
 *            type: string
 *            description: The zone name of the project
 *         createdAt:
 *          type: string
 *          format: date-time
 *          description: The date and time the project was created
 *       example:
 *        tag: Bh7d8s...
 *        name: Project Name
 *        lat: 12.3456
 *        lng: 12.3456
 *        timeZone:
 *         gmtOffset: 0
 *         zoneName: GMT
 *        createdAt: 2021-09-01T00:00:00.000Z
 *     CreateProject:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        description: The name of the project
 *       lat:
 *        type: number
 *        description: The latitude of the project
 *       lng:
 *        type: number
 *        description: The longitude of the project
 *      required:
 *       - name
 *       - lat
 *       - lng
 *      example:
 *       body:
 *        name: Project Name
 *        lat: 12.3456
 *        lng: 12.3456
 *     UpdateProject:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        description: The name of the project
 *       lat:
 *        type: number
 *        description: The latitude of the project
 *       lng:
 *        type: number
 *        description: The longitude of the project
 *      required:
 *       - name
 *       - lat
 *       - lng
 *      example:
 *       name: Updated Project Name
 *       lat: 12.3456
 *       lng: 12.3456
 */

const ProjectSchema = z.object({
    tag: z.string(),
    name: z.string().min(1, "Name is required"),
    lat: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    lng: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    timeZone: z.object({
        gmtOffset: z.number(),
        zoneName: z.string(),
    }),
    createdAt: z.date(),
});

const UpdateProjectSchema = z.object({
    body: ProjectSchema.omit({ createdAt: true }),
});

const CreateProjectSchema = z.object({
    body: ProjectSchema.omit({ createdAt: true, tag: true }),
});

export { ProjectSchema, CreateProjectSchema, UpdateProjectSchema };

export type Project = z.infer<typeof ProjectSchema>;
