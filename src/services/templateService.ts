
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id?: string;
  name: string;
  description?: string;
  file_url: string;
  preview_url: string;
  file_type: 'image/jpeg' | 'image/png' | 'application/pdf';
  file_size: number;
  dimensions: {
    width: number;
    height: number;
  };
  qr_position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tags: string[];
  is_public: boolean;
  usage_count: number;
  created_at?: Date;
  updated_at?: Date;
}

export class TemplateService {
  static async uploadTemplate(file: File, templateData: Partial<Template>): Promise<{ success: boolean; template?: Template; error?: string }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, file);

      if (uploadError) {
        return { success: false, error: 'Failed to upload file' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('templates')
        .getPublicUrl(fileName);

      // Save template record
      const { data, error } = await supabase
        .from('templates')
        .insert({
          user_id: user.user.id,
          name: templateData.name,
          description: templateData.description,
          file_url: publicUrl,
          preview_url: publicUrl,
          file_type: file.type as any,
          file_size: file.size,
          dimensions: templateData.dimensions || { width: 0, height: 0 },
          qr_position: templateData.qr_position,
          tags: templateData.tags || [],
          is_public: templateData.is_public || false,
          usage_count: 0,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, template: data };
    } catch (error) {
      return { success: false, error: 'Failed to upload template' };
    }
  }

  static async getUserTemplates(): Promise<Template[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  }

  static async getPublicTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });

      if (error) {
        console.error('Failed to fetch public templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch public templates:', error);
      return [];
    }
  }

  static async deleteTemplate(templateId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete template' };
    }
  }
}
