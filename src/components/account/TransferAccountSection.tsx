import { Edit } from 'lucide-react';
import { Account } from '../../types/account';
import AccountDisplay from './AccountDisplay';
import PaymentModeSelector, { getPaymentModeIcon, getPaymentModeTypeName } from './PaymentModeSelector';

interface TransferAccountSectionProps {
  type: 'from' | 'to';
  account: Account | undefined;
  selectedPaymentModeId?: string;
  onAccountChange: () => void;
  onPaymentModeSelect: (paymentModeId: string) => void;
  showPaymentModeGrid?: boolean;
}

function TransferAccountSection({
  type,
  account,
  selectedPaymentModeId,
  onAccountChange,
  onPaymentModeSelect,
  showPaymentModeGrid = true
}: TransferAccountSectionProps) {
  const isFrom = type === 'from';
  const title = isFrom ? 'From Account' : 'To Account';

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <label className="block text-sm sm:text-base font-medium text-gray-700">
          {title}
        </label>
        <button
          type="button"
          onClick={onAccountChange}
          className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
        >
          <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Change
        </button>
      </div>

      {account ? (
        <div className="space-y-2 sm:space-y-3">
          <AccountDisplay account={account} variant={type} />

          {account.linkedPaymentModes && account.linkedPaymentModes.length > 0 && (
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                {isFrom ? 'From Payment Mode (Optional)' : 'To Payment Mode (Optional)'}
              </label>
              {showPaymentModeGrid ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {account.linkedPaymentModes.map((paymentMode) => (
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
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-gray-100">
                          {getPaymentModeIcon(paymentMode.type)}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{paymentMode.name}</p>
                          <p className="text-xs text-gray-500">{getPaymentModeTypeName(paymentMode.type)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <PaymentModeSelector
                  paymentModes={account.linkedPaymentModes}
                  selectedPaymentModeId={selectedPaymentModeId}
                  onSelect={onPaymentModeSelect}
                  label=""
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
          No account selected
        </div>
      )}
    </div>
  );
}

export default TransferAccountSection;
