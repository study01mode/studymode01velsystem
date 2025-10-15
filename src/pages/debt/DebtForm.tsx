import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCreateDebt, useUpdateDebt, useDebt } from '../../hooks/useDebts';
import { useAccounts } from '../../hooks/useAccounts';
import { CreateDebtData } from '../../types/debt';
import FormHeader from '../../components/forms/FormHeader';
import FormDateTimeFields from '../../components/forms/FormDateTimeFields';
import FormAmountField from '../../components/forms/FormAmountField';
import FormDescriptionField from '../../components/forms/FormDescriptionField';
import FormAccountField from '../../components/forms/FormAccountField';
import FormActions from '../../components/forms/FormActions';
import FormLoadingSkeleton from '../../components/forms/FormLoadingSkeleton';

interface FormData {
  personName: string;
  dueDate: string;
  additionalDetail: string;
  type: '1' | '2';
  date: string;
  amount: number;
  description: string;
  accountId: string;
  paymentModeId?: string;
  recordType: '1' | '2';
}

function DebtForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [step, setStep] = useState(1);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const debtType = location.state?.debtType as '1' | '2' | undefined;

  const { data: debt, isLoading: debtLoading } = useDebt(id || '');
  const { data: accounts = [] } = useAccounts();
  const createDebt = useCreateDebt();
  const updateDebt = useUpdateDebt();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      personName: '',
      dueDate: '',
      additionalDetail: '',
      type: debtType || '1',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      accountId: '',
      paymentModeId: '',
      recordType: debtType || '1'
    }
  });

  const watchedType = watch('type');
  const watchedValues = watch();
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };
  // Load existing debt data for editing
  useEffect(() => {
    if (isEditing && debt) {
      setValue('personName', debt.personName);
      setValue('dueDate', debt.dueDate);
      setValue('additionalDetail', debt.additionalDetail);
      setValue('type', debt.type);
      setValue('recordType', debt.type);
    }
  }, [isEditing, debt, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const debtData: CreateDebtData = {
        personName: data.personName,
        dueDate: data.dueDate,
        additionalDetail: data.additionalDetail,
        type: data.type,
        record: {
          date: data.date,
          amount: data.amount,
          description: data.description,
          accountId: data.accountId,
          paymentModeId: data.paymentModeId,
          type: data.recordType
        }
      };

      if (isEditing && id) {
        await updateDebt.mutateAsync({ id, data: debtData });
      } else {
        await createDebt.mutateAsync(debtData);
      }
    } catch (error) {
      console.error('Failed to save debt:', error);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/debts');
    } else {
      setStep(1);
    }
  };

  const isPending = createDebt.isPending || updateDebt.isPending;

  if (isEditing && debtLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <FormHeader
        title={isEditing ? 'Edit Debt' : step === 1 ? 'Create Debt' : 'Add Initial Transaction'}
        subtitle={
          isEditing
            ? 'Update debt details'
            : step === 1
              ? 'Enter debt information'
              : 'Add the initial transaction for this debt'
        }
        onBack={handleBack}
        backLabel={step === 1 ? 'Back to Debts' : 'Back to Debt Details'}
      />

      {/* Progress Indicator */}
      {!isEditing && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs sm:text-sm text-gray-600">Debt Details</span>
            <span className="text-xs sm:text-sm text-gray-600">Initial Transaction</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Step 1: Debt Details */}
        {(step === 1 || isEditing) && (
          <>
            {/* Debt Type */}
            {!isEditing && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
                  Debt Type
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('type', '1');
                      setValue('recordType', '1');
                    }}
                    className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${watchedType === '1'
                      ? "bg-white shadow text-black"
                      : "text-gray-500 hover:text-black"
                      }`}
                  >
                    Lending
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('type', '2');
                      setValue('recordType', '2');
                    }}
                    className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${watchedType === '2'
                      ? "bg-white shadow text-black"
                      : "text-gray-500 hover:text-black"
                      }`}
                  >
                    Borrowing
                  </button>
                </div>
              </div>
            )}

            {/* Person Name */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <label htmlFor="personName" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Person Name
              </label>
              <input
                {...register('personName', { required: 'Person name is required' })}
                type="text"
                id="personName"
                placeholder="Enter person's name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
              {errors.personName && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.personName.message}</p>
              )}
            </div>

            <FormDateTimeFields
              dateValue={watchedValues.dueDate}
              timeValue=""
              onDateChange={(date) => setValue('dueDate', date)}
              onTimeChange={() => {}}
              dateLabel="Due Date"
              dateError={errors.dueDate?.message}
              minDate={new Date().toISOString().split('T')[0]}
              showTime={false}
            />

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <label htmlFor="additionalDetail" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                {...register('additionalDetail')}
                id="additionalDetail"
                rows={3}
                placeholder="Enter additional details (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
          </>
        )}

        {/* Step 2: Initial Transaction */}
        {(step === 2 || isEditing) && (
          <>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Add Initial Transaction</h3>

              <FormDateTimeFields
                dateValue={watchedValues.date}
                timeValue=""
                onDateChange={(date) => setValue('date', date)}
                onTimeChange={() => {}}
                dateError={errors.date?.message}
                showTime={false}
              />

              <FormAmountField
                register={register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                error={errors.amount?.message}
                currentAmount={watchedValues.amount || 0}
                onAmountChange={handleAmountChange}
                showCalculator={false}
              />

              <FormDescriptionField
                register={register('description', { required: 'Description is required' })}
                error={errors.description?.message}
                placeholder="Enter transaction description"
              />

              <FormAccountField
                accounts={accounts}
                selectedAccount={selectedAccount}
                selectedPaymentModeId={watchedValues.paymentModeId}
                onAccountSelect={(account) => {
                  setValue('accountId', account.id);
                  setValue('paymentModeId', '');
                }}
                onPaymentModeSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
                error={errors.accountId?.message}
              />
            </div>
          </>
        )}

        {!isEditing && step === 1 ? (
          <>
            {(createDebt.error || updateDebt.error) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-red-600">
                  Failed to save debt. Please try again.
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
              >
                Next: Add Transaction
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <FormActions
            onCancel={handleBack}
            submitLabel={isEditing ? 'Update Debt' : 'Create Debt'}
            cancelLabel={step === 1 ? 'Cancel' : 'Back'}
            isPending={isPending}
            error={(createDebt.error || updateDebt.error) ? 'Failed to save debt. Please try again.' : null}
          />
        )}
      </form>
    </div>
  );
}

export default DebtForm;