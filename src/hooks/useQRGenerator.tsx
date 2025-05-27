
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

export interface QRCodeConfig {
  content: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'pdf' | 'location';
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  borderSize: number;
  logoUrl?: string;
}

interface SelectedType {
  id: string;
  title: string;
  description: string;
  qrType: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'pdf' | 'location';
  placeholder: string;
  prefix?: string;
}

export const useQRGenerator = (selectedType?: SelectedType) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize config based on selected type
  const getInitialContent = () => {
    if (!selectedType) return 'https://clearqr.io';
    
    switch (selectedType.id) {
      case 'url':
        return 'https://example.com';
      case 'multi-link':
        return 'https://linktr.ee/yourprofile';
      case 'pdf':
        return 'https://example.com/document.pdf';
      case 'location':
        return 'geo:37.7749,-122.4194?q=San Francisco, CA';
      default:
        return selectedType.placeholder || 'https://clearqr.io';
    }
  };

  const [config, setConfig] = useState<QRCodeConfig>({
    content: getInitialContent(),
    type: selectedType?.qrType || 'url',
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderSize: 4
  });

  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!config.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content for the QR code",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      await QRCodeLib.toCanvas(canvas, config.content, {
        width: config.size,
        margin: Math.floor(config.borderSize / 4),
        color: {
          dark: config.foregroundColor,
          light: config.backgroundColor,
        },
        errorCorrectionLevel: config.errorCorrection,
      });

      const dataURL = canvas.toDataURL('image/png');
      setGeneratedQR(dataURL);
      
      toast({
        title: "Success",
        description: "QR code generated successfully!"
      });
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please check your content.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatContentForType = (content: string, type: string) => {
    if (!selectedType) {
      // Default formatting
      switch (type) {
        case 'email':
          return content.includes('mailto:') ? content : `mailto:${content}`;
        case 'phone':
          return content.includes('tel:') ? content : `tel:${content}`;
        case 'url':
          if (!content.includes('://')) {
            return `https://${content}`;
          }
          return content;
        default:
          return content;
      }
    }

    // Format based on selected type
    switch (selectedType.id) {
      case 'url':
      case 'multi-link':
      case 'pdf':
        if (!content.includes('://')) {
          return `https://${content}`;
        }
        return content;
      case 'location':
        if (!content.includes('geo:')) {
          // Try to convert address to geo coordinates format
          return `geo:0,0?q=${encodeURIComponent(content)}`;
        }
        return content;
      case 'email':
        return content.includes('mailto:') ? content : `mailto:${content}`;
      case 'call':
        return content.includes('tel:') ? content : `tel:${content}`;
      case 'sms':
        return content.includes('sms:') ? content : `sms:${content}`;
      default:
        return content;
    }
  };

  const handleContentChange = (value: string) => {
    const formattedContent = formatContentForType(value, config.type);
    setConfig(prev => ({ ...prev, content: formattedContent }));
  };

  useEffect(() => {
    if (config.content.trim()) {
      generateQRCode();
    }
  }, [config]);

  // Update config when selectedType changes
  useEffect(() => {
    if (selectedType) {
      setConfig(prev => ({
        ...prev,
        content: getInitialContent(),
        type: selectedType.qrType
      }));
    }
  }, [selectedType]);

  return {
    config,
    setConfig,
    generatedQR,
    isGenerating,
    canvasRef,
    handleContentChange,
    generateQRCode
  };
};
