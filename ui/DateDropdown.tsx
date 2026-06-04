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
        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all duration-200 w-full
          ${open
            ? "bg-blue-500/20 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10"
            : "bg-blue-500/5 border-blue-500/30 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/50"
          }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <CalendarDays className={`w-3.5 h-3.5 shrink-0 ${open ? "text-indigo-400" : "text-gray-500"}`} />
          <span className={picked ? "text-white font-mono text-[11px]" : "text-gray-400 text-xs"}>
            {picked ? fmt(picked) : placeholder}
          </span>
        </div>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-64 bg-[#0f1119] border border-blue-500/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden
            ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-blue-500/20">
            <button onClick={prevMonth} className="p-1 rounded-md hover:bg-white/8 text-gray-400 hover:text-white">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-white">
              {MONTHS[viewing.month]} {viewing.year}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-md hover:bg-white/8 text-gray-400 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-7 px-2 pt-2 pb-0.5">
            {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-gray-500 uppercase py-0.5">{d}</div>)}
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
                      ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
                      : today
                        ? "text-indigo-400 hover:bg-white/8"
                        : "text-gray-300 hover:bg-white/8 hover:text-white"
                    }`}
                >
                  {day}
                  {today && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="px-2 pb-2">
            <button onClick={handleToday}
              className="w-full py-1.5 rounded-md border border-blue-500/30 text-[10px] font-semibold text-gray-400 hover:text-white hover:bg-blue-500/10 transition-all">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}