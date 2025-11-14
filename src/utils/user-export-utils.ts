// User export utility functions for generating user reports in different formats

export interface UserExportData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
}

export interface UserReportData {
  generatedAt: string;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  adminCount: number;
  moderatorCount: number;
  studentCount: number;
  users: UserExportData[];
}

export class UserExportUtils {
  /**
   * Export user data as CSV format
   */
  static exportToCSV(data: UserReportData): void {
    const csvContent = this.generateUserCSVContent(data);
    this.downloadFile(csvContent, 'users-export.csv', 'text/csv');
  }

  /**
   * Export user data as JSON format
   */
  static exportToJSON(data: UserReportData): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, 'users-export.json', 'application/json');
  }

  /**
   * Export user data as PDF format (text-based)
   */
  static exportToPDF(data: UserReportData): void {
    const pdfContent = this.generateUserPDFContent(data);
    this.downloadFile(pdfContent, 'users-export.txt', 'text/plain');
  }

  /**
   * Generate CSV content from user data
   */
  private static generateUserCSVContent(data: UserReportData): string {
    const rows = [
      ['User Export Report', data.generatedAt],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Count'],
      ['Total Users', data.totalUsers.toString()],
      ['Active Users', data.activeUsers.toString()],
      ['Inactive Users', data.inactiveUsers.toString()],
      ['Suspended Users', data.suspendedUsers.toString()],
      ['Admins', data.adminCount.toString()],
      ['Moderators', data.moderatorCount.toString()],
      ['Students', data.studentCount.toString()],
      [''],
      ['User Details'],
      ['ID', 'Name', 'Email', 'Role', 'Status', 'Join Date', 'Last Active'],
      ...data.users.map(user => [
        user.id.toString(),
        user.name,
        user.email,
        user.role,
        user.status,
        user.joinDate,
        user.lastActive
      ])
    ];

    return rows.map(row => 
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Generate PDF content (text-based for simplicity)
   */
  private static generateUserPDFContent(data: UserReportData): string {
    const lines = [
      '='.repeat(70),
      '                      USER EXPORT REPORT',
      '='.repeat(70),
      '',
      `Generated: ${data.generatedAt}`,
      '',
      '-'.repeat(50),
      'SUMMARY STATISTICS',
      '-'.repeat(50),
      `Total Users: ${data.totalUsers.toLocaleString()}`,
      `Active Users: ${data.activeUsers.toLocaleString()}`,
      `Inactive Users: ${data.inactiveUsers.toLocaleString()}`,
      `Suspended Users: ${data.suspendedUsers.toLocaleString()}`,
      `Admins: ${data.adminCount.toLocaleString()}`,
      `Moderators: ${data.moderatorCount.toLocaleString()}`,
      `Students: ${data.studentCount.toLocaleString()}`,
      '',
      '-'.repeat(50),
      'USER DETAILS',
      '-'.repeat(50),
      ...data.users.map(user => 
        `ID: ${user.id} | ${user.name} | ${user.email} | ${user.role} | ${user.status} | ${user.joinDate} | ${user.lastActive}`
      ),
      '',
      '='.repeat(70),
      'End of User Report',
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
   * Collect user data for export
   */
  static collectUserData(users: UserExportData[]): UserReportData {
    const activeUsers = users.filter(u => u.status === "Active").length;
    const inactiveUsers = users.filter(u => u.status === "Inactive").length;
    const suspendedUsers = users.filter(u => u.status === "Suspended").length;
    const adminCount = users.filter(u => u.role === "Admin").length;
    const moderatorCount = users.filter(u => u.role === "Moderator").length;
    const studentCount = users.filter(u => u.role === "Student").length;

    return {
      generatedAt: new Date().toLocaleString(),
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      adminCount,
      moderatorCount,
      studentCount,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: user.joinDate,
        lastActive: user.lastActive
      }))
    };
  }

  /**
   * Validate CSV format for import
   */
  static validateCSVFormat(csvContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = csvContent.split('\n');
    
    if (lines.length < 2) {
      errors.push('CSV file must have at least a header row and one data row');
      return { isValid: false, errors };
    }

    const header = lines[0].toLowerCase();
    const requiredColumns = ['name', 'email', 'role', 'status'];
    
    for (const column of requiredColumns) {
      if (!header.includes(column)) {
        errors.push(`Missing required column: ${column}`);
      }
    }

    // Check data rows
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim();
      if (row) {
        const columns = row.split(',');
        if (columns.length < requiredColumns.length) {
          errors.push(`Row ${i + 1}: Insufficient columns`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Parse CSV content to user data
   */
  static parseCSVToUsers(csvContent: string): UserExportData[] {
    const lines = csvContent.split('\n');
    // Skip header line - lines[0]
    const users: UserExportData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim();
      if (row) {
        const columns = row.split(',').map(col => col.replace(/"/g, '').trim());
        
        if (columns.length >= 4) {
          users.push({
            id: users.length + 1, // Generate ID
            name: columns[0] || '',
            email: columns[1] || '',
            role: columns[2] || 'Student',
            status: columns[3] || 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: 'Never'
          });
        }
      }
    }

    return users;
  }
}
