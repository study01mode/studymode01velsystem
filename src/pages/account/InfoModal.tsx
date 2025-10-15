import React from 'react';
import { Edit, X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  body: string;
  showCustomize?: boolean;
  onClose: () => void;
  onCustomize?: () => void;
}

export default function InfoModal({
  isOpen,
  title,
  body,
  showCustomize = false,
  onClose,
  onCustomize
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Body */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{body}</p>

        {/* Customize button */}
        {showCustomize && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={onCustomize}
              className="px-4 py-2 flex rounded-lg items-center gap-2 bg-gray-300 text-gray-700 text-lg font-semibold transition"
            >
              <Edit className="w-4 h-4" /> <span>Customize</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}