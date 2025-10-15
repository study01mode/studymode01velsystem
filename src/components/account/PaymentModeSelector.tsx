import { CreditCard, Smartphone, FileText, Globe } from 'lucide-react';
import { PaymentMode } from '../../types/account';

interface PaymentModeSelectorProps {
  paymentModes: PaymentMode[];
  selectedPaymentModeId?: string;
  onSelect: (paymentModeId: string) => void;
  label?: string;
}

export function getPaymentModeIcon(type: number, className: string = "w-3 h-3 sm:w-4 sm:h-4") {
  switch (type) {
    case 1:
      return <CreditCard className={className} />;
    case 2:
      return <Smartphone className={className} />;
    case 3:
      return <FileText className={className} />;
    case 4:
      return <Globe className={className} />;
    default:
      return <CreditCard className={className} />;
  }
}

export function getPaymentModeTypeName(type: number) {
  switch (type) {
    case 1:
      return 'Debit Card';
    case 2:
      return 'UPI';
    case 3:
      return 'Cheque';
    case 4:
      return 'Internet Banking';
    default:
      return 'Payment Mode';
  }
}

function PaymentModeSelector({ paymentModes, selectedPaymentModeId, onSelect, label = "Payment Mode (Optional)" }: PaymentModeSelectorProps) {
  const selectedPaymentMode = paymentModes.find(pm => pm.id === selectedPaymentModeId);

  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
      </label>
      {selectedPaymentMode ? (
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
            {getPaymentModeIcon(selectedPaymentMode.type)}
          </div>
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-900">{selectedPaymentMode.name}</p>
            <p className="text-xs sm:text-sm text-gray-500">{getPaymentModeTypeName(selectedPaymentMode.type)}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {paymentModes.map((paymentMode) => (
            <button
              key={paymentMode.id}
              type="button"
              onClick={() => onSelect(paymentMode.id)}
              className="p-2 sm:p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
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
      )}
    </div>
  );
}

export default PaymentModeSelector;
