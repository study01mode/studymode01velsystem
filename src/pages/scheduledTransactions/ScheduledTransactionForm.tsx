import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, RefreshCw, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useCreateScheduledTransaction,
  useUpdateScheduledTransaction,
  useScheduledTransaction
} from '../../hooks/useScheduledTransactions';
import {
  useCategoriesByType,
  useDefaultCategory
} from '../../hooks/useCategories';
import {
  useAccounts,
  useDefaultPaymentMode
} from '../../hooks/useAccounts';
import { CreateScheduledTransactionData, FREQUENCY_OPTIONS, EARLY_REMINDER_OPTIONS, END_TYPE_OPTIONS, FREQUENCY_TYPE_MAP, END_TYPE_MAP, REVERSE_FREQUENCY_MAP, REVERSE_END_TYPE_MAP } from '../../types/scheduledTransaction';
import CategorySelectModal from '../../components/CategorySelectModal';
import AccountSelectModal from '../../components/AccountSelectModal';
import FrequencyModal from '../../components/FrequencyModal';
import EarlyReminderModal from '../../components/EarlyReminderModal';
import CategoryIcon from '../../components/CategoryIcon';
import AccountDisplay from '../../components/account/AccountDisplay';
import PaymentModeSelector from '../../components/account/PaymentModeSelector';
import TransferAccountSection from '../../components/account/TransferAccountSection';
import FormHeader from '../../components/forms/FormHeader';
import FormDateTimeFields from '../../components/forms/FormDateTimeFields';
import FormAmountField from '../../components/forms/FormAmountField';
import FormDescriptionField from '../../components/forms/FormDescriptionField';
import FormTagsField from '../../components/forms/FormTagsField';
import FormActions from '../../components/forms/FormActions';
import FormLoadingSkeleton from '../../components/forms/FormLoadingSkeleton';

const tabs = ['Expense', 'Income', 'Transfer'];

interface FormData {
  startDate: string;
  startTime: string;
  amount: number;
  description: string;
  frequencyType: string;
  frequencyInterval: number;
  endType: string;
  occurrence: number;
  remainderDays: number;
  tags: string[];
  categoryId?: string;
  accountId?: string;
  paymentModeId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
}

function ScheduledTransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const defaultTags = ['subscription', 'recurring', 'monthly', 'bills', 'salary', 'rent', 'utilities', 'insurance'];
  const [activeTab, setActiveTab] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isToAccountModalOpen, setIsToAccountModalOpen] = useState(false);
  const [isFromAccountModalOpen, setIsFromAccountModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isEarlyReminderModalOpen, setIsEarlyReminderModalOpen] = useState(false);

  const { data: transaction, isLoading: transactionLoading } = useScheduledTransaction(id || '');
  const createTransaction = useCreateScheduledTransaction();
  const updateTransaction = useUpdateScheduledTransaction();

  // Get categories and accounts
  const currentType = activeTab === 0 ? 1 : activeTab === 1 ? 2 : 1; // For transfer, use expense categories
  const { data: categories = [] } = useCategoriesByType(currentType);
  const { data: defaultCategory } = useDefaultCategory(currentType);
  const { data: accounts = [] } = useAccounts();
  const { data: defaultPaymentMode } = useDefaultPaymentMode();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      startTime: '00:00:00',
      amount: 0,
      description: '',
      frequencyType: 'NONE',
      frequencyInterval: 1,
      endType: 'NONE',
      occurrence: 1,
      remainderDays: 0,
      tags: [],
      categoryId: '',
      accountId: '',
      paymentModeId: '',
      fromAccountId: '',
      toAccountId: '',
      fromPaymentModeId: '',
      toPaymentModeId: ''
    }
  });

  const watchedValues = watch();
  const selectedCategory = categories.find(cat => cat.id === watchedValues.categoryId);
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);
  const selectedFromAccount = accounts.find(acc => acc.id === watchedValues.fromAccountId);
  const selectedToAccount = accounts.find(acc => acc.id === watchedValues.toAccountId);
  const selectedPaymentMode = selectedAccount?.linkedPaymentModes?.find(pm => pm.id === watchedValues.paymentModeId);

  // Load existing transaction data for editing
  useEffect(() => {
    if (isEditing && transaction) {
      const transactionType = transaction.type;
      setActiveTab(transactionType === 'EXPENSE' ? 0 : transactionType === 'INCOME' ? 1 : 2);
      setValue('startDate', transaction.startDate);
      setValue('startTime', transaction.time);
      setValue('amount', transaction.amount);
      setValue('description', transaction.description);
      setValue('frequencyType', REVERSE_FREQUENCY_MAP[transaction.frequencyType] || 'NONE');
      setValue('frequencyInterval', transaction.frequencyInterval);
      setValue('endType', REVERSE_END_TYPE_MAP[transaction.endType] || 'NONE');
      setValue('occurrence', transaction.occurrence);
      setValue('remainderDays', transaction.remainderDays || 0);
      setValue('tags', transaction.tags?.map(tag => tag.name) || []);
      setValue('categoryId', transaction.category?.id || '');
      setValue('accountId', transaction.account?.id || '');
      setValue('paymentModeId', transaction.paymentMode?.id || '');
      setValue('fromAccountId', transaction.fromAccount?.id || '');
      setValue('toAccountId', transaction.toAccount?.id || '');
      setValue('fromPaymentModeId', transaction.fromPaymentMode?.id || '');
      setValue('toPaymentModeId', transaction.toPaymentMode?.id || '');
    }
  }, [isEditing, transaction, setValue]);

  // Set defaults when not editing
  useEffect(() => {
    if (!isEditing) {
      if (defaultCategory && activeTab !== 2) {
        setValue('categoryId', defaultCategory.id);
      }

      if (accounts.length > 0) {
        const defaultAccount = accounts.find(acc => acc.default) || accounts[0];
        setValue('accountId', defaultAccount.id);
        if (defaultPaymentMode && defaultAccount.linkedPaymentModes?.some(pm => pm.id === defaultPaymentMode.id)) {
          setValue('paymentModeId', defaultPaymentMode.id);
        }
      }
    }
  }, [defaultCategory, defaultPaymentMode, accounts, activeTab, isEditing, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const transactionData: CreateScheduledTransactionData = {
        startDate: data.startDate,
        startTime: data.startTime,
        amount: data.amount,
        description: data.description,
        frequencyType: String(FREQUENCY_TYPE_MAP[data.frequencyType] || 1),
        frequencyInterval: data.frequencyInterval,
        endType: String(END_TYPE_MAP[data.endType] || 1),
        occurrence: data.occurrence,
        remainderDays: data.remainderDays,
        tags: data.tags,
        categoryId: activeTab === 2 ? undefined : data.categoryId,
        accountId: activeTab === 2 ? undefined : data.accountId,
        paymentModeId: activeTab === 2 ? undefined : data.paymentModeId,
        fromAccountId: activeTab === 2 ? data.fromAccountId : undefined,
        toAccountId: activeTab === 2 ? data.toAccountId : undefined,
        fromPaymentModeId: activeTab === 2 ? data.fromPaymentModeId : undefined,
        toPaymentModeId: activeTab === 2 ? data.toPaymentModeId : undefined
      };

      const transactionType = activeTab === 0 ? 'expense' : activeTab === 1 ? 'income' : 'transfer';

      if (isEditing && id) {
        await updateTransaction.mutateAsync({
          id,
          data: transactionData,
          transactionType
        });
      } else {
        await createTransaction.mutateAsync({
          ...transactionData,
          transactionType
        });
      }
    } catch (error) {
      console.error('Failed to save scheduled transaction:', error);
    }
  };

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };

  const isPending = createTransaction.isPending || updateTransaction.isPending;

  if (isEditing && transactionLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <FormHeader
        title={isEditing ? 'Edit Scheduled Transaction' : 'Add Scheduled Transaction'}
        subtitle={isEditing ? 'Update scheduled transaction details' : 'Create a recurring financial transaction'}
        onBack={() => navigate('/scheduled')}
        backLabel="Back to Scheduled Transactions"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Transaction Type Tabs */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
            Transaction Type
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab, index) => {
              const active = activeTab === index;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${active
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <FormDateTimeFields
          dateValue={watchedValues.startDate}
          timeValue={watchedValues.startTime.slice(0, 5)}
          onDateChange={(date) => setValue('startDate', date)}
          onTimeChange={(time) => setValue('startTime', time + ':00')}
          dateLabel="Start Date"
          timeLabel="Start Time"
          dateError={errors.startDate?.message}
          timeError={errors.startTime?.message}
          minDate={new Date().toISOString().split('T')[0]}
        />

        <FormAmountField
          register={register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
          error={errors.amount?.message}
          currentAmount={watchedValues.amount || 0}
          onAmountChange={handleAmountChange}
        />

        {/* Category (for Expense and Income) */}
        {activeTab !== 2 && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700">
                Category
              </label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Change
              </button>
            </div>

            {selectedCategory ? (
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} />
                <span className="text-sm sm:text-base font-medium text-gray-900">{selectedCategory.name}</span>
              </div>
            ) : (
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
                No category selected
              </div>
            )}
          </div>
        )}

        {/* Account (for Expense and Income) */}
        {activeTab !== 2 && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700">
                Account
              </label>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Change
              </button>
            </div>

            {selectedAccount ? (
              <div className="space-y-2 sm:space-y-3">
                <AccountDisplay account={selectedAccount} />

                {selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
                  <PaymentModeSelector
                    paymentModes={selectedAccount.linkedPaymentModes}
                    selectedPaymentModeId={watchedValues.paymentModeId}
                    onSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
                  />
                )}
              </div>
            ) : (
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
                No account selected
              </div>
            )}
          </div>
        )}

        {/* Transfer Accounts */}
        {activeTab === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <TransferAccountSection
              type="from"
              account={selectedFromAccount}
              selectedPaymentModeId={watchedValues.fromPaymentModeId}
              onAccountChange={() => setIsFromAccountModalOpen(true)}
              onPaymentModeSelect={(paymentModeId) => setValue('fromPaymentModeId', paymentModeId)}
              showPaymentModeGrid={false}
            />

            <TransferAccountSection
              type="to"
              account={selectedToAccount}
              selectedPaymentModeId={watchedValues.toPaymentModeId}
              onAccountChange={() => setIsToAccountModalOpen(true)}
              onPaymentModeSelect={(paymentModeId) => setValue('toPaymentModeId', paymentModeId)}
              showPaymentModeGrid={false}
            />
          </div>
        )}

        <FormDescriptionField
          register={register('description', { required: 'Description is required' })}
          error={errors.description?.message}
          placeholder="Enter transaction description"
        />

        <FormTagsField
          tags={watchedValues.tags}
          onTagsChange={(tags) => setValue('tags', tags)}
          defaultTags={defaultTags}
          maxSuggestions={3}
        />

        {/* Frequency */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Frequency
            </label>
            <button
              type="button"
              onClick={() => setIsFrequencyModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Change
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              <span className="text-sm sm:text-base font-medium text-gray-900">
                {FREQUENCY_OPTIONS[watchedValues.frequencyType]}
                {watchedValues.frequencyType !== 'NONE' && watchedValues.frequencyInterval > 1 &&
                  ` (every ${watchedValues.frequencyInterval} periods)`
                }
              </span>
            </div>
            
            {watchedValues.endType !== 'NONE' && (
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-600">
                  {END_TYPE_OPTIONS[END_TYPE_MAP[watchedValues.endType]] || END_TYPE_OPTIONS['1']}
                  {watchedValues.endType === 'AFTER_OCCURRENCES' && ` (${watchedValues.occurrence} times)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Early Reminder */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Early Reminder
            </label>
            <button
              type="button"
              onClick={() => setIsEarlyReminderModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Change
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="text-sm sm:text-base font-medium text-gray-900">
              {EARLY_REMINDER_OPTIONS.find(option => option.value === watchedValues.remainderDays)?.label || 'None'}
            </span>
          </div>
        </div>

        <FormActions
          onCancel={() => navigate('/scheduled')}
          submitLabel={isEditing ? 'Update Scheduled Transaction' : 'Create Scheduled Transaction'}
          isPending={isPending}
          error={(createTransaction.error || updateTransaction.error) ? 'Failed to save scheduled transaction. Please try again.' : null}
        />
      </form>

      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSelect={(category) => setValue('categoryId', category.id)}
        selectedCategory={selectedCategory}
        title={`Select ${tabs[activeTab]} Category`}
      />

      <AccountSelectModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('accountId', account.id);
          setValue('paymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={watchedValues.paymentModeId}
        title="Select Account"
        showPaymentModes={true}
      />

      <AccountSelectModal
        isOpen={isFromAccountModalOpen}
        onClose={() => setIsFromAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('fromAccountId', account.id);
          setValue('fromPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('fromPaymentModeId', paymentModeId)}
        selectedAccount={selectedFromAccount}
        selectedPaymentModeId={watchedValues.fromPaymentModeId}
        title="Select From Account"
        showPaymentModes={true}
      />

      <AccountSelectModal
        isOpen={isToAccountModalOpen}
        onClose={() => setIsToAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('toAccountId', account.id);
          setValue('toPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('toPaymentModeId', paymentModeId)}
        selectedAccount={selectedToAccount}
        selectedPaymentModeId={watchedValues.toPaymentModeId}
        title="Select Destination Account"
        excludeAccountId={watchedValues.fromAccountId}
        showPaymentModes={true}
      />

      <FrequencyModal
        isOpen={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        currentFrequency={watchedValues.frequencyType}
        currentEndType={watchedValues.endType}
        currentInterval={watchedValues.frequencyInterval}
        currentOccurrence={watchedValues.occurrence}
        onUpdate={(frequency, endType, interval, occurrence) => {
          setValue('frequencyType', frequency);
          setValue('endType', endType);
          setValue('frequencyInterval', interval);
          setValue('occurrence', occurrence);
        }}
      />

      <EarlyReminderModal
        isOpen={isEarlyReminderModalOpen}
        onClose={() => setIsEarlyReminderModalOpen(false)}
        currentReminder={watchedValues.remainderDays}
        onUpdate={(reminder) => setValue('remainderDays', reminder)}
      />
    </div>
  );
}

export default ScheduledTransactionForm;