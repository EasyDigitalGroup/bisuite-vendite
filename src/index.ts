import { CronJob } from "cron";

import { runner } from "./runner";

console.log("Running cron..");
CronJob.from({
  cronTime: "0 21 * * *", // everyday at 21pm
  onTick: runner,
  start: true,
  timeZone: "Europe/Rome",
});
