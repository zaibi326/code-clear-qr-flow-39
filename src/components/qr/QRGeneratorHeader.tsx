
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { QRType } from '@/data/qrTypes';

interface QRGeneratorHeaderProps {
  selectedType: QRType;
  onBackClick: () => void;
}

export function QRGeneratorHeader({ selectedType, onBackClick }: QRGeneratorHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBackClick} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to QR Types
      </Button>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${selectedType.color} text-white`}>
          <selectedType.icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{selectedType.title}</h1>
          <p className="text-gray-600">{selectedType.description}</p>
        </div>
      </div>
    </div>
  );
}
