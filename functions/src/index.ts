import * as functions from "firebase-functions";
import cors = require("cors");
import express = require("express");
import { routes } from "./routes";
import swaggerUi = require("swagger-ui-express");
import * as swaggerFile from "./swagger_output.json";

const app = express();

const options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Sun Position API",
    customfavIcon: "/sun-position-app/us-central1/app/static/sun-position-ico.png",
};

// Returns a middleware to serve favicon
app.use("/static", express.static("./public"));
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/v1/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));
app.use("/v1", routes);

exports.app = functions.https.onRequest(app);
