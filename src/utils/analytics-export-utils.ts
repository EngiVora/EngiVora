// Analytics export utility functions for generating reports in different formats

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: string;
  };
  userGrowth: {
    month: string;
    users: number;
    growth: number;
  }[];
  topPages: {
    page: string;
    views: number;
    uniqueViews: number;
  }[];
  trafficSources: {
    source: string;
    percentage: number;
    visitors: number;
  }[];
  deviceBreakdown: {
    device: string;
    percentage: number;
    users: number;
  }[];
}

export interface RealTimeActivity {
  type: string;
  message: string;
  timestamp: string;
}

export interface AnalyticsReportData {
  period: string;
  generatedAt: string;
  overview: {
    totalUsers: number;
    activeUsers: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: string;
  };
  userGrowth: {
    month: string;
    users: number;
    growth: number;
  }[];
  topPages: {
    page: string;
    views: number;
    uniqueViews: number;
  }[];
  trafficSources: {
    source: string;
    percentage: number;
    visitors: number;
  }[];
  deviceBreakdown: {
    device: string;
    percentage: number;
    users: number;
  }[];
  realTimeActivity: {
    type: string;
    message: string;
    timestamp: string;
  }[];
}

export class AnalyticsExportUtils {
  /**
   * Export analytics data as CSV format
   */
  static exportToCSV(data: AnalyticsReportData): void {
    const csvContent = this.generateAnalyticsCSVContent(data);
    this.downloadFile(csvContent, 'analytics-report.csv', 'text/csv');
  }

  /**
   * Export analytics data as JSON format
   */
  static exportToJSON(data: AnalyticsReportData): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, 'analytics-report.json', 'application/json');
  }

  /**
   * Export analytics data as PDF format (text-based)
   */
  static exportToPDF(data: AnalyticsReportData): void {
    const pdfContent = this.generateAnalyticsPDFContent(data);
    this.downloadFile(pdfContent, 'analytics-report.txt', 'text/plain');
  }

  /**
   * Generate CSV content from analytics data
   */
  private static generateAnalyticsCSVContent(data: AnalyticsReportData): string {
    const rows = [
      ['Analytics Report', data.generatedAt],
      ['Period', data.period],
      [''],
      ['Overview Statistics'],
      ['Metric', 'Value'],
      ['Total Users', data.overview.totalUsers.toString()],
      ['Active Users', data.overview.activeUsers.toString()],
      ['Page Views', data.overview.pageViews.toString()],
      ['Sessions', data.overview.sessions.toString()],
      ['Bounce Rate', `${data.overview.bounceRate}%`],
      ['Average Session Duration', data.overview.avgSessionDuration],
      [''],
      ['User Growth (Last 6 Months)'],
      ['Month', 'Users', 'Growth %'],
      ...data.userGrowth.map(growth => [
        growth.month,
        growth.users.toString(),
        `${growth.growth}%`
      ]),
      [''],
      ['Top Pages'],
      ['Page', 'Total Views', 'Unique Views'],
      ...data.topPages.map(page => [
        page.page,
        page.views.toString(),
        page.uniqueViews.toString()
      ]),
      [''],
      ['Traffic Sources'],
      ['Source', 'Percentage', 'Visitors'],
      ...data.trafficSources.map(source => [
        source.source,
        `${source.percentage}%`,
        source.visitors.toString()
      ]),
      [''],
      ['Device Breakdown'],
      ['Device', 'Percentage', 'Users'],
      ...data.deviceBreakdown.map(device => [
        device.device,
        `${device.percentage}%`,
        device.users.toString()
      ]),
      [''],
      ['Recent Real-time Activity'],
      ['Type', 'Message', 'Timestamp'],
      ...data.realTimeActivity.map(activity => [
        activity.type,
        activity.message,
        activity.timestamp
      ])
    ];

    return rows.map(row => 
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Generate PDF content (text-based for simplicity)
   */
  private static generateAnalyticsPDFContent(data: AnalyticsReportData): string {
    const lines = [
      '='.repeat(70),
      '                      ANALYTICS REPORT',
      '='.repeat(70),
      '',
      `Generated: ${data.generatedAt}`,
      `Period: ${data.period}`,
      '',
      '-'.repeat(50),
      'OVERVIEW STATISTICS',
      '-'.repeat(50),
      `Total Users: ${data.overview.totalUsers.toLocaleString()}`,
      `Active Users: ${data.overview.activeUsers.toLocaleString()}`,
      `Page Views: ${data.overview.pageViews.toLocaleString()}`,
      `Sessions: ${data.overview.sessions.toLocaleString()}`,
      `Bounce Rate: ${data.overview.bounceRate}%`,
      `Average Session Duration: ${data.overview.avgSessionDuration}`,
      '',
      '-'.repeat(50),
      'USER GROWTH (Last 6 Months)',
      '-'.repeat(50),
      ...data.userGrowth.map(growth => 
        `${growth.month}: ${growth.users.toLocaleString()} users (${growth.growth > 0 ? '+' : ''}${growth.growth}%)`
      ),
      '',
      '-'.repeat(50),
      'TOP PAGES',
      '-'.repeat(50),
      ...data.topPages.map(page => 
        `${page.page}: ${page.views.toLocaleString()} total views, ${page.uniqueViews.toLocaleString()} unique views`
      ),
      '',
      '-'.repeat(50),
      'TRAFFIC SOURCES',
      '-'.repeat(50),
      ...data.trafficSources.map(source => 
        `${source.source}: ${source.percentage}% (${source.visitors.toLocaleString()} visitors)`
      ),
      '',
      '-'.repeat(50),
      'DEVICE BREAKDOWN',
      '-'.repeat(50),
      ...data.deviceBreakdown.map(device => 
        `${device.device}: ${device.percentage}% (${device.users.toLocaleString()} users)`
      ),
      '',
      '-'.repeat(50),
      'RECENT REAL-TIME ACTIVITY',
      '-'.repeat(50),
      ...data.realTimeActivity.map(activity => 
        `[${activity.timestamp}] ${activity.type.toUpperCase()}: ${activity.message}`
      ),
      '',
      '='.repeat(70),
      'End of Analytics Report',
      '='.repeat(70)
    ];

    return lines.join('\n');
  }

  /**
   * Download file with given content, filename, and MIME type
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Collect analytics data for export
   */
  static collectAnalyticsData(
    selectedPeriod: string,
    analyticsData: AnalyticsData,
    realTimeActivity: RealTimeActivity[]
  ): AnalyticsReportData {
    return {
      period: this.formatPeriod(selectedPeriod),
      generatedAt: new Date().toLocaleString(),
      overview: {
        totalUsers: analyticsData.overview.totalUsers,
        activeUsers: analyticsData.overview.activeUsers,
        pageViews: analyticsData.overview.pageViews,
        sessions: analyticsData.overview.sessions,
        bounceRate: analyticsData.overview.bounceRate,
        avgSessionDuration: analyticsData.overview.avgSessionDuration
      },
      userGrowth: analyticsData.userGrowth.map((growth) => ({
        month: growth.month,
        users: growth.users,
        growth: growth.growth
      })),
      topPages: analyticsData.topPages.map((page) => ({
        page: page.page,
        views: page.views,
        uniqueViews: page.uniqueViews
      })),
      trafficSources: analyticsData.trafficSources.map((source) => ({
        source: source.source,
        percentage: source.percentage,
        visitors: source.visitors
      })),
      deviceBreakdown: analyticsData.deviceBreakdown.map((device) => ({
        device: device.device,
        percentage: device.percentage,
        users: device.users
      })),
      realTimeActivity: realTimeActivity.map((activity) => ({
        type: activity.type,
        message: activity.message,
        timestamp: activity.timestamp
      }))
    };
  }

  /**
   * Format period for display
   */
  private static formatPeriod(period: string): string {
    const periodMap: { [key: string]: string } = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
      '1y': 'Last year'
    };
    return periodMap[period] || period;
  }
}
