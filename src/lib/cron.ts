import cron from 'node-cron';
import { fullSync } from './sync';

const syncJob = cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled sync...');
  try {
    await fullSync();
    console.log('Scheduled sync completed');
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});

export function startCron() {
  console.log('Cron jobs started');
  syncJob.start();
}

export function stopCron() {
  syncJob.stop();
}

if (require.main === module) {
  startCron();
}