
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { QRCodeService, QRCodeData, QRCodeStyle } from '@/services/qrCodeService';
import { Download, Eye, Save } from 'lucide-react';

const QRCodeGenerator = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    content: '',
    content_type: 'url',
    name: '',
  });
  
  const [style, setStyle] = useState<QRCodeStyle>({
    size: 256,
    color: '#000000',
    background: '#ffffff',
    errorCorrectionLevel: 'M',
    format: 'PNG',
  });

  const [generatedQR, setGeneratedQR] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!qrData.content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const qrCode = await QRCodeService.generateQRCode(qrData, style);
      setGeneratedQR(qrCode);
      toast({
        title: "QR Code generated",
        description: "Your QR code has been successfully generated",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQR) {
      toast({
        title: "No QR code to save",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await QRCodeService.saveQRCode(qrData, generatedQR);
      if (result.success) {
        toast({
          title: "QR Code saved",
          description: "Your QR code has been saved successfully",
        });
      } else {
        toast({
          title: "Save failed",
          description: result.error || "Failed to save QR code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR;
    link.download = `${qrData.name || 'qrcode'}.${style.format.toLowerCase()}`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">QR Code Name</Label>
              <Input
                id="name"
                placeholder="My QR Code"
                value={qrData.name}
                onChange={(e) => setQrData({ ...qrData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={qrData.content_type} 
                onValueChange={(value: any) => setQrData({ ...qrData, content_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Website URL</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="sms">SMS Message</SelectItem>
                  <SelectItem value="wifi">WiFi Network</SelectItem>
                  <SelectItem value="vcard">Contact Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              {qrData.content_type === 'text' ? (
                <Textarea
                  id="content"
                  placeholder="Enter your text content..."
                  value={qrData.content}
                  onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                  rows={3}
                />
              ) : (
                <Input
                  id="content"
                  placeholder={
                    qrData.content_type === 'url' ? 'https://example.com' :
                    qrData.content_type === 'email' ? 'user@example.com' :
                    qrData.content_type === 'phone' ? '+1234567890' :
                    'Enter content...'
                  }
                  value={qrData.content}
                  onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                />
              )}
            </div>
          </div>

          {/* Style Settings */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Style Settings</h3>
            
            <div>
              <Label>Size: {style.size}px</Label>
              <Slider
                value={[style.size]}
                onValueChange={(value) => setStyle({ ...style, size: value[0] })}
                min={128}
                max={512}
                step={32}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Foreground Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={style.color}
                  onChange={(e) => setStyle({ ...style, color: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="background">Background Color</Label>
                <Input
                  id="background"
                  type="color"
                  value={style.background}
                  onChange={(e) => setStyle({ ...style, background: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Error Correction</Label>
              <Select 
                value={style.errorCorrectionLevel} 
                onValueChange={(value: any) => setStyle({ ...style, errorCorrectionLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Format</Label>
              <Select 
                value={style.format} 
                onValueChange={(value: any) => setStyle({ ...style, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PNG">PNG Image</SelectItem>
                  <SelectItem value="SVG">SVG Vector</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !qrData.content.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedQR ? (
            <div className="space-y-4">
              <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                {style.format === 'SVG' ? (
                  <div dangerouslySetInnerHTML={{ __html: generatedQR }} />
                ) : (
                  <img src={generatedQR} alt="Generated QR Code" className="max-w-full h-auto" />
                )}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>QR code preview will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
