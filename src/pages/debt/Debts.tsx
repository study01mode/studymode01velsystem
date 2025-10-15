import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  HandCoins,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Scale,
  ChevronRight,
} from 'lucide-react';
import {
  useDebts,
  useLendingDebts,
  useBorrowingDebts,
  useDeleteDebt,
  useDebtSummary
} from '../../hooks/useDebts';
import { DEBT_TYPES } from '../../types/debt';
import DebtTypeModal from '../../components/DebtTypeModal';
import { useFormatters } from '../../hooks/useFormatters';
import ConfirmationModal from '../../components/ConfirmationModal';

const tabs = ['All', 'Lending', 'Borrowing'];

function Debts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isDebtTypeModalOpen, setIsDebtTypeModalOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: allDebts, isLoading: allLoading } = useDebts(currentPage, pageSize, activeTab === 0);
  const { data: lendingDebts, isLoading: lendingLoading } = useLendingDebts(currentPage, pageSize, activeTab === 1);
  const { data: borrowingDebts, isLoading: borrowingLoading } = useBorrowingDebts(currentPage, pageSize, activeTab === 2);
  const { data: summary } = useDebtSummary();

  const deleteDebt = useDeleteDebt();
  const { formatCurrency } = useFormatters();

  const getCurrentData = () => {
    switch (activeTab) {
      case 1:
        return { data: lendingDebts, isLoading: lendingLoading };
      case 2:
        return { data: borrowingDebts, isLoading: borrowingLoading };
      default:
        return { data: allDebts, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const debts = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;

  const handleDeleteDebt = async () => {
    if (debtToDelete) {
      try {
        await deleteDebt.mutateAsync(debtToDelete.id);
        setDebtToDelete(null);
      } catch (error) {
        console.error('Failed to delete debt:', error);
      }
    }
  };

  const handleDebtTypeSelect = (type: '1' | '2') => {
    navigate('/debts/add', { state: { debtType: type } });
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getDebtTypeColor = (type: 1 | 2) =>
    type === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  const getDebtTypeIcon = (type: 1 | 2) =>
    type === 1 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track money you've lent and borrowed</p>
        </div>
        <button
          onClick={() => setIsDebtTypeModalOpen(true)}
          className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
        >
          <Plus className="w-4 h-4" /> Add Debt
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-green-300">
            <HandCoins className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Lent</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(summary?.totalReceivable ?? 0)}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-300">
            <PiggyBank className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Borrowed</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(summary?.totalPayable ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-evenly gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 sm:w-fit mb-4">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(index); setCurrentPage(0); }}
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

      {/* Debts List */}
      {debts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {debts.map((debt) => (
            <Link key={debt.id} to={`/debts/${debt.id}/records`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between group">
                <div className="flex items-start justify-between">
                  {/* Left section: icon + info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-3 rounded-full ${getDebtTypeColor(debt.type)} shadow-inner flex-shrink-0`}>
                      {getDebtTypeIcon(debt.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {debt.personName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Due {formatDate(debt.dueDate)}
                      </p>
                      <p className="text-gray-500 text-xs font-medium">
                        {DEBT_TYPES[debt.type]}
                      </p>
                    </div>
                  </div>

                  {/* Right section: amount + chevron */}
                  <div className="flex flex-col items-end gap-1">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition" />
                    <div className="flex items-baseline gap-1">
                      <p
                        className={`text-xl font-bold ${debt.type === 1
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                          }`}
                      >
                        {formatCurrency(debt.amount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Left</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Scale className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No debts found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by adding a new debt record</p>
          <div className="mt-4">
            <button
              onClick={() => setIsDebtTypeModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
            >
              <Plus className="w-4 h-4" /> Add Debt
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
          }
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      <DebtTypeModal
        isOpen={isDebtTypeModalOpen}
        onClose={() => setIsDebtTypeModalOpen(false)}
        onSelect={handleDebtTypeSelect}
      />

      <ConfirmationModal
        isOpen={!!debtToDelete}
        onClose={() => setDebtToDelete(null)}
        onConfirm={handleDeleteDebt}
        title="Delete Debt"
        message={`Are you sure you want to delete debt with "${debtToDelete?.name}"? This action cannot be undone and will also delete all associated records.`}
        confirmText="Delete Debt"
        confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        isPending={deleteDebt.isPending}
      />
    </div>
  );
}

export default Debts;