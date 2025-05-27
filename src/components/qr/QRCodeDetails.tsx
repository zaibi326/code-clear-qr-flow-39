
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Globe, FileText, MapPin, Share2 } from 'lucide-react';
import { QRCodeConfig } from '@/hooks/useQRGenerator';

interface SelectedType {
  id: string;
  title: string;
  description: string;
  qrType: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'pdf' | 'location';
}

interface QRCodeDetailsProps {
  config: QRCodeConfig;
  selectedType?: SelectedType;
}

export function QRCodeDetails({ config, selectedType }: QRCodeDetailsProps) {
  const getTypeIcon = () => {
    if (!selectedType) return Info;
    
    switch (selectedType.id) {
      case 'url':
        return Globe;
      case 'multi-link':
        return Share2;
      case 'pdf':
        return FileText;
      case 'location':
        return MapPin;
      default:
        return Info;
    }
  };

  const getTypeDetails = () => {
    if (!selectedType) return [];
    
    switch (selectedType.id) {
      case 'url':
        return [
          { label: 'Type', value: 'Website URL' },
          { label: 'Action', value: 'Opens website in browser' },
          { label: 'Compatible', value: 'All devices' }
        ];
      case 'multi-link':
        return [
          { label: 'Type', value: 'Multi-link Page' },
          { label: 'Action', value: 'Opens link collection page' },
          { label: 'Best for', value: 'Social media, business cards' }
        ];
      case 'pdf':
        return [
          { label: 'Type', value: 'PDF Document' },
          { label: 'Action', value: 'Downloads or views PDF' },
          { label: 'Best for', value: 'Menus, brochures, forms' }
        ];
      case 'location':
        return [
          { label: 'Type', value: 'Geographic Location' },
          { label: 'Action', value: 'Opens in maps app' },
          { label: 'Best for', value: 'Businesses, events, navigation' }
        ];
      default:
        return [];
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TypeIcon className="h-5 w-5" />
          QR Code Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedType && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedType.title}</Badge>
              {selectedType.id === 'multi-link' && (
                <Badge className="bg-green-100 text-green-700">NEW</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600">{selectedType.description}</p>
            
            <div className="space-y-2">
              {getTypeDetails().map((detail, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-500">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <h4 className="font-medium text-sm">Technical Details</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{config.size}x{config.size}px</span>
            </div>
            <div className="flex justify-between">
              <span>Error Correction:</span>
              <span>Level {config.errorCorrection}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span>PNG</span>
            </div>
            <div className="flex justify-between">
              <span>Content Length:</span>
              <span>{config.content.length} characters</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
