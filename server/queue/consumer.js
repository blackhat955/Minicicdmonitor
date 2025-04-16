import amqp from 'amqplib';

export class JobQueueConsumer {
  constructor(jobProcessor) {
    this.connection = null;
    this.channel = null;
    this.queueName = 'build.jobs.queue';
    this.jobProcessor = jobProcessor;
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log('✅ Worker connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async startConsuming() {
    try {
      await this.channel.consume(this.queueName, async (msg) => {
        if (msg) {
          const jobData = JSON.parse(msg.content.toString());
          console.log('📦 Received job:', jobData.id);
          
          try {
            await this.jobProcessor(jobData);
            this.channel.ack(msg);
            console.log('✅ Job processed successfully:', jobData.id);
          } catch (error) {
            console.error('❌ Error processing job:', error);
            // Reject the message and requeue it
            this.channel.nack(msg, false, true);
          }
        }
      });
      console.log('🎯 Worker ready to consume jobs');
    } catch (error) {
      console.error('❌ Error starting consumer:', error);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('✅ Worker RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing worker RabbitMQ connection:', error);
    }
  }
}