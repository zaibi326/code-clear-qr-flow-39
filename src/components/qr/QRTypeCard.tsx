
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRType } from '@/data/qrTypes';

interface QRTypeCardProps {
  type: QRType;
  onClick: (type: QRType) => void;
  isFrequentlyUsed?: boolean;
}

export function QRTypeCard({ type, onClick, isFrequentlyUsed = false }: QRTypeCardProps) {
  const hoverColor = isFrequentlyUsed ? 'hover:border-blue-200' : 'hover:border-purple-200';
  const textColor = isFrequentlyUsed ? 'group-hover:text-blue-600' : 'group-hover:text-purple-600';

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${hoverColor} hover:-translate-y-1 group`}
      onClick={() => onClick(type)}
    >
      <CardContent className={isFrequentlyUsed ? "p-6" : "p-5"}>
        <div className="flex items-start justify-between mb-4">
          <div className={`${isFrequentlyUsed ? 'p-3 rounded-xl' : 'p-2.5 rounded-lg'} ${type.color} text-white group-hover:scale-110 transition-transform duration-200`}>
            <type.icon className={isFrequentlyUsed ? "h-6 w-6" : "h-5 w-5"} />
          </div>
          {type.isNew && (
            <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 ${isFrequentlyUsed ? '' : 'text-xs'}`}>
              NEW
            </Badge>
          )}
        </div>
        <h3 className={`font-semibold text-gray-900 ${textColor} transition-colors mb-2 ${isFrequentlyUsed ? '' : 'text-sm'}`}>
          {type.title}
        </h3>
        <p className={`text-gray-600 leading-relaxed ${isFrequentlyUsed ? 'text-sm' : 'text-xs'}`}>
          {type.description}
        </p>
      </CardContent>
    </Card>
  );
}
