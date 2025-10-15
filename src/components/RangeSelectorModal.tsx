// RangeSelectorModal.tsx
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RangeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeCode: 1 | 2 | 3; // 1=All Time, 2=Month, 3=Year
  setRangeCode: (code: 1 | 2 | 3) => void;
}

export default function RangeSelectorModal({
  isOpen,
  onClose,
  rangeCode,
  setRangeCode,
}: RangeSelectorModalProps) {
  // ✅ Always call hooks unconditionally
  const [selectedCode, setSelectedCode] = useState(rangeCode);

  // 🔹 Reset selectedCode whenever modal opens
  useEffect(() => {
    if (isOpen) setSelectedCode(rangeCode);
  }, [isOpen, rangeCode]);

  if (!isOpen) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSelect = () => {
    setRangeCode(selectedCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select Range
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
          {/* Month */}
          <button
            onClick={() => setSelectedCode(2)}
            className={`w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${
              selectedCode === 2 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' : ''
            }`}
          >
            <p className="font-medium text-gray-800 dark:text-gray-100">Month</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(monthStart)} - {formatDate(monthEnd)}
            </p>
          </button>

          {/* Year */}
          <button
            onClick={() => setSelectedCode(3)}
            className={`w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${
              selectedCode === 3 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' : ''
            }`}
          >
            <p className="font-medium text-gray-800 dark:text-gray-100">Year</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(yearStart)} - {formatDate(yearEnd)}
            </p>
          </button>

          {/* All Time */}
          <button
            onClick={() => setSelectedCode(1)}
            className={`w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${
              selectedCode === 1 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' : ''
            }`}
          >
            <p className="font-medium text-gray-800 dark:text-gray-100">All Time</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Summary of all transactions
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}