// src/utils/colorUtils.ts

/**
 * Converts a category color name to a HEX value.
 * Used in charts and UI for consistent color mapping.
 */
export function getCategoryColorHex(colorName?: string): string {
  if (!colorName) return "#9CA3AF"; // default gray

  const colorMap: Record<string, string> = {
    red: "#EF4444",
    orange: "#F97316",
    amber: "#F59E0B",
    yellow: "#EAB308",
    lime: "#84CC16",
    green: "#22C55E",
    emerald: "#10B981",
    teal: "#14B8A6",
    cyan: "#06B6D4",
    sky: "#0EA5E9",
    blue: "#3B82F6",
    indigo: "#6366F1",
    violet: "#8B5CF6",
    purple: "#A855F7",
    fuchsia: "#D946EF",
    pink: "#EC4899",
    rose: "#F43F5E",
    gray: "#9CA3AF",
    slate: "#64748B",
  };

  // Normalize and match
  const normalized = colorName.trim().toLowerCase();
  return colorMap[normalized] || "#9CA3AF";
}
