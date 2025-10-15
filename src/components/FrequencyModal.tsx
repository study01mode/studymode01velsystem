import { useState } from "react";
import { Check, X } from "lucide-react";

interface FrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrequency: string;
  currentEndType: string;
  currentInterval: number;
  currentOccurrence: number;
  onUpdate: (frequency: string, endType: string, interval: number, occurrence: number) => void;
  isPending?: boolean;
}

const MAIN_OPTIONS = [
  { value: "NONE", label: "Does not repeat" },
  { value: "DAILY", label: "Every day" },
  { value: "WEEKLY", label: "Every week" },
  { value: "MONTHLY", label: "Every month" },
  { value: "YEARLY", label: "Every year" },
  { value: "CUSTOM", label: "Custom" },
];

const CUSTOM_FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const END_OPTIONS = [
  { value: "NONE", label: "Never" },
  { value: "AFTER_OCCURRENCES", label: "After occurrence" },
];

export default function FrequencyModal({
  isOpen,
  onClose,
  currentFrequency,
  currentEndType,
  currentInterval,
  currentOccurrence,
  onUpdate,
  isPending = false,
}: FrequencyModalProps) {
  const [step, setStep] = useState<"MAIN" | "CUSTOM">("MAIN");

  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency);
  const [customFrequency, setCustomFrequency] = useState("DAILY");
  const [interval, setInterval] = useState(currentInterval || 1);
  const [endType, setEndType] = useState(currentEndType || "NONE");
  const [occurrence, setOccurrence] = useState(currentOccurrence || 1);

  const handleUpdate = () => {
    let finalFrequency = selectedFrequency;
    if (selectedFrequency === "CUSTOM") {
      finalFrequency = customFrequency;
    }

    onUpdate(finalFrequency, endType, interval, endType === "AFTER_OCCURRENCES" ? occurrence : 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {step === "MAIN" ? "Frequency" : "Custom Frequency"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step MAIN */}
        {step === "MAIN" && (
          <>
            <div className="p-4 space-y-3 overflow-y-auto">
              {MAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (opt.value === "CUSTOM") {
                      setSelectedFrequency("CUSTOM");
                      setStep("CUSTOM");
                    } else {
                      setSelectedFrequency(opt.value);
                    }
                  }}
                  className={`w-full p-3 text-left border rounded-lg transition-colors text-sm ${
                    selectedFrequency === opt.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{opt.label}</span>
                    {selectedFrequency === opt.value && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isPending}
                className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </>
        )}

        {/* Step CUSTOM */}
        {step === "CUSTOM" && (
          <>
            <div className="p-4 space-y-6 overflow-y-auto">
              {/* Custom Frequency */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {CUSTOM_FREQUENCIES.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCustomFrequency(opt.value)}
                      className={`w-full p-2 border rounded-lg text-sm ${
                        customFrequency === opt.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Every</h3>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={interval}
                  onChange={(e) =>
                    setInterval(Math.min(99, Math.max(1, +e.target.value)))
                  }
                  className="w-20 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {customFrequency.toLowerCase()}(s)
                </span>
              </div>

              {/* Ends */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ends</h3>
                <div className="space-y-2">
                  {END_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEndType(opt.value)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors text-sm ${
                        endType === opt.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{opt.label}</span>
                        {endType === opt.value && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Occurrence */}
              {endType === "AFTER_OCCURRENCES" && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Number of Occurrences
                  </h3>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={occurrence}
                    onChange={(e) =>
                      setOccurrence(Math.min(99, Math.max(1, +e.target.value)))
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => setStep("MAIN")}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleUpdate}
                disabled={isPending}
                className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}