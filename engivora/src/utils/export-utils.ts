// Export utility functions for generating reports in different formats

export interface Stat {
  name: string;
  value: string | number;
}

export interface SystemStatus {
  name: string;
  status: string;
}

export interface RecentActivity {
  type: string;
  message: string;
  time: string;
}

export interface ContentDistribution {
  category: string;
  percentage: number;
}

export interface DashboardReportData {
  period: string;
  generatedAt: string;
  stats: {
    totalUsers: number;
    activeUsers: number;
    blogPosts: number;
    jobListings: number;
    examUpdates: number;
    revenue: number;
  };
  systemStatus: {
    name: string;
    status: string;
  }[];
  recentActivities: {
    type: string;
    message: string;
    time: string;
  }[];
  contentDistribution: {
    category: string;
    percentage: number;
  }[];
}

export class ExportUtils {
  /**
   * Export data as CSV format
   */
  static exportToCSV(data: DashboardReportData): void {
    const csvContent = this.generateCSVContent(data);
    this.downloadFile(csvContent, 'dashboard-report.csv', 'text/csv');
  }

  /**
   * Export data as JSON format
   */
  static exportToJSON(data: DashboardReportData): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, 'dashboard-report.json', 'application/json');
  }

  /**
   * Export data as PDF format (simplified text-based)
   */
  static exportToPDF(data: DashboardReportData): void {
    const pdfContent = this.generatePDFContent(data);
    this.downloadFile(pdfContent, 'dashboard-report.txt', 'text/plain');
  }

  /**
   * Generate CSV content from dashboard data
   */
  private static generateCSVContent(data: DashboardReportData): string {
    const rows = [
      ['Dashboard Report', data.generatedAt],
      ['Period', data.period],
      [''],
      ['Statistics'],
      ['Metric', 'Value'],
      ['Total Users', data.stats.totalUsers.toString()],
      ['Active Users', data.stats.activeUsers.toString()],
      ['Blog Posts', data.stats.blogPosts.toString()],
      ['Job Listings', data.stats.jobListings.toString()],
      ['Exam Updates', data.stats.examUpdates.toString()],
      ['Revenue', `$${data.stats.revenue.toLocaleString()}`],
      [''],
      ['System Status'],
      ['Service', 'Status'],
      ...data.systemStatus.map(item => [item.name, item.status]),
      [''],
      ['Recent Activities'],
      ['Type', 'Message', 'Time'],
      ...data.recentActivities.map(activity => [
        activity.type,
        activity.message,
        activity.time
      ]),
      [''],
      ['Content Distribution'],
      ['Category', 'Percentage'],
      ...data.contentDistribution.map(item => [
        item.category,
        `${item.percentage}%`
      ])
    ];

    return rows.map(row => 
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Generate PDF content (text-based for simplicity)
   */
  private static generatePDFContent(data: DashboardReportData): string {
    const lines = [
      '='.repeat(60),
      '                    DASHBOARD REPORT',
      '='.repeat(60),
      '',
      `Generated: ${data.generatedAt}`,
      `Period: ${data.period}`,
      '',
      '-'.repeat(40),
      'STATISTICS',
      '-'.repeat(40),
      `Total Users: ${data.stats.totalUsers.toLocaleString()}`,
      `Active Users: ${data.stats.activeUsers.toLocaleString()}`,
      `Blog Posts: ${data.stats.blogPosts.toLocaleString()}`,
      `Job Listings: ${data.stats.jobListings.toLocaleString()}`,
      `Exam Updates: ${data.stats.examUpdates.toLocaleString()}`,
      `Revenue: $${data.stats.revenue.toLocaleString()}`,
      '',
      '-'.repeat(40),
      'SYSTEM STATUS',
      '-'.repeat(40),
      ...data.systemStatus.map(item => 
        `${item.name}: ${item.status.toUpperCase()}`
      ),
      '',
      '-'.repeat(40),
      'RECENT ACTIVITIES',
      '-'.repeat(40),
      ...data.recentActivities.map(activity => 
        `[${activity.time}] ${activity.type.toUpperCase()}: ${activity.message}`
      ),
      '',
      '-'.repeat(40),
      'CONTENT DISTRIBUTION',
      '-'.repeat(40),
      ...data.contentDistribution.map(item => 
        `${item.category}: ${item.percentage}%`
      ),
      '',
      '='.repeat(60),
      'End of Report',
      '='.repeat(60)
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
   * Collect dashboard data for export
   */
  static collectDashboardData(
    selectedPeriod: string,
    stats: Stat[],
    systemStatus: SystemStatus[],
    recentActivities: RecentActivity[],
    contentDistribution: ContentDistribution[]
  ): DashboardReportData {
    const statsData = stats.reduce((acc, stat) => {
      const key = this.getStatKey(stat.name);
      if (key) {
        acc[key] = this.parseStatValue(stat.value);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      period: this.formatPeriod(selectedPeriod),
      generatedAt: new Date().toLocaleString(),
      stats: {
        totalUsers: statsData.totalUsers || 0,
        activeUsers: statsData.activeUsers || 0,
        blogPosts: statsData.blogPosts || 0,
        jobListings: statsData.jobListings || 0,
        examUpdates: statsData.examUpdates || 0,
        revenue: statsData.revenue || 0,
      },
      systemStatus: systemStatus.map(item => ({
        name: item.name,
        status: item.status
      })),
      recentActivities: recentActivities.map(activity => ({
        type: activity.type,
        message: activity.message,
        time: activity.time
      })),
      contentDistribution: contentDistribution.map(item => ({
        category: item.category,
        percentage: item.percentage
      }))
    };
  }

  /**
   * Get stat key from display name
   */
  private static getStatKey(name: string): string | null {
    const keyMap: { [key: string]: string } = {
      'Total Users': 'totalUsers',
      'Active Users': 'activeUsers',
      'Blog Posts': 'blogPosts',
      'Job Listings': 'jobListings',
      'Exam Updates': 'examUpdates',
      'Revenue': 'revenue'
    };
    return keyMap[name] || null;
  }

  /**
   * Parse stat value to number
   */
  private static parseStatValue(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }
    // Remove commas and dollar signs, then parse
    const cleanValue = value.replace(/[,$]/g, '');
    const numValue = parseFloat(cleanValue);
    return isNaN(numValue) ? 0 : numValue;
  }

  /**
   * Format period for display
   */
  private static formatPeriod(period: string): string {
    const periodMap: { [key: string]: string } = {
      '24h': 'Last 24 hours',
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days'
    };
    return periodMap[period] || period;
  }
}
