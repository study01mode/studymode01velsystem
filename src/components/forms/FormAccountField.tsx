import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Account } from '../../types/account';
import AccountSelectModal from '../AccountSelectModal';
import AccountDisplay from '../account/AccountDisplay';
import PaymentModeSelector from '../account/PaymentModeSelector';

interface FormAccountFieldProps {
  accounts: Account[];
  selectedAccount?: Account;
  selectedPaymentModeId?: string;
  onAccountSelect: (account: Account) => void;
  onPaymentModeSelect: (paymentModeId: string) => void;
  label?: string;
  title?: string;
  showPaymentModes?: boolean;
  excludeAccountId?: string;
  error?: string;
  backgroundColor?: string;
}

function FormAccountField({
  accounts,
  selectedAccount,
  selectedPaymentModeId,
  onAccountSelect,
  onPaymentModeSelect,
  label = 'Account',
  title = 'Select Account',
  showPaymentModes = true,
  excludeAccountId,
  error,
  backgroundColor = 'bg-gray-50'
}: FormAccountFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedPaymentMode = selectedAccount?.linkedPaymentModes?.find(
    pm => pm.id === selectedPaymentModeId
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Change
          </button>
        </div>

        {selectedAccount ? (
          <div className="space-y-2 sm:space-y-3">
            <AccountDisplay account={selectedAccount} />

            {showPaymentModes && selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
              <PaymentModeSelector
                paymentModes={selectedAccount.linkedPaymentModes}
                selectedPaymentModeId={selectedPaymentModeId}
                onSelect={onPaymentModeSelect}
              />
            )}
          </div>
        ) : (
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
            No account selected
          </div>
        )}

        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
        )}
      </div>

      <AccountSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          onAccountSelect(account);
          setIsModalOpen(false);
        }}
        onPaymentModeSelect={onPaymentModeSelect}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={selectedPaymentModeId}
        title={title}
        showPaymentModes={showPaymentModes}
        excludeAccountId={excludeAccountId}
      />
    </>
  );
}

export default FormAccountField;
