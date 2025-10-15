import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown, ArrowUpDown, DollarSign, ChevronLeft, ChevronRight, Building2, Wallet, CreditCard, Banknote, Smartphone, FileText, Globe, Eye, EyeOff, Settings, Bell } from 'lucide-react';
import { useAccount, useCreateAccountAdjustment, useDeleteAccount } from '../../hooks/useAccounts';
import {
  useAccountTransactions,
  useAccountDebitTransactions,
  useAccountCreditTransactions,
  useAccountAdjustmentTransactions,
} from '../../hooks/useAccountTransactions';
import { useDeleteTransaction } from '../../hooks/useTransactions';
import { useFormatters } from '../../hooks/useFormatters';
import { TRANSACTION_TYPES } from '../../types/transaction';
import { DEBT_TRANSACTION_TYPES } from '../../types/debt';
import CategoryIcon from '../../components/CategoryIcon';
import ConfirmationModal from '../../components/ConfirmationModal';
import BalanceEditModal from '../../components/BalanceEditModal';

const tabs = ['All', 'Credit', 'Debit', 'Adjustment'];

function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showBalance, setShowBalance] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string } | null>(null);
  const [isBalanceEditModalOpen, setIsBalanceEditModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { data: account, isLoading: accountLoading } = useAccount(id || '');

  // Only fetch data for the active tab to avoid unnecessary API calls
  const { data: allTransactions, isLoading: allLoading } = useAccountTransactions(id || '', currentPage, pageSize, activeTab === 0);
  const { data: creditTransactions, isLoading: creditLoading } = useAccountCreditTransactions(id || '', currentPage, pageSize, activeTab === 1);
  const { data: debitTransactions, isLoading: debitLoading } = useAccountDebitTransactions(id || '', currentPage, pageSize, activeTab === 2);
  const { data: adjustmentTransactions, isLoading: adjustmentLoading } = useAccountAdjustmentTransactions(id || '', currentPage, pageSize, activeTab === 3);

  const deleteTransaction = useDeleteTransaction();
  const createAdjustment = useCreateAccountAdjustment();
  const { formatCurrency } = useFormatters();
  const deleteAccount = useDeleteAccount();

  const handleDeleteAccount = async () => {
    if (accountToDelete) {
      try {
        await deleteAccount.mutateAsync(accountToDelete.id);
        setAccountToDelete(null);
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 1: return { data: creditTransactions, isLoading: creditLoading };
      case 2: return { data: debitTransactions, isLoading: debitLoading };
      case 3: return { data: adjustmentTransactions, isLoading: adjustmentLoading };
      default: return { data: allTransactions, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const transactions = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;

  const handleDeleteTransaction = async () => {
    if (transactionToDelete) {
      await deleteTransaction.mutateAsync(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  const handleBalanceAdjustment = async (data: {
    type: string;
    txnDate: string;
    txnTime: string;
    amount: number;
    description: string;
    accountId: string;
  }) => {
    try {
      await createAdjustment.mutateAsync(data);
      setIsBalanceEditModalOpen(false);
    } catch (error) {
      console.error('Failed to adjust balance:', error);
    }
  };

  const getTransactionIcon = (type: number) => {
    if (type === 1) return <TrendingDown className="w-5 h-5 text-red-600" />;
    if (type === 2) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (type === 3) return <ArrowUpDown className="w-5 h-5 text-blue-600" />;
    if (type === 5) return <TrendingDown className="w-5 h-5 text-red-600" />;
    if (type === 6) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (type === 7) return <DollarSign className="w-5 h-5 text-blue-600" />;
    return <DollarSign className="w-5 h-5 text-gray-600" />;
  };

  const getAmountColor = (type: number) => {
    if (type === 1 || type === 5) return 'text-red-600';
    if (type === 2 || type === 6) return 'text-green-600';
    if (type === 3 || type === 7) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getAccountIcon = (type: number) => {
    switch (type) {
      case 1: return <Building2 className="w-4 h-4 text-blue-600" />;
      case 2: return <Wallet className="w-4 h-4 text-green-600" />;
      case 3: return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 4: return <Banknote className="w-4 h-4 text-yellow-600" />;
      default: return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAccountTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-green-100 text-green-700';
      case 3: return 'bg-purple-100 text-purple-700';
      case 4: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const getPaymentModeIcon = (type: number) => {
    switch (type) {
      case 1: return <Smartphone className="w-3 h-3 text-blue-600" />;
      case 2: return <CreditCard className="w-3 h-3 text-purple-600" />;
      case 3: return <FileText className="w-3 h-3 text-gray-600" />;
      case 4: return <Globe className="w-3 h-3 text-green-600" />;
      default: return <CreditCard className="w-3 h-3 text-gray-600" />;
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedTime = `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
    return { date: formattedDate, time: formattedTime };
  };

  const getTransactionTypeName = (type: number) => {
    if (type >= 5 && type <= 7) {
      return DEBT_TRANSACTION_TYPES[type as keyof typeof DEBT_TRANSACTION_TYPES];
    }
    return TRANSACTION_TYPES[type.toString() as keyof typeof TRANSACTION_TYPES];
  };

  const formatCurrencyWithVisibility = (amount: number) =>
    showBalance ? formatCurrency(amount) : '****';

  if (accountLoading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Account not found</p>
          <Link to="/accounts" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            Back to Accounts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/accounts"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Accounts
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Details
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            View all transactions for this account
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <button
            onClick={() =>
              setAccountToDelete({ id: account.id, name: account.name })
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <Link
            to={`/accounts/edit/${account.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-gray-900 space-y-4 mb-4">
        {/* Top Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`p-3 sm:p-4 rounded-full ${getAccountTypeColor(account.type)}`}>
            {getAccountIcon(account.type)}
          </div>
          <div>
            <h2 className="text-xl font-semibold dark:text-white">{account.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{getAccountTypeName(account.type)}</p>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t pt-4 space-y-2">
          {!(account.type === 3) ? (
            <>
              {/* Available Balance */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available Balance
                </p>
                <p className="text-2xl font-semibold dark:text-white">
                  {/* ₹{account.currentBalance} */}
                  ₹600
                </p>
              </div>

              {/* Incorrect Balance Edit */}
              <button onClick={() => setIsBalanceEditModalOpen(true)} className="flex items-center gap-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Incorrect?</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline mt-1">Edit</span>
              </button>

              {/* Linked Payment Mode (for Bank only) */}
              {account.type === 1 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Linked Payment Mode
                  </p>
                  <p className="font-medium dark:text-white">
                    {account.linkedPaymentModes?.length || 'Not linked'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Available Credit Limit */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available Credit Limit
                </p>
                <p className="text-2xl font-semibold dark:text-white">
                  ₹{account.currentAvailableLimit}
                </p>
              </div>

              {/* Incorrect Balance Edit */}
              <button onClick={() => setIsBalanceEditModalOpen(true)} className="flex items-center gap-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Incorrect?</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline mt-1">Edit</span>
              </button>

              <div className="flex justify-around items-center text-sm text-gray-500 dark:text-gray-400">
                {/* Credit Card Info */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Spends</p>
                  <p className="text-base font-medium dark:text-white">
                    ₹{account.totalCreditLimit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Credit Limit</p>
                  <p className="text-base font-medium dark:text-white">
                    ₹{account.totalCreditLimit}
                  </p>
                </div>
              </div>

              {/* Bill Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Paid on <b>{account.createdAt}</b>. Next bill expected in{' '}
                <b>{account.createdAt}</b> days.
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                  Record Payment
                </button>
                <button className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>


      {/* Tabs */}
      <div className="flex justify-evenly gap-2 bg-gray-100 rounded-full p-1 sm:w-fit mb-4">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(index);
                setCurrentPage(0);
              }}
              className={`px-4 w-full py-2 rounded-full text-sm font-medium transition ${active
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-10 text-center">
          <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {tabs[activeTab].toLowerCase()} transactions
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {activeTab === 0
              ? 'No transactions found for this account'
              : `No ${tabs[activeTab].toLowerCase()} transactions found for this account`
            }
          </p>
          <Link
            to="/transactions/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Add Transaction
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">Details</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const { date, time } = formatDateTime(transaction.txnDate, transaction.txnTime);
                return (
                  <tr key={transaction.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    {/* Description & Category */}
                    <td className="px-4 py-3 flex items-center gap-2 min-w-[150px]">
                      {transaction.category ? (
                        <CategoryIcon icon={transaction.category.icon} color={transaction.category.color} size="sm" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        {transaction.category && <p className="text-xs text-gray-500">{transaction.category.name}</p>}
                      </div>
                    </td>

                    {/* Transaction Type */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {getTransactionTypeName(transaction.type)}
                    </td>

                    {/* Amount */}
                    <td className={`px-4 py-3 text-right text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                      {(transaction.type === 1 || transaction.type === 5) ? '-' :
                        (transaction.type === 2 || transaction.type === 6) ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {date} at {time}
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3 text-sm text-gray-500 space-y-1">
                      {/* Transfer */}
                      {transaction.type === 3 && transaction.fromAccount && transaction.toAccount && (
                        <div className="flex items-center gap-1">
                          {getAccountIcon(transaction.fromAccount.type)}
                          <span>{transaction.fromAccount.name}</span>
                          <ArrowUpDown className="w-3 h-3 mx-1" />
                          {getAccountIcon(transaction.toAccount.type)}
                          <span>{transaction.toAccount.name}</span>
                        </div>
                      )}

                      {/* Debt */}
                      {transaction.debt && <div>Debt: {transaction.debt.personName}</div>}

                      {/* Payment Mode */}
                      {transaction.paymentMode && (
                        <div className="flex items-center gap-1">
                          {getPaymentModeIcon(transaction.paymentMode.type)}
                          <span>{transaction.paymentMode.name}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {transaction.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {transaction.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{transaction.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          to={`/transactions/edit/${transaction.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setTransactionToDelete({ id: transaction.id, description: transaction.description })}
                          disabled={deleteTransaction.isPending}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.description}" transaction? This action cannot be undone.`}
        confirmText="Delete Transaction"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteTransaction.isPending}
      />

      {/* Balance Edit Modal */}
      <BalanceEditModal
        isOpen={isBalanceEditModalOpen}
        onClose={() => setIsBalanceEditModalOpen(false)}
        account={account}
        onSubmit={handleBalanceAdjustment}
        isPending={createAdjustment.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!accountToDelete}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message={`Are you sure you want to delete "${accountToDelete?.name}" account? This action cannot be undone and may affect your transaction history.`}
        confirmText="Delete Account"
        confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        isPending={deleteAccount.isPending}
      />
    </div>
  );
}

export default AccountDetail;