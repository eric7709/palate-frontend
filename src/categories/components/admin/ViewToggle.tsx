"use client";

import { List, LayoutGrid } from 'lucide-react';

type Props = {
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
};

export function ViewToggle({ view, onViewChange }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => onViewChange('table')}
        className={`p-1.5 rounded-lg transition-colors ${view === 'table' ? 'bg-gray-700 text-white' : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-gray-700 text-white' : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'}`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}