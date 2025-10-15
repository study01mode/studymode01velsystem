import { useState } from 'react';
import { Edit, AlertTriangle, Trash2, LogOut } from 'lucide-react';
import {
  useSettings,
  useUpdateTimeFormat,
  useUpdateDecimalFormat,
  useUpdateNumberFormat,
  useUpdateCurrencyCode,
  useUpdateDailyReminder,
  useClearAllData,
  useDeleteAccount,
} from '../../hooks/useSettings';
import {
  TIME_FORMATS,
  DECIMAL_FORMATS,
  NUMBER_FORMATS,
  CURRENCIES,
  Currency,
} from '../../types/settings';
import TimeFormatModal from '../../components/TimeFormatModal';
import DecimalFormatModal from '../../components/DecimalFormatModal';
import NumberFormatModal from '../../components/NumberFormatModal';
import CurrencyModal from '../../components/CurrencyModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useAuth";

function Settings() {
  const [isTimeFormatModalOpen, setIsTimeFormatModalOpen] = useState(false);
  const [isDecimalFormatModalOpen, setIsDecimalFormatModalOpen] = useState(false);
  const [isNumberFormatModalOpen, setIsNumberFormatModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const { data: settings, isLoading } = useSettings();
  const updateTimeFormat = useUpdateTimeFormat();
  const updateDecimalFormat = useUpdateDecimalFormat();
  const updateNumberFormat = useUpdateNumberFormat();
  const updateCurrencyCode = useUpdateCurrencyCode();
  const updateDailyReminder = useUpdateDailyReminder();
  const clearAllData = useClearAllData();
  const deleteAccount = useDeleteAccount();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const logout = useLogout();

  const handleLogout = () => {
    setLogoutError(null);
    logout.mutate(undefined, {
      onError: (err: any) => {
        const message = err?.response?.data?.message || err?.message || "Logout failed. Please try again.";
        setLogoutError(message);
      },
    });
  };

  const handleDailyReminderToggle = async () => {
    if (settings) {
      await updateDailyReminder.mutateAsync(!settings.dailyReminder);
    }
  };

  const handleClearData = async () => {
    await clearAllData.mutateAsync();
    setIsClearDataModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount.mutateAsync();
    setIsDeleteAccountModalOpen(false);
  };

  const getCurrentCurrency = (): Currency | undefined =>
    CURRENCIES.find((currency) => currency.code === settings?.currencyCode);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto text-center text-gray-500">
        Failed to load settings
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-2 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Appearance
          </h2>

          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>
          </div>

          {/* Time Format */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Time Format</h3>
              <p className="text-sm text-gray-500">
                {TIME_FORMATS[settings.timeFormat as keyof typeof TIME_FORMATS]}
              </p>
            </div>
            <button
              onClick={() => setIsTimeFormatModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* Decimal Format */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Decimal Format</h3>
              <p className="text-sm text-gray-500">
                {DECIMAL_FORMATS[settings.decimalFormat as keyof typeof DECIMAL_FORMATS]}
              </p>
            </div>
            <button
              onClick={() => setIsDecimalFormatModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-2 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Preferences
          </h2>

          {/* Currency */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Currency</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                {getCurrentCurrency()?.flag} {getCurrentCurrency()?.country} -{' '}
                {getCurrentCurrency()?.name} ({getCurrentCurrency()?.symbol})
              </p>
            </div>
            <button
              onClick={() => setIsCurrencyModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* Number Format */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Number Format</h3>
              <p className="text-sm text-gray-500">
                {NUMBER_FORMATS[settings.numberFormat as keyof typeof NUMBER_FORMATS]}
              </p>
            </div>
            <button
              onClick={() => setIsNumberFormatModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-2 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Notifications
          </h2>

          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Daily Reminder</h3>
              <p className="text-sm text-gray-500">
                {settings.dailyReminder
                  ? 'Remind me daily at 7:00 PM'
                  : 'Daily reminders are disabled'}
              </p>
            </div>
            <button
              onClick={handleDailyReminderToggle}
              disabled={updateDailyReminder.isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${settings.dailyReminder ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-red-200 dark:border-red-700 space-y-2 transition-colors">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
            Danger Zone
          </h2>

          {/* Clear Data */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">Delete Data & Start Afresh</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                This will permanently delete all your data but keep your account.
              </p>
            </div>
            <button
              onClick={() => setIsClearDataModalOpen(true)}
              disabled={clearAllData.isPending}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 text-sm transition disabled:opacity-50 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteAccountModalOpen(true)}
              disabled={deleteAccount.isPending}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 text-sm transition disabled:opacity-50 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 space-y-2 transition-colors">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Account
          </h2>

          {/* Sign Out */}
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Sign Out</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign out from your account safely
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 text-sm transition disabled:opacity-50 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              {logout.isPending ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TimeFormatModal
        isOpen={isTimeFormatModalOpen}
        onClose={() => setIsTimeFormatModalOpen(false)}
        currentFormat={settings.timeFormat}
        onUpdate={updateTimeFormat.mutateAsync}
      />
      <DecimalFormatModal
        isOpen={isDecimalFormatModalOpen}
        onClose={() => setIsDecimalFormatModalOpen(false)}
        currentFormat={settings.decimalFormat}
        onUpdate={updateDecimalFormat.mutateAsync}
      />
      <NumberFormatModal
        isOpen={isNumberFormatModalOpen}
        onClose={() => setIsNumberFormatModalOpen(false)}
        currentFormat={settings.numberFormat}
        onUpdate={updateNumberFormat.mutateAsync}
      />
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        currentCurrency={settings.currencyCode}
        onUpdate={updateCurrencyCode.mutateAsync}
      />
      <ConfirmationModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to delete all your data? This action cannot be undone."
        confirmText="Clear Data"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={clearAllData.isPending}
      />
      <ConfirmationModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This cannot be undone."
        confirmText="Delete Account"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteAccount.isPending}
      />
    </div>
  );
}

export default Settings;