import React from 'react';
import { X } from 'lucide-react';

interface LogViewerProps {
  logs: string[];
  onClose: () => void;
}

export function LogViewer({ logs, onClose }: LogViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Job Logs</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-green-400 font-mono text-sm">
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
}