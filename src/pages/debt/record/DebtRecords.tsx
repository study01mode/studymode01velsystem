import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  MinusCircle,
  Coins
} from 'lucide-react';
import {
  useDebt,
  useAllDebtTransactions,
  usePaidDebtTransactions,
  useReceivedDebtTransactions,
  useAdjustmentDebtTransactions,
  useDeleteDebtRecord,
  useDebtTransactionSummary,
  useCreateAdjustmentDebtTransaction,
} from '../../../hooks/useDebts';
import { DEBT_TRANSACTION_TYPES } from '../../../types/debt';
import DebtRecordTypeModal from '../../../components/DebtRecordTypeModal';
import DebtAdjustmentModal from '../../../components/DebtAdjustmentModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useFormatters } from '../../../hooks/useFormatters';

const tabs = ['All', 'Paid', 'Received', 'Adjustment'];

function DebtRecords() {
  const { debtId } = useParams<{ debtId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isRecordTypeModalOpen, setIsRecordTypeModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{ id: string; description: string } | null>(null);

  const { data: summary } = useDebtTransactionSummary(debtId || '');
  const { data: debt } = useDebt(debtId || '');

  const { data: allTransactions, isLoading: allLoading } = useAllDebtTransactions(debtId || '', currentPage, pageSize, activeTab === 0);
  const { data: paidTransactions, isLoading: paidLoading } = usePaidDebtTransactions(debtId || '', currentPage, pageSize, activeTab === 1);
  const { data: receivedTransactions, isLoading: receivedLoading } = useReceivedDebtTransactions(debtId || '', currentPage, pageSize, activeTab === 2);
  const { data: adjustmentTransactions, isLoading: adjustmentLoading } = useAdjustmentDebtTransactions(debtId || '', currentPage, pageSize, activeTab === 3);

  const deleteRecord = useDeleteDebtRecord();
  const createAdjustment = useCreateAdjustmentDebtTransaction(debtId || '');
  const { formatCurrency } = useFormatters();

  const getCurrentData = () => {
    switch (activeTab) {
      case 1: return { data: paidTransactions, isLoading: paidLoading };
      case 2: return { data: receivedTransactions, isLoading: receivedLoading };
      case 3: return { data: adjustmentTransactions, isLoading: adjustmentLoading };
      default: return { data: allTransactions, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const transactions = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;

  const handleDeleteRecord = async () => {
    if (recordToDelete) {
      await deleteRecord.mutateAsync(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const handleAdjustmentSubmit = async (data: {
    type: string;
    txnDate: string;
    txnTime: string;
    amount: number;
    description: string;
  }) => {
    try {
      await createAdjustment.mutateAsync(data);
      setIsAdjustmentModalOpen(false);
    } catch (error) {
      console.error('Failed to create adjustment:', error);
    }
  };

  const getTransactionIcon = (type: number) => {
    if (type === 5) return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />;
    if (type === 6) return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (type === 7) return <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    return <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  const getAmountColor = (type: number) => {
    if (type === 5) return 'text-red-600 dark:text-red-400';
    if (type === 6) return 'text-green-600 dark:text-green-400';
    if (type === 7) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Back Button */}
      <button
        onClick={() => navigate('/debts')}
        className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Debts
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debt Records</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {debt ? `With ${debt.personName}` : 'Track your debt activity'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => navigate(`/debts/edit/${debtId}`)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white text-sm font-medium rounded-xl shadow hover:bg-yellow-600 transition"
          >
            <Edit className="w-4 h-4" />
            Edit Debt
          </button>

          <button
            onClick={() => setRecordToDelete({ id: debtId || '', description: debt?.personName || 'Debt' })}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-xl shadow hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Debt
          </button>

          <button
            onClick={() => setIsRecordTypeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-5 mb-4">
        <div className="flex flex-col gap-4">
          <div className="border-b dark:border-gray-700 pb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Receivable</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-0.5">
              {formatCurrency(((summary?.totalPaid ?? 0) - (summary?.totalPaid ?? 0)))}
            </p>
            <button onClick={() => setIsAdjustmentModalOpen(true)} className="flex items-center gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Incorrect?</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline mt-1">Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b dark:border-gray-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
                <MinusCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-0.5">{formatCurrency(summary?.totalPaid ?? 0)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Received</p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{formatCurrency(summary?.totalReceived ?? 0)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm mt-1 text-gray-500 dark:text-gray-400">
            <p className="text-red-500 dark:text-red-400">Due Date!</p>
            <p>1 record</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-evenly gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 sm:w-fit mb-4">
        {tabs.map((tab, i) => {
          const active = activeTab === i;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(i); setCurrentPage(0); }}
              className={`px-4 w-full py-2 rounded-full text-sm font-medium transition ${active
                  ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Transactions */}
      {isLoading ? (
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <Coins className="w-10 h-10 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">No {tabs[activeTab].toLowerCase()} transactions</h3>
          <p className="text-sm mb-6">
            {activeTab === 0
              ? 'No debt transactions found'
              : `No ${tabs[activeTab].toLowerCase()} transactions found`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-5">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2">Account</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => {
                const { date, time } = formatDateTime(transaction.txnDate, transaction.txnTime);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-4 py-3">
                      {getTransactionIcon(transaction.type)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {DEBT_TRANSACTION_TYPES[transaction.type as keyof typeof DEBT_TRANSACTION_TYPES]}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{date} at {time}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 5 ? '-' : transaction.type === 6 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {transaction.account?.name || '-'}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {transaction.type !== 7 && (
                        <Link
                          to={`/debts/${debtId}/records/edit/${transaction.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => setRecordToDelete({ id: transaction.id, description: transaction.description })}
                        disabled={deleteRecord.isPending}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                    <Coins className="w-10 h-10 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                      No {tabs[activeTab].toLowerCase()} transactions
                    </h3>
                    <p className="text-sm">
                      {activeTab === 0
                        ? 'No debt transactions found'
                        : `No ${tabs[activeTab].toLowerCase()} transactions found`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded-lg bg-gray-50 dark:bg-gray-800">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <DebtRecordTypeModal
        isOpen={isRecordTypeModalOpen}
        onClose={() => setIsRecordTypeModalOpen(false)}
        debtId={debtId || ''}
      />
      <DebtAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        onSubmit={handleAdjustmentSubmit}
        isPending={createAdjustment.isPending}
      />
      <ConfirmationModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
        title="Delete Record"
        message={`Are you sure you want to delete "${recordToDelete?.description}"?`}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        isPending={deleteRecord.isPending}
      />
    </div>
  );
}

export default DebtRecords;