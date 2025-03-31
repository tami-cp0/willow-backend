import cron, { ScheduledTask } from 'node-cron';
import cache from './cache';
import customerController from '../controllers/customer';
import { activeConnections } from '../controllers/chat';

const jobRegistry = new Map<string, ScheduledTask>();

/**
 * Adds a cron job to the registry for a given user.
 * @param userId - The user's unique identifier.
 * @param job - The cron job instance to store.
 */
export function addJob(userId: string, job: ScheduledTask): void {
  jobRegistry.set(userId, job);
}

/**
 * Retrieves the cron job for a given user.
 * @param userId - The user's unique identifier.
 * @returns The cron job instance if it exists, otherwise undefined.
 */
export function getJob(userId: string): ScheduledTask | undefined {
  return jobRegistry.get(userId);
}

/**
 * Deletes the cron job for a given user by stopping it and removing it from the registry.
 * @param userId - The user's unique identifier.
 */
export function deleteJob(userId: string): void {
  const job = jobRegistry.get(userId);
  if (job) {
    job.stop();
    jobRegistry.delete(userId);
  }
}

/**
 * Schedules a cron job to update recommendations for a user every 5 minutes.
 *
 * The job checks the cache for the user's activity; if the user is inactive, it closes users active web socket and the job stops.
 * Otherwise, it triggers the computeRecommendations function to update recommendations.
 *
 * @param userId - The unique identifier of the user.
 * @returns The scheduled cron job instance.
 */
export async function scheduleRecommendationUpdates(userId: string) {
    const job = cron.schedule('*/5 * * * *', async () => {
      try {
        // Check if the user is active in your cache
        const cachedUser = await cache.getUser(userId);
        if (!cachedUser) {
          console.log(`User ${userId} inactive. Stopping recommendation updates.`);
          deleteJob(userId)
          job.stop();

          // Close the user's active WebSocket connection
          if (activeConnections.has(userId)) {
            activeConnections.get(userId)?.close();
            activeConnections.delete(userId);
          }
          return;
        }

        // Update recommendations if user is active
        await customerController.computeRecommendations(userId);
      } catch (error) {
        console.error(`Error updating recommendations for user ${userId}:`, error);
        throw error
      }
    });
  
    addJob(userId, job);
    return job
}