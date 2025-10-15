interface FormActionsProps {
  onCancel: () => void;
  submitLabel: string;
  cancelLabel?: string;
  isPending?: boolean;
  error?: string | null;
}

function FormActions({
  onCancel,
  submitLabel,
  cancelLabel = 'Cancel',
  isPending = false,
  error
}: FormActionsProps) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
        >
          {cancelLabel}
        </button>
      </div>
    </>
  );
}

export default FormActions;
