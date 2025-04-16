import amqp from 'amqplib';

export class JobQueueProducer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queueName = 'build.jobs.queue';
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publishJob(jobData) {
    try {
      await this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(jobData)),
        { persistent: true }
      );
      console.log('✅ Job published to queue:', jobData.id);
    } catch (error) {
      console.error('❌ Error publishing job:', error);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('✅ RabbitMQ connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    }
  }
}