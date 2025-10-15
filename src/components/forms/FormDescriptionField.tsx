import { UseFormRegisterReturn } from 'react-hook-form';

interface FormDescriptionFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
}

function FormDescriptionField({
  register,
  error,
  label = 'Description',
  placeholder = 'Enter description',
  rows = 3
}: FormDescriptionFieldProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <label htmlFor="description" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...register}
        id="description"
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormDescriptionField;
