import { Building2, Wallet, CreditCard, Banknote } from 'lucide-react';
import { Account } from '../../types/account';

interface AccountDisplayProps {
  account: Account;
  variant?: 'default' | 'from' | 'to';
  showType?: boolean;
}

export function getAccountIcon(type: number, className: string = "w-4 h-4 sm:w-5 sm:h-5") {
  switch (type) {
    case 1:
      return <Building2 className={className} />;
    case 2:
      return <Wallet className={className} />;
    case 3:
      return <CreditCard className={className} />;
    case 4:
      return <Banknote className={className} />;
    default:
      return <Building2 className={className} />;
  }
}

export function getAccountTypeColor(type: number) {
  switch (type) {
    case 1:
      return 'bg-blue-100 text-blue-700';
    case 2:
      return 'bg-green-100 text-green-700';
    case 3:
      return 'bg-purple-100 text-purple-700';
    case 4:
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function getAccountTypeName(type: number) {
  switch (type) {
    case 1:
      return 'Bank Account';
    case 2:
      return 'Wallet';
    case 3:
      return 'Credit Card';
    case 4:
      return 'Cash';
    default:
      return 'Account';
  }
}

function AccountDisplay({ account, variant = 'default', showType = true }: AccountDisplayProps) {
  const getBorderColor = () => {
    switch (variant) {
      case 'from':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'to':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      default:
        return 'border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border rounded-lg transition-colors ${getBorderColor()}`}>
      <div className={`p-1.5 sm:p-2 rounded-lg ${getAccountTypeColor(account.type)}`}>
        {getAccountIcon(account.type)}
      </div>
      <div>
        <p className="text-sm sm:text-base font-medium text-gray-900">{account.name}</p>
        {showType && (
          <p className="text-xs sm:text-sm text-gray-500">{getAccountTypeName(account.type)}</p>
        )}
      </div>
    </div>
  );
}

export default AccountDisplay;
