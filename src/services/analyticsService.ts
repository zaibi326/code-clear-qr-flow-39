
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalScans: number;
  uniqueScans: number;
  totalQRCodes: number;
  activeCampaigns: number;
  scansByDate: Array<{ date: string; scans: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  locationBreakdown: Array<{ country: string; count: number; percentage: number }>;
  topQRCodes: Array<{ id: string; name: string; scans: number }>;
  recentScans: Array<any>;
}

export class AnalyticsService {
  static async getUserAnalytics(timeRange: string = '30d'): Promise<AnalyticsData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(endDate.getDate() - days);

      // Get QR codes count
      const { count: qrCodesCount } = await supabase
        .from('qr_codes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.user.id);

      // Get scan events in date range
      const { data: scanEvents } = await supabase
        .from('scan_events')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      const totalScans = scanEvents?.length || 0;
      const uniqueScans = new Set(scanEvents?.map(scan => scan.ip_address) || []).size;

      // Process scan data by date
      const scansByDate = this.processScansByDate(scanEvents || [], days);
      
      // Process device breakdown
      const deviceBreakdown = this.processDeviceBreakdown(scanEvents || []);
      
      // Process location breakdown
      const locationBreakdown = this.processLocationBreakdown(scanEvents || []);

      // Get top QR codes
      const topQRCodes = await this.getTopQRCodes(user.user.id);

      return {
        totalScans,
        uniqueScans,
        totalQRCodes: qrCodesCount || 0,
        activeCampaigns: 0, // Will implement campaigns later
        scansByDate,
        deviceBreakdown,
        locationBreakdown,
        topQRCodes,
        recentScans: scanEvents?.slice(0, 10) || [],
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  }

  private static processScansByDate(scans: any[], days: number): Array<{ date: string; scans: number }> {
    const dateMap = new Map<string, number>();
    const endDate = new Date();
    
    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Count scans by date
    scans.forEach(scan => {
      const date = new Date(scan.timestamp).toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    return Array.from(dateMap.entries())
      .map(([date, scans]) => ({ date, scans }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private static processDeviceBreakdown(scans: any[]): Array<{ device: string; count: number; percentage: number }> {
    const deviceMap = new Map<string, number>();
    
    scans.forEach(scan => {
      const device = scan.device?.type || 'unknown';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    const total = scans.length;
    return Array.from(deviceMap.entries())
      .map(([device, count]) => ({
        device,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private static processLocationBreakdown(scans: any[]): Array<{ country: string; count: number; percentage: number }> {
    const locationMap = new Map<string, number>();
    
    scans.forEach(scan => {
      const country = scan.location?.country || 'Unknown';
      locationMap.set(country, (locationMap.get(country) || 0) + 1);
    });

    const total = scans.length;
    return Array.from(locationMap.entries())
      .map(([country, count]) => ({
        country,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries
  }

  private static async getTopQRCodes(userId: string): Promise<Array<{ id: string; name: string; scans: number }>> {
    try {
      const { data: qrCodes } = await supabase
        .from('qr_codes')
        .select('id, name, stats')
        .eq('user_id', userId)
        .order('stats->total_scans', { ascending: false })
        .limit(10);

      return qrCodes?.map(qr => ({
        id: qr.id,
        name: qr.name || 'Unnamed QR Code',
        scans: qr.stats?.total_scans || 0,
      })) || [];
    } catch (error) {
      console.error('Failed to fetch top QR codes:', error);
      return [];
    }
  }

  static async exportAnalytics(timeRange: string = '30d'): Promise<string> {
    try {
      const analytics = await this.getUserAnalytics(timeRange);
      
      const csvData = [
        ['Metric', 'Value'],
        ['Total Scans', analytics.totalScans.toString()],
        ['Unique Scans', analytics.uniqueScans.toString()],
        ['Total QR Codes', analytics.totalQRCodes.toString()],
        [''],
        ['Date', 'Scans'],
        ...analytics.scansByDate.map(item => [item.date, item.scans.toString()]),
        [''],
        ['Device', 'Count', 'Percentage'],
        ...analytics.deviceBreakdown.map(item => [item.device, item.count.toString(), `${item.percentage}%`]),
      ];

      return csvData.map(row => row.join(',')).join('\n');
    } catch (error) {
      console.error('Failed to export analytics:', error);
      throw error;
    }
  }
}
