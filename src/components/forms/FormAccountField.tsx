import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Account, PaymentMode } from '../../types/account';
import AccountSelectModal from '../AccountSelectModal';

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
            <div className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 ${backgroundColor} rounded-lg`}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm sm:text-base font-medium">
                  {selectedAccount.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-900">{selectedAccount.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 capitalize">{selectedAccount.type}</p>
              </div>
            </div>

            {showPaymentModes && selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Payment Mode (Optional)
                </label>
                {selectedPaymentMode ? (
                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                      <span className="text-blue-600 text-xs sm:text-sm font-medium">PM</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{selectedPaymentMode.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{selectedPaymentMode.type}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedAccount.linkedPaymentModes.map((paymentMode: PaymentMode) => (
                      <button
                        key={paymentMode.id}
                        type="button"
                        onClick={() => onPaymentModeSelect(paymentMode.id)}
                        className={`p-2 sm:p-3 text-left border rounded-lg transition-colors ${
                          selectedPaymentModeId === paymentMode.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{paymentMode.name}</p>
                        <p className="text-xs text-gray-500">{paymentMode.type}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
