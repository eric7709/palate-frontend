"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
}

export default function DateDropdown({ onSelect, placeholder = "Select date", selected = null }: DateDropdownProps) {
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
    <div ref={ref} className="relative w-fit">

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200
          ${open
            ? "bg-[#1e2028] border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10"
            : "bg-[#1a1c21] border-white/10 text-gray-300 hover:border-white/25 hover:text-white"
          }`}
      >
        <CalendarDays className={`w-4 h-4 shrink-0 ${open ? "text-indigo-400" : "text-gray-500"}`} />
        <span className={picked ? "text-white font-mono text-xs" : "text-gray-500 text-sm"}>
          {picked ? fmt(picked) : placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-72 bg-[#1a1c21] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
            <button onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-white/8 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white">
              {MONTHS[viewing.month]} {viewing.year}
            </span>
            <button onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-white/8 text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-600 uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const date = new Date(viewing.year, viewing.month, day);
              const isSelected = picked && isSameDay(date, picked);
              const today = isToday(date);
              return (
                <button
                  key={day}
                  onClick={() => handlePick(day)}
                  className={`relative h-8 w-full rounded-lg text-[12px] font-medium transition-all duration-150 active:scale-90
                    ${isSelected
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                      : today
                        ? "text-indigo-400 hover:bg-white/8"
                        : "text-gray-300 hover:bg-white/8 hover:text-white"
                    }`}
                >
                  {day}
                  {today && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 pb-3">
            <button onClick={handleToday}
              className="w-full py-2 rounded-lg border border-white/8 text-[11px] font-semibold text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}