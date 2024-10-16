import cron from 'node-cron';

export default class Cron {
  constructor() {
    this.task = null;
  }

  startJob(schedule, callback) {
    if (this.task) {
      this.task.stop();
    }

    this.task = cron.schedule(
      schedule,
      () => {
        callback();
      },
      {
        scheduled: false,
        timezone: 'Europe/Warsaw'
      }
    );

    this.task.start();
  }

  validate(expression) {
    return cron.validate(expression);
  }
}
