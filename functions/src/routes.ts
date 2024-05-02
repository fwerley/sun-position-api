import express = require("express");
import DateController from "./Controllers/DateController";

const routes = express.Router();

routes.get("/", (req, res) => {
    return res.status(200).send("Hello World");
});

routes.get("/:name", (req: express.Request, res) => {
    const {name} = req.params;
    return res.status(200).json({name});
});

routes.post("/data", DateController.index);

export {routes};
