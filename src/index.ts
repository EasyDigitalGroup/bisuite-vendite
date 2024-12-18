import { CronJob } from "cron";
import express from "express";

import { runner } from "./runner";

console.log("Running cron.. 2");
CronJob.from({
  cronTime: "*/5 * * * *", // every 5 minutes
  onTick: runner,
  start: true,
  timeZone: "Europe/Rome",
});

const app = express();

app.get("/", (req, res) => {
  res.send("V4.0.0");
});

app.listen(4000, () => {
  console.log("Server is running on port http://localhost:4000");
});
