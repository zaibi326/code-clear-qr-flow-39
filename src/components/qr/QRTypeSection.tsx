
import React from 'react';
import { QRTypeCard } from './QRTypeCard';
import { QRType } from '@/data/qrTypes';

interface QRTypeSectionProps {
  title: string;
  icon: React.ReactNode;
  types: QRType[];
  onTypeClick: (type: QRType) => void;
  isFrequentlyUsed?: boolean;
}

export function QRTypeSection({ title, icon, types, onTypeClick, isFrequentlyUsed = false }: QRTypeSectionProps) {
  const gridCols = isFrequentlyUsed 
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {icon}
      </div>
      <div className={`grid ${gridCols} gap-4`}>
        {types.map((type) => (
          <QRTypeCard 
            key={type.id}
            type={type}
            onClick={onTypeClick}
            isFrequentlyUsed={isFrequentlyUsed}
          />
        ))}
      </div>
    </div>
  );
}
