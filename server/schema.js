export const typeDefs = `#graphql
  type Job {
    id: ID!
    name: String!
    status: JobStatus!
    logs: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Pipeline {
    id: ID!
    name: String!
    jobs: [Job!]!
    createdAt: String!
    updatedAt: String!
  }

  enum JobStatus {
    PENDING
    RUNNING
    SUCCESS
    FAILED
  }

  type Query {
    pipelines: [Pipeline!]!
    pipeline(id: ID!): Pipeline
    job(id: ID!): Job
  }

  type Mutation {
    triggerJob(pipelineId: ID!): Job!
  }

  type Subscription {
    jobStatusChanged: Job!
  }
`;

// Mock data for development
const mockPipelines = [
  {
    id: '1',
    name: 'Frontend Build',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jobs: [
      {
        id: '1',
        name: 'Install Dependencies',
        status: 'SUCCESS',
        logs: ['Installing dependencies...', 'Dependencies installed successfully'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Run Tests',
        status: 'RUNNING',
        logs: ['Running tests...'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    name: 'Backend Deploy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jobs: [
      {
        id: '3',
        name: 'Build Docker Image',
        status: 'PENDING',
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

let jobQueue;

export const initializeJobQueue = (queue) => {
  jobQueue = queue;
};

export const resolvers = {
  Query: {
    pipelines: () => mockPipelines,
    pipeline: (_, { id }) => mockPipelines.find(p => p.id === id),
    job: (_, { id }) => {
      const job = mockPipelines
        .flatMap(p => p.jobs)
        .find(j => j.id === id);
      return job;
    },
  },
  Mutation: {
    triggerJob: async (_, { pipelineId }) => {
      const pipeline = mockPipelines.find(p => p.id === pipelineId);
      if (!pipeline) {
        throw new Error('Pipeline not found');
      }

      const newJob = {
        id: `job-${Date.now()}`,
        name: 'New Job',
        status: 'PENDING',
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      pipeline.jobs.push(newJob);

      // Publish job to RabbitMQ queue
      if (jobQueue) {
        await jobQueue.publishJob(newJob);
      }

      return newJob;
    },
  },
  Subscription: {
    jobStatusChanged: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['JOB_STATUS_CHANGED']),
    },
  },
};