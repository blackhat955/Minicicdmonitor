import React from 'react';
import { Play } from 'lucide-react';
import type { Pipeline } from '../types';
import { JobCard } from './JobCard';

interface PipelineListProps {
  pipelines: Pipeline[];
  onTriggerJob: (pipelineId: string) => void;
  onViewLogs: (jobId: string) => void;
}

export function PipelineList({ pipelines, onTriggerJob, onViewLogs }: PipelineListProps) {
  return (
    <div className="space-y-8">
      {pipelines.map((pipeline) => (
        <div key={pipeline.id} className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{pipeline.name}</h2>
            <button
              onClick={() => onTriggerJob(pipeline.id)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Trigger Job</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipeline.jobs.map((job) => (
              <JobCard key={job.id} job={job} onViewLogs={onViewLogs} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}