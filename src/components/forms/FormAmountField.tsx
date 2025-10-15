import { Calculator as CalculatorIcon } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';
import CalculatorModal from '../CalculatorModal';

interface FormAmountFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
  currentAmount: number;
  onAmountChange: (amount: number) => void;
  label?: string;
  showCalculator?: boolean;
}

function FormAmountField({
  register,
  error,
  currentAmount,
  onAmountChange,
  label = 'Amount',
  showCalculator = true
}: FormAmountFieldProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="amount" className="block text-sm sm:text-base font-medium text-gray-700">
            {label}
          </label>
          {showCalculator && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
            >
              <CalculatorIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Calculator
            </button>
          )}
        </div>
        <input
          {...register}
          type="number"
          step="0.01"
          id="amount"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
        />
        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
        )}
      </div>

      {showCalculator && (
        <CalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          onAmountChange={onAmountChange}
          currentAmount={currentAmount}
        />
      )}
    </>
  );
}

export default FormAmountField;
