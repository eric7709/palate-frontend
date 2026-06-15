// ui/DateDropdown.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isToday(d: Date) {
  return isSameDay(d, new Date());
}

interface DateDropdownProps {
  onSelect: (date: string) => void;
  placeholder?: string;
  selected?: string | null;
  align?: "left" | "right";
  fullWidth?: boolean;
}

export default function DateDropdown({
  onSelect,
  placeholder = "Select date",
  selected = null,
  align = "right",
  fullWidth = false,
}: DateDropdownProps) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Date | null>(selected ? new Date(selected) : null);
  const [viewing, setViewing] = useState(() => {
    const d = selected ? new Date(selected) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () => setViewing(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () => setViewing(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const handlePick = (day: number) => {
    const date = new Date(viewing.year, viewing.month, day);
    setPicked(date);
    onSelect(fmt(date));
    setOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setViewing({ year: today.getFullYear(), month: today.getMonth() });
    setPicked(today);
    onSelect(fmt(today));
    setOpen(false);
  };

  const totalDays = getDaysInMonth(viewing.year, viewing.month);
  const firstDay = getFirstDayOfMonth(viewing.year, viewing.month);
  const cells = Array.from({ length: firstDay + totalDays }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : "w-fit"}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all duration-200 w-full bg-white
          ${open
            ? "border-gray-400 shadow-sm"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <CalendarDays className={`w-3.5 h-3.5 shrink-0 ${open ? "text-gray-500" : "text-gray-400"}`} />
          <span className={picked ? "text-gray-800 text-[11px]" : "text-gray-400 text-xs"}>
            {picked ? fmt(picked) : placeholder}
          </span>
        </div>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
            ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-gray-800">
              {MONTHS[viewing.month]} {viewing.year}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-7 px-2 pt-2 pb-0.5">
            {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-gray-400 uppercase py-0.5">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 px-2 pb-2 gap-y-0.5">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const date = new Date(viewing.year, viewing.month, day);
              const isSelected = picked && isSameDay(date, picked);
              const today = isToday(date);
              return (
                <button
                  key={day}
                  onClick={() => handlePick(day)}
                  className={`relative h-7 w-full rounded-md text-[11px] font-medium transition-all duration-150 active:scale-90
                    ${isSelected
                      ? "bg-gray-800 text-white shadow-sm"
                      : today
                        ? "text-gray-700 bg-gray-50 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {day}
                  {today && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="px-2 pb-2">
            <button onClick={handleToday}
              className="w-full py-1.5 rounded-md border border-gray-200 text-[10px] font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}