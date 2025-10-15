import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Edit } from "lucide-react";
import { useFormatters } from "../hooks/useFormatters";
import { useRecentTransactions, useTransactionSummary } from "../hooks/useTransactions";
import CategoryIcon from "../components/CategoryIcon";
import { TRANSACTION_TYPES } from "../types/transaction";
import RangeSelectorModal from "../components/RangeSelectorModal";

export default function Dashboard() {
  const { formatCurrency } = useFormatters();

  // 🔹 state
  const [rangeCode, setRangeCode] = useState<1 | 2 | 3>(1); // 1=All Time, 2=Month, 3=Year
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useTransactionSummary(rangeCode);
  const { data: recentTransactions, isLoading: recentLoading } = useRecentTransactions();

  const rangeLabel = rangeCode === 1 ? "Summary: All Time" : rangeCode === 2 ? "This Month" : "This Year";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your expenses and financial goals
        </p>
      </div>

      {/* Summary Range Selector */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
          text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 transition font-medium text-sm"
        >
          {rangeLabel}
          <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {/* Total Spending */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/40 rounded-full p-3">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spending</p>
            {summaryLoading ? (
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(summary?.totalExpense || 0)}
              </p>
            )}
          </div>
        </div>

        {/* Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-3">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
            {summaryLoading ? (
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(summary?.totalIncome || 0)}
              </p>
            )}
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-full p-3">
            <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
            {summaryLoading ? (
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency((summary?.totalIncome || 0) - (summary?.totalExpense || 0))}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {recentLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recentTransactions?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentTransactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                {txn.category ? (
                  <CategoryIcon icon={txn.category.icon} color={txn.category.color} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {txn.type === 2 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{txn.description}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {txn.category?.name || TRANSACTION_TYPES[txn.type]}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className={`text-sm font-semibold ${txn.type === 2 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {txn.type === 2 ? "+" : "-"}{formatCurrency(txn.amount)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(txn.txnDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No recent transactions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Start tracking your expenses and income by adding a transaction
          </p>
        </div>
      )}

      {/* 🔹 Range Selector Modal */}
      <RangeSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rangeCode={rangeCode}
        setRangeCode={setRangeCode}
      />
    </div>
  );
}