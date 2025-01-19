import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Sun Position API",
            description: "Endpoints for applications based on data consumption in JSON format. " +
                "Provides the main functionalities related to the Sun Position library and the Sun Position Platform.",
        },
        servers: [
            {
                url: "https://us-central1-sun-position-app.cloudfunctions.net/app/v1",
            },
            {
                url: "http://127.0.0.1:5001/sun-position-app/us-central1/app/v1",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                },
                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",                    
                },                                              
            },
        },
        externalDocs: {
            url: "https://us-central1-sun-position-app.cloudfunctions.net/app/v1/docs.json",
            description: "JSON Parameters Documentation"            
        }
    },
    apis: ['../functions/src/routes.ts', '../functions/src/schemas/*.schema.ts'],
    // apis: ['../**/routes.ts'],
}

const personalOptions = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Sun Position API",
    customfavIcon: "/sun-position-app/us-central1/app/static/sun-position-ico.png",
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express, version: string, host: string | undefined = undefined) {
    // Swagger page
    app.use(`/${version}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, personalOptions));
    // Docs in JSON format
    app.get(`/${version}/docs.json`, (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;