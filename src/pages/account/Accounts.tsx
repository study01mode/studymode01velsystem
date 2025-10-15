import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, Wallet, Building2, Banknote, AlertCircle, ChevronRight } from 'lucide-react';
import { useAccounts, useAccountSummary } from '../../hooks/useAccounts';
import { useFormatters } from '../../hooks/useFormatters';
import InfoModal from './InfoModal';

function Accounts() {
  const { data: allAccounts = [], isLoading: allAccountsLoading } = useAccounts();
  const { data: summary, isLoading: summaryLoading } = useAccountSummary();
  const { formatCurrency } = useFormatters();

  const [creditCardTab, setCreditCardTab] = useState<'available' | 'outstanding'>('available');
  const [modalContent, setModalContent] = useState<{
    title: string;
    body: string;
    showCustomize?: boolean;
  } | null>(null);

  const formatCurrencyWithVisibility = (amount: number) => formatCurrency(amount);

  const handleAlertClick = (type: 'balance' | 'credit') => {
    if (type === 'balance') {
      setModalContent({
        title: 'About Available Balance',
        body: `The 'Available Balance' represents the total balance across all your bank accounts, wallets, and cash as recorded in the app. This figure is derived from your transaction entries and may not reflect the actual current balance in your accounts.
For accurate balance tracking, ensure you record all your transactions in the app.`,
        showCustomize: true
      });
    } else {
      setModalContent({
        title: creditCardTab === 'available' ? 'About Available Credit' : 'About Total Outstanding',
        body: creditCardTab === 'available'
          ? `The 'Available Credit' represents the total credit available across all your credit cards as recorded in the app. Ensure all transactions are recorded for accurate tracking.`
          : `The 'Total Outstanding' represents the cumulative amount you owe across all your credit cards as per the transactions recorded in the app. It may differ from the actual balance reported by your credit card provider.`,
        showCustomize: true
      });
    }
  };

  const closeModal = () => setModalContent(null);
  const handleCustomize = () => alert('Customize feature coming soon!');

  const getAccountIcon = (type: number, size: string = 'w-5 h-5') => {
    switch (type) {
      case 1: return <Building2 className={size} />;
      case 2: return <Wallet className={size} />;
      case 3: return <CreditCard className={size} />;
      case 4: return <Banknote className={size} />;
      default: return <Building2 className={size} />;
    }
  };

  const getAccountTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 2: return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 3: return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 4: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAccountTypeName = (type: number) => {
    switch (type) {
      case 1: return 'Bank Account';
      case 2: return 'Wallet';
      case 3: return 'Credit Card';
      case 4: return 'Cash';
      default: return 'Account';
    }
  };

  if (allAccountsLoading || summaryLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedAccounts = allAccounts.reduce((acc: Record<number, any[]>, account) => {
    acc[account.type] = acc[account.type] || [];
    acc[account.type].push(account);
    return acc;
  }, {});

  const colorMap: Record<string, { bg: string; darkBg: string; text: string; darkText: string }> = {
    indigo: { bg: 'bg-indigo-100', darkBg: 'dark:bg-indigo-900', text: 'text-indigo-600', darkText: 'dark:text-indigo-300' },
    green: { bg: 'bg-green-100', darkBg: 'dark:bg-green-900', text: 'text-green-600', darkText: 'dark:text-green-300' }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your bank accounts, wallets, and credit cards</p>
          <p className="text-xs text-yellow-600 mt-1">* Transaction-based balance, actual may vary.</p>
        </div>
        <Link
          to="/accounts/add"
          className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Account
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { title: 'Available Balance', value: summary?.availableAmount || 0, icon: Wallet, color: 'indigo', type: 'balance' },
          {
            title: creditCardTab === 'available' ? 'Available Credit' : 'Total Outstanding',
            value: creditCardTab === 'available' ? summary?.availableCredit || 0 : summary?.totalOutstanding || 0,
            icon: CreditCard,
            color: 'green',
            type: 'credit'
          }
        ].map((item) => (
          <div key={item.title} className="relative bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-4">
            {/* Alert */}
            <div
              onClick={() => handleAlertClick(item.type as 'balance' | 'credit')}
              className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5" />
            </div>

            <div className={`${colorMap[item.color].bg} ${colorMap[item.color].darkBg} p-3 rounded-full`}>
              <item.icon className={`w-6 h-6 ${colorMap[item.color].text} ${colorMap[item.color].darkText}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.title}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrencyWithVisibility(item.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts List */}
      {Object.keys(groupedAccounts).length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          No accounts yet
        </div>
      ) : (
        Object.entries(groupedAccounts).map(([type, accounts]) => (
          <div key={type} className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${getAccountTypeColor(Number(type))}`}>
                  {getAccountIcon(Number(type), 'w-4 h-4')}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{getAccountTypeName(Number(type))}</h2>
              </div>
              {/* Credit Card Tabs */}
              {Number(type) === 3 && (
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 sm:w-fit">
                  {['available', 'outstanding'].map(tab => {
                    const active = creditCardTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setCreditCardTab(tab as 'available' | 'outstanding')}
                        className={`px-4 py-1 rounded-full text-sm font-medium transition ${active
                          ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <Link
                  key={account.id}
                  to={`/accounts/detail/${account.id}`}
                  className="group flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between w-full pr-5">
                    <span className="font-medium text-base text-gray-900 dark:text-gray-100">
                      {account.name}
                    </span>
                    <span className="font-semibold text-base text-gray-800 dark:text-gray-200">
                      {Number(account.type) === 3
                        ? formatCurrency(creditCardTab === 'available' ? account.currentAvailableLimit || 0 : account.currentBalance || 0)
                        : formatCurrency(account.currentBalance || 0)
                      }
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400" />
                </Link>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Info Modal */}
      {modalContent && (
        <InfoModal
          isOpen={!!modalContent}
          title={modalContent.title}
          body={modalContent.body}
          showCustomize={modalContent.showCustomize}
          onClose={closeModal}
          onCustomize={handleCustomize}
        />
      )}
    </div>
  );
}

export default Accounts;