const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes.ts"];

const doc = {
    info: {
        version: "1.0.0",
        title: "Sun Position API",
        description: "[Sun Position API] Endpoints for applications based on data consumption in JSON format."+
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
        schemas: {
            signinSomeBody: {
                $email: "jhondoe@email.com",
                $password: "**********",
                $about: "",
            },
            signinSomeResponse: {
                status: "Success",
                msg: {
                    user: {
                        email: "jhondoe@email.com",
                        name: "Jhon Doe",
                        about: "",
                    },
                },
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./index.ts");
});
