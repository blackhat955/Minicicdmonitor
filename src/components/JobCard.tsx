import React from 'react';
import { Play, AlertCircle, CheckCircle, Clock, Terminal } from 'lucide-react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  onViewLogs: (jobId: string) => void;
}

const statusIcons = {
  PENDING: Clock,
  RUNNING: Play,
  SUCCESS: CheckCircle,
  FAILED: AlertCircle,
};

const statusColors = {
  PENDING: 'text-gray-500',
  RUNNING: 'text-blue-500',
  SUCCESS: 'text-green-500',
  FAILED: 'text-red-500',
};

export function JobCard({ job, onViewLogs }: JobCardProps) {
  const StatusIcon = statusIcons[job.status];
  const statusColor = statusColors[job.status];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
          <h3 className="font-semibold text-gray-800">{job.name}</h3>
        </div>
        <button
          onClick={() => onViewLogs(job.id)}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Terminal className="w-5 h-5" />
        </button>
      </div>
      <div className="text-sm text-gray-500">
        <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(job.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}