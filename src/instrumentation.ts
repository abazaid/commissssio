import { startCron } from './lib/cron';

export async function register() {
  startCron();
}

