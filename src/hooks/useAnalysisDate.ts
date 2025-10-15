// src/hooks/useAnalysisDate.ts
import { useState } from "react";
import { AnalysisParams } from "./useAnalysis";

export function useAnalysisDate() {
  const currentDate = new Date();
  const [week, setWeek] = useState(currentDate);
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [custom, setCustom] = useState<Partial<AnalysisParams>>({});

  const navigate = (type: "week" | "month" | "year", direction: "prev" | "next") => {
    if (type === "week") {
      const newWeek = new Date(week);
      newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
      setWeek(newWeek);
    } else if (type === "month") {
      const newMonth = direction === "next" ? month + 1 : month - 1;
      if (newMonth < 1) { setMonth(12); setYear(year - 1); }
      else if (newMonth > 12) { setMonth(1); setYear(year + 1); }
      else setMonth(newMonth);
    } else {
      setYear(year + (direction === "next" ? 1 : -1));
    }
  };

  return { week, month, year, custom, setCustom, navigate };
}
