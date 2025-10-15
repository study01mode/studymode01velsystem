import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
} from "../../hooks/useCategories";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  colorMap,
  iconTitle,
} from "../../types/category";
import CategoryIcon from "../../components/CategoryIcon";

const tabs = ["Expense", "Income"];

interface FormData {
  name: string;
  type: number;
  color: string;
  icon: string;
}

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIcon, setSelectedIcon] = useState("coffee");

  const { data: category, isLoading } = useCategory(id || "");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", type: 1, color: "blue", icon: "coffee" },
  });

  const watchedType = watch("type");

  useEffect(() => {
    if (isEditing && category) {
      setValue("name", category.name);
      setValue("type", category.type);
      setValue("color", category.color);
      setValue("icon", category.icon);
      setActiveTab(category.type === 1 ? 0 : 1);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
    }
  }, [isEditing, category, setValue]);

  useEffect(() => setValue("type", activeTab === 0 ? 1 : 2), [activeTab]);
  useEffect(() => setValue("color", selectedColor), [selectedColor]);
  useEffect(() => setValue("icon", selectedIcon), [selectedIcon]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && id) await updateCategory.mutateAsync({ id, data });
      else await createCategory.mutateAsync(data);
      navigate("/categories");
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  if (isEditing && isLoading)
    return <div className="p-8 text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-1 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? "Edit Category" : "Add Category"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isEditing
            ? "Update category details"
            : "Create a new category for your expenses or income"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name
              </label>
              <input
                {...register("name", { required: "Category name is required" })}
                type="text"
                placeholder="Ex: Food, Travel, Bills..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type
              </label>
              <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full w-full sm:w-max p-1">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex-1 sm:flex-initial ${
                      activeTab === idx
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Choose a Color</span>
                <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 capitalize">
                  <span className="text-gray-400 dark:text-gray-500">Selected:</span>
                  <span
                    className={`w-4 h-4 rounded-full ${colorMap[selectedColor]} border border-gray-300 dark:border-gray-600`}
                  ></span>
                  <span className="font-medium">{selectedColor}</span>
                </span>
              </label>

              <div className="grid grid-cols-8 gap-2.5">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`relative w-10 h-10 rounded-full transition-all ${
                      selectedColor === color
                        ? `ring-4 ring-blue-400 dark:ring-blue-500 scale-110 shadow-lg`
                        : "hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    <div className={`${colorMap[color]} w-full h-full rounded-full border-2 ${
                      selectedColor === color
                        ? "border-white dark:border-gray-800"
                        : "border-gray-200 dark:border-gray-700"
                    }`} />
                    {selectedColor === color && (
                      <Check className="absolute inset-0 w-5 h-5 text-white m-auto drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Icon
              </label>

              {/* Icon Search */}
              <input
                type="text"
                placeholder="Search icon..."
                onChange={(e) => {
                  const query = e.target.value.toLowerCase();
                  document.querySelectorAll("[data-icon-name]").forEach((el) => {
                    const match = el
                      .getAttribute("data-icon-name")
                      ?.includes(query);
                    (el as HTMLElement).style.display = match ? "flex" : "none";
                  });
                }}
                className="w-full mb-4 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors"
              />

              <div className="max-h-72 overflow-y-auto pr-2 space-y-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
                {Object.entries(CATEGORY_ICONS).map(([group, icons]) => (
                  <div key={group}>
                    <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                      {iconTitle[group] || group}
                    </h3>
                    <div className="grid grid-cols-6 gap-2">
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          data-icon-name={icon.toLowerCase()}
                          onClick={() => setSelectedIcon(icon)}
                          title={icon}
                          className={`relative p-3 rounded-full transition-all flex justify-center items-center group ${
                            selectedIcon === icon
                              ? `bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 shadow-md`
                              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                          }`}
                        >
                          <CategoryIcon
                            icon={icon}
                            color={selectedIcon === icon ? selectedColor : "gray"}
                            size="sm"
                          />
                          <span className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded top-full mt-1 whitespace-nowrap z-10 transition-opacity">
                            {icon}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center sticky top-6 h-fit">
            <div className="mb-5">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-inner">
                <CategoryIcon icon={selectedIcon} color={selectedColor} size="lg" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {watch("name") || "Category Name"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{watchedType === 1 ? "Expense" : "Income"}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colorMap[selectedColor]}`}></span>
                <span className="capitalize">{selectedColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="flex-1 border-2 border-gray-300 dark:border-gray-700 py-3 px-6 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {isPending
              ? "Saving..."
              : isEditing
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}