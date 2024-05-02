import * as functions from "firebase-functions";
import cors = require("cors");
import express = require("express");
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use("/v1", routes);

exports.app = functions.https.onRequest(app);
