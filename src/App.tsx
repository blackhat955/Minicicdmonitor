import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { PipelineList } from './components/PipelineList';
import { LogViewer } from './components/LogViewer';
import { GET_PIPELINES, TRIGGER_JOB, JOB_STATUS_SUBSCRIPTION } from './apollo/queries';
import type { Pipeline, Job } from './types';

function App() {
  const [selectedJobLogs, setSelectedJobLogs] = useState<string[] | null>(null);
  const { loading, error, data } = useQuery(GET_PIPELINES);
  const [triggerJob] = useMutation(TRIGGER_JOB);

  const { data: subscriptionData } = useSubscription(JOB_STATUS_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData?.jobStatusChanged) {
      // Update the job status in the UI
      const updatedJob = subscriptionData.jobStatusChanged;
      console.log('Job status updated:', updatedJob);
    }
  }, [subscriptionData]);

  const handleTriggerJob = async (pipelineId: string) => {
    try {
      await triggerJob({
        variables: { pipelineId },
      });
    } catch (err) {
      console.error('Error triggering job:', err);
    }
  };

  const handleViewLogs = (jobId: string) => {
    const job = data?.pipelines
      .flatMap((p: Pipeline) => p.jobs)
      .find((j: Job) => j.id === jobId);
    if (job) {
      setSelectedJobLogs(job.logs);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading pipelines: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Mini CI/CD Monitor</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PipelineList
          pipelines={data?.pipelines || []}
          onTriggerJob={handleTriggerJob}
          onViewLogs={handleViewLogs}
        />
      </main>

      {selectedJobLogs && (
        <LogViewer
          logs={selectedJobLogs}
          onClose={() => setSelectedJobLogs(null)}
        />
      )}
    </div>
  );
}

export default App;