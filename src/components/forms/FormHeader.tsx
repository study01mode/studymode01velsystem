import { ArrowLeft } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backLabel?: string;
}

function FormHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Back'
}: FormHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        {backLabel}
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default FormHeader;
