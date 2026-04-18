import cron from 'node-cron';
import { fullSync } from './sync';

const schedule = process.env.SYNC_CRON_SCHEDULE || '0 */6 * * *';

const syncJob = cron.schedule(schedule, async () => {
  console.log('Running scheduled sync...');
  try {
    await fullSync();
    console.log('Scheduled sync completed');
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});

export function startCron() {
  const enabled = process.env.ENABLE_SYNC_CRON === 'true';
  if (!enabled) {
    console.log('Sync cron is disabled (set ENABLE_SYNC_CRON=true to enable)');
    return;
  }

  if ((globalThis as { __syncCronStarted?: boolean }).__syncCronStarted) {
    return;
  }

  (globalThis as { __syncCronStarted?: boolean }).__syncCronStarted = true;
  console.log('Cron jobs started');
  syncJob.start();
}

export function stopCron() {
  syncJob.stop();
}
