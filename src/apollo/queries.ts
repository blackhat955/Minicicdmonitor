import { gql } from '@apollo/client';

export const GET_PIPELINES = gql`
  query GetPipelines {
    pipelines {
      id
      name
      createdAt
      updatedAt
      jobs {
        id
        name
        status
        logs
        createdAt
        updatedAt
      }
    }
  }
`;

export const TRIGGER_JOB = gql`
  mutation TriggerJob($pipelineId: ID!) {
    triggerJob(pipelineId: $pipelineId) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;

export const JOB_STATUS_SUBSCRIPTION = gql`
  subscription OnJobStatusChanged {
    jobStatusChanged {
      id
      name
      status
      logs
      createdAt
      updatedAt
    }
  }
`;