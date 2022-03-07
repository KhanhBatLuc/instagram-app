import express from "express";
import bodyParser from "body-parser";
import { env } from "*/config/environment";
import mongoose from "mongoose";
import { api } from "*/routes";

const cors = require("cors");
var cookieParser = require("cookie-parser");

// connect db
mongoose
  .connect(env.URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connect db success"))
  .then(() => bootServer())
  .catch((error) => {
    console.log(error);
    // when connect fail , instantly stop app
    process.exit(1);
  });

// Init server when connect db success
const bootServer = () => {
  const app = express();
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  // parse application/json
  app.use(bodyParser.json());

  // block request
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(cookieParser());

  app.use("/api/v1", api);
  //
  //   app.use((req, res, next) => {
  //     const error = createError.BadRequest("This page does not exits >");
  //     next(error);
  //     console.log(error);
  //   });
  //   app.use((error, req, res, next) => {
  //     res.json({
  //       status: error.status || 400,
  //       message: error.message,
  //     });
  //   });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`app running http://${env.APP_HOST}:${env.APP_PORT}/`);
  });
};
