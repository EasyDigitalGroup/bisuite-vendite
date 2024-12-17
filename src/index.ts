import { CronJob } from "cron";

import { runner } from "./runner";

console.log("Running cron.. 2");
CronJob.from({
  cronTime: "0 21 * * *", // everyday at 21pm
  onTick: runner,
  start: true,
  timeZone: "Europe/Rome",
});
