import * as functions from "firebase-functions";
import cors = require("cors");
import express = require("express");
import { routes } from "./routes";
import swaggerDocs from "./swagger";

const app = express();

// Returns a middleware to serve favicon
app.use("/static", express.static("./public"));
app.use(cors({ origin: true }));
app.use(express.json());
swaggerDocs(app, "v1");
app.use("/v1", routes);

exports.app = functions.https.onRequest(app);
