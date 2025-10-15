import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit,
  Trash2,
  Banknote,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useTransactionsByDate, useDeleteTransaction } from "../../hooks/useTransactions";
import { useFormatters } from "../../hooks/useFormatters";
import { TRANSACTION_TYPES } from "../../types/transaction";
import CategoryIcon from "../../components/CategoryIcon";
import ConfirmationModal from "../../components/ConfirmationModal";

// 🔹 Transaction shimmer skeleton
function TransactionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-between animate-pulse border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

function DayView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentDate = new Date();

  const [currentDay, setCurrentDay] = useState(
    parseInt(searchParams.get("day") || currentDate.getDate().toString())
  );
  const [currentMonth, setCurrentMonth] = useState(
    parseInt(searchParams.get("month") || (currentDate.getMonth() + 1).toString())
  );
  const [currentYear, setCurrentYear] = useState(
    parseInt(searchParams.get("year") || currentDate.getFullYear().toString())
  );

  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(3);

  const { formatCurrency } = useFormatters();
  const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
    currentDay
  ).padStart(2, "0")}`;

  const { data, isLoading } = useTransactionsByDate(dateStr, currentPage, pageSize);
  const deleteTransaction = useDeleteTransaction();

  const transactions = data?.transactions.content || [];
  const totalIncome = data?.totalIncome || 0;
  const totalExpense = data?.totalExpense || 0;
  const balance = totalIncome - totalExpense;
  const totalPages = data?.transactions.totalPages || 0;

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("day", currentDay.toString());
    newParams.set("month", currentMonth.toString());
    newParams.set("year", currentYear.toString());
    navigate(`/views/day?${newParams.toString()}`, { replace: true });
    setCurrentPage(0);
  }, [currentDay, currentMonth, currentYear, navigate]);

  const navigateToDay = (dir: "prev" | "next") => {
    const d = new Date(currentYear, currentMonth - 1, currentDay);
    d.setDate(d.getDate() + (dir === "next" ? 1 : -1));
    setCurrentDay(d.getDate());
    setCurrentMonth(d.getMonth() + 1);
    setCurrentYear(d.getFullYear());
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction.mutateAsync(transactionToDelete.id);
      setTransactionToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateString = () => {
    const date = new Date(currentYear, currentMonth - 1, currentDay);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Day</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Transactions and summary</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow p-2">
        <button
          onClick={() => navigateToDay("prev")}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
          {formatDateString()}
        </h2>

        <button
          onClick={() => navigateToDay("next")}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Loading shimmer */}
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 animate-pulse border border-gray-200 dark:border-gray-700"
              >
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <TransactionCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : transactions.length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium">No transactions for this day</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Income */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
              </div>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expense</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpense)}</p>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
              <div className={`p-3 rounded-full ${balance >= 0 ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40"}`}>
                <Banknote className={`w-6 h-6 ${balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {balance >= 0 ? "+" : ""}
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Transactions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  {txn.category ? (
                    <CategoryIcon icon={txn.category.icon} color={txn.category.color} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ArrowUpDown className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {txn.description || "No description"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{TRANSACTION_TYPES[txn.type]}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`font-semibold ${
                      txn.type === 1
                        ? "text-red-600 dark:text-red-400"
                        : txn.type === 2
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {txn.type === 1 ? "-" : txn.type === 2 ? "+" : ""}
                    {formatCurrency(txn.amount)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/transactions/edit/${txn.id}`)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setTransactionToDelete({ id: txn.id, description: txn.description || "transaction" })
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-700 dark:text-gray-300"
              >
                Prev
              </button>
              <span className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-700 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.description}" transaction?`}
        confirmText="Delete Transaction"
        confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        isPending={deleteTransaction.isPending}
      />
    </div>
  );
}

export default DayView;