import { CronJob } from "cron";
import express from "express";

import { runner } from "./runner";

console.log("Running cron.. 2");
CronJob.from({
  cronTime: "0 21 * * *", // everyday at 21pm
  onTick: runner,
  start: true,
  timeZone: "Europe/Rome",
});

const app = express();

app.get("/", (req, res) => {
  res.send("V4.0.0");
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
