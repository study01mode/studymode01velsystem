import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';

interface FormDateTimeFieldsProps {
  dateValue: string;
  timeValue: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateLabel?: string;
  timeLabel?: string;
  dateError?: string;
  timeError?: string;
  minDate?: string;
  required?: boolean;
  showTime?: boolean;
}

function FormDateTimeFields({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateLabel = 'Date',
  timeLabel = 'Time',
  dateError,
  timeError,
  minDate,
  required = true,
  showTime = true
}: FormDateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <DatePicker
          value={dateValue}
          onChange={onDateChange}
          label={dateLabel}
          required={required}
          minDate={minDate}
        />
        {dateError && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{dateError}</p>
        )}
      </div>

      {showTime && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <TimePicker
            value={timeValue}
            onChange={onTimeChange}
            label={timeLabel}
            required={required}
          />
          {timeError && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{timeError}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FormDateTimeFields;
