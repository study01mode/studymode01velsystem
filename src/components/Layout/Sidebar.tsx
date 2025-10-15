import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  ArrowUpDown,
  Tag,
  Target,
  FolderOpen,
  Calendar,
  Users,
  Eye,
  CalendarDays,
  Sliders as Sliders3,
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

/* ---- Types ---- */
interface MenuItem {
  name: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  item: MenuItem;
  shouldShowCondensed: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarSubMenuProps {
  section: MenuItem;
  isViewsExpanded: boolean;
  setIsViewsExpanded: (val: boolean) => void;
  shouldShowCondensed: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarTooltipProps {
  label: string;
}

/* ---- Menu Config ---- */
const menuConfig: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Analysis", path: "/analysis", icon: TrendingUp },
  { name: "Accounts", path: "/accounts", icon: CreditCard },
  { name: "Transactions", path: "/transactions", icon: ArrowUpDown },
  { name: "Tags", path: "/tags", icon: Tag },
  { name: "Budgets", path: "/budgets", icon: Target },
  { name: "Categories", path: "/categories", icon: FolderOpen },
  { name: "Scheduled Transactions", path: "/scheduled", icon: Calendar },
  { name: "Debts", path: "/debts", icon: Users },
  {
    name: "Views",
    icon: Eye,
    submenu: [
      { name: "Day", path: "/views/day", icon: CalendarDays },
      { name: "Calendar", path: "/views/calendar", icon: Calendar },
      { name: "Custom", path: "/views/custom", icon: Sliders3 },
    ],
  },
  { name: "Settings", path: "/settings", icon: Settings },
];

/* ---- Tooltip ---- */
const SidebarTooltip: React.FC<SidebarTooltipProps> = ({ label }) => (
  <div
    role="tooltip"
    className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
  >
    {label}
  </div>
);

/* ---- Sidebar Item ---- */
const SidebarItem: React.FC<SidebarItemProps> = ({ item, shouldShowCondensed, isOpen, onClose }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!item.path) e.preventDefault();
    if (isOpen) onClose();
  };

  return (
    <div className="relative group">
      <NavLink
        to={item.path || "#"}
        onClick={handleClick}
        aria-label={shouldShowCondensed ? item.name : undefined}
        className={({ isActive }) =>
          `flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-colors
           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
           ${isActive
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            }
           ${shouldShowCondensed ? "justify-center" : ""}`
        }
      >
        <item.icon
          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${shouldShowCondensed ? "" : "mr-2 sm:mr-3"}`}
        />
        <span
          className={`transition-[max-width,opacity] duration-300 overflow-hidden truncate ${shouldShowCondensed ? "max-w-0 opacity-0" : "max-w-full opacity-100"}`}
        >
          {item.name}
        </span>
      </NavLink>
      {shouldShowCondensed && <SidebarTooltip label={item.name} />}
    </div>
  );
};

/* ---- Sidebar Submenu ---- */
const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({
  section,
  isViewsExpanded,
  setIsViewsExpanded,
  shouldShowCondensed,
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const isAnyChildActive = section.submenu?.some(item => location.pathname.startsWith(item.path || "")) ?? false;

  useEffect(() => {
    if (isAnyChildActive) setIsViewsExpanded(true);
  }, [isAnyChildActive, setIsViewsExpanded]);

  return (
    <div className="relative group">
      <button
        onClick={() => setIsViewsExpanded(!isViewsExpanded)}
        className={`w-full flex items-center py-2 text-sm font-medium rounded-md transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
          ${isAnyChildActive
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          }
          ${shouldShowCondensed ? "justify-center px-2" : "justify-between px-2 sm:px-3"}`}
      >
        <div className="flex items-center">
          <section.icon
            className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${shouldShowCondensed ? "" : "mr-2 sm:mr-3"}`}
          />
          <span
            className={`transition-[max-width,opacity] duration-300 overflow-hidden ${shouldShowCondensed ? "max-w-0 opacity-0" : "max-w-full opacity-100"}`}
          >
            {section.name}
          </span>
        </div>
        {!shouldShowCondensed && (
          <div className="transition-transform duration-200">
            {isViewsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        )}
      </button>

      {shouldShowCondensed && <SidebarTooltip label={section.name} />}

      {!shouldShowCondensed && (
        <div
          className={`ml-4 sm:ml-6 mt-1 overflow-hidden transition-all duration-300
            ${isViewsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="space-y-1">
            {section.submenu?.map(item => (
              <SidebarItem
                key={item.name}
                item={item}
                shouldShowCondensed={shouldShowCondensed}
                isOpen={isOpen}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Sidebar Main ---- */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isViewsExpanded, setIsViewsExpanded] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowCondensed = useMemo(() => isCondensed && !isHovered && !isOpen, [isCondensed, isHovered, isOpen]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-screen flex flex-col transform transition-all duration-300 ease-in-out shadow-lg
          bg-white dark:bg-gray-900
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${shouldShowCondensed ? "w-16" : "w-64 sm:w-72 lg:w-64"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800">
          <Link to="/dashboard" className="flex items-center">
            <img
              src={shouldShowCondensed ? "/logo1.png" : "/logo.png"}
              alt="Logo"
              className={`transition-all duration-300 ${shouldShowCondensed ? "h-8 w-8" : "h-8 sm:h-10"} object-contain`}
            />
          </Link>
          {!shouldShowCondensed && (
            <button
              onClick={() => setIsCondensed(s => !s)}
              className="hidden lg:block p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-3 sm:p-4" aria-label="Primary">
          <div className="space-y-1">
            {menuConfig.map(item =>
              item.submenu ? (
                <SidebarSubMenu
                  key={item.name}
                  section={item}
                  isViewsExpanded={isViewsExpanded}
                  setIsViewsExpanded={setIsViewsExpanded}
                  shouldShowCondensed={shouldShowCondensed}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              ) : (
                <SidebarItem
                  key={item.name}
                  item={item}
                  shouldShowCondensed={shouldShowCondensed}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              )
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;