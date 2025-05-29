
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
          name: templateData.name || 'Untitled Template',
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

      // Convert database record to Template interface
      const template: Template = {
        id: data.id,
        name: data.name,
        description: data.description,
        file_url: data.file_url,
        preview_url: data.preview_url,
        file_type: data.file_type as any,
        file_size: data.file_size,
        dimensions: data.dimensions as any,
        qr_position: data.qr_position as any,
        tags: data.tags || [],
        is_public: data.is_public,
        usage_count: data.usage_count,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      return { success: true, template };
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

      // Convert database records to Template interface
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        file_url: item.file_url,
        preview_url: item.preview_url,
        file_type: item.file_type as any,
        file_size: item.file_size,
        dimensions: item.dimensions as any,
        qr_position: item.qr_position as any,
        tags: item.tags || [],
        is_public: item.is_public,
        usage_count: item.usage_count,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      }));
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

      // Convert database records to Template interface
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        file_url: item.file_url,
        preview_url: item.preview_url,
        file_type: item.file_type as any,
        file_size: item.file_size,
        dimensions: item.dimensions as any,
        qr_position: item.qr_position as any,
        tags: item.tags || [],
        is_public: item.is_public,
        usage_count: item.usage_count,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      }));
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
