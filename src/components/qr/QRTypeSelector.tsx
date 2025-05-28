
import React, { useState } from 'react';
import { Sparkles, Star } from 'lucide-react';
import { AdvancedQRGenerator } from './AdvancedQRGenerator';
import { QRTypeSection } from './QRTypeSection';
import { QRGeneratorHeader } from './QRGeneratorHeader';
import { qrTypes, QRType } from '@/data/qrTypes';

export function QRTypeSelector() {
  const [selectedType, setSelectedType] = useState<QRType | null>(null);

  const frequentlyUsed = qrTypes.filter(type => type.category === 'frequently-used');
  const moreTypes = qrTypes.filter(type => type.category === 'more-types');

  const handleTypeClick = (type: QRType) => {
    console.log('Selected QR type:', type.id);
    setSelectedType(type);
  };

  const handleBackClick = () => {
    setSelectedType(null);
  };

  // If a type is selected, show the QR generator
  if (selectedType) {
    return (
      <div className="space-y-6">
        <QRGeneratorHeader 
          selectedType={selectedType}
          onBackClick={handleBackClick}
        />
        <AdvancedQRGenerator selectedType={selectedType} />
      </div>
    );
  }

  // Default view showing all QR types
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Let's build your first dynamic QR Code
        </h1>
        <p className="text-gray-600">Choose from our variety of QR code types to get started</p>
      </div>

      <QRTypeSection
        title="FREQUENTLY USED"
        icon={<Sparkles className="h-5 w-5 text-yellow-500" />}
        types={frequentlyUsed}
        onTypeClick={handleTypeClick}
        isFrequentlyUsed={true}
      />

      <QRTypeSection
        title="MORE QR CODE TYPES"
        icon={<Star className="h-5 w-5 text-purple-500" />}
        types={moreTypes}
        onTypeClick={handleTypeClick}
        isFrequentlyUsed={false}
      />
    </div>
  );
}
