
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

export interface QRCodeData {
  id?: string;
  name?: string;
  content: string;
  content_type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';
  custom_data?: Record<string, any>;
  expires_at?: Date;
  password_protected?: boolean;
}

export interface QRCodeStyle {
  size: number;
  color: string;
  background: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  format: 'PNG' | 'SVG';
}

export class QRCodeService {
  static async generateQRCode(data: QRCodeData, style: QRCodeStyle): Promise<string> {
    const options = {
      width: style.size,
      color: {
        dark: style.color,
        light: style.background,
      },
      errorCorrectionLevel: style.errorCorrectionLevel,
    };

    try {
      if (style.format === 'SVG') {
        return await QRCode.toString(data.content, { ...options, type: 'svg' });
      } else {
        return await QRCode.toDataURL(data.content, options);
      }
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static async saveQRCode(qrData: QRCodeData, qrImageUrl: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.user.id,
          name: qrData.name,
          content: qrData.content,
          content_type: qrData.content_type,
          qr_image_url: qrImageUrl,
          custom_data: qrData.custom_data,
          expires_at: qrData.expires_at?.toISOString(),
          password_protected: qrData.password_protected || false,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error) {
      return { success: false, error: 'Failed to save QR code' };
    }
  }

  static async getUserQRCodes(): Promise<any[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch QR codes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
      return [];
    }
  }

  static async trackScan(qrCodeId: string, metadata: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase.from('scan_events').insert({
        qr_code_id: qrCodeId,
        user_id: user.user.id,
        ip_address: metadata.ip,
        user_agent: metadata.userAgent,
        device: metadata.device,
        location: metadata.location,
        session: metadata.session,
      });

      // Update QR code stats
      await supabase.rpc('increment_qr_scan', { qr_id: qrCodeId });
    } catch (error) {
      console.error('Failed to track scan:', error);
    }
  }
}
