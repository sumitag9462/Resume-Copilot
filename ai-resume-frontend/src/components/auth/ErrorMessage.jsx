import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 p-3 rounded-md border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

