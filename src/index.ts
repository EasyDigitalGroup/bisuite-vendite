import { CronJob } from "cron";

import { runner } from "./runner";

console.log("Running cron..");
CronJob.from({
  cronTime: "* * * * *",
  onTick: runner,
  start: true,
});
console.log("Cron running!");
