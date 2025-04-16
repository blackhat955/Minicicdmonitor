import { JobQueueConsumer } from './queue/consumer.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processJob(jobData) {
  // Simulate different job stages
  const stages = [
    { status: 'RUNNING', log: 'Starting job execution...' },
    { status: 'RUNNING', log: 'Installing dependencies...' },
    { status: 'RUNNING', log: 'Running tests...' },
    { status: 'RUNNING', log: 'Building application...' },
    { status: 'SUCCESS', log: 'Job completed successfully!' }
  ];

  for (const stage of stages) {
    // Update job status and logs
    jobData.status = stage.status;
    jobData.logs.push(`[${new Date().toISOString()}] ${stage.log}`);
    jobData.updatedAt = new Date().toISOString();

    // Publish update to GraphQL subscribers
    pubsub.publish('JOB_STATUS_CHANGED', {
      jobStatusChanged: jobData
    });

    // Simulate work being done
    await sleep(2000);
  }
}

async function startWorker() {
  const consumer = new JobQueueConsumer(processJob);
  
  try {
    await consumer.connect();
    await consumer.startConsuming();
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await consumer.close();
    process.exit(0);
  });
}

startWorker().catch(console.error);