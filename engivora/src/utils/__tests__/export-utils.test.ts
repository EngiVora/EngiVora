import { ExportUtils, DashboardReportData } from '../export-utils'

// Mock data for testing
const mockStats = [
  { name: "Total Users", value: "12,543" },
  { name: "Active Users", value: "8,234" },
  { name: "Blog Posts", value: "1,247" },
  { name: "Job Listings", value: "456" },
  { name: "Exam Updates", value: "89" },
  { name: "Revenue", value: "$24,567" }
]

const mockSystemStatus = [
  { name: "Server Status", status: "operational" },
  { name: "Database", status: "operational" },
  { name: "API Services", status: "operational" }
]

const mockRecentActivities = [
  { type: "user_registration", message: "New user registered", time: "2 minutes ago" },
  { type: "blog_published", message: "Blog post published", time: "15 minutes ago" }
]

const mockContentDistribution = [
  { category: "Blog Posts", percentage: 45 },
  { category: "Job Listings", percentage: 30 }
]

describe('ExportUtils', () => {
  describe('collectDashboardData', () => {
    it('should collect and format dashboard data correctly', () => {
      const result = ExportUtils.collectDashboardData(
        '7d',
        mockStats,
        mockSystemStatus,
        mockRecentActivities,
        mockContentDistribution
      )

      expect(result.period).toBe('Last 7 days')
      expect(result.stats.totalUsers).toBe(12543)
      expect(result.stats.activeUsers).toBe(8234)
      expect(result.stats.blogPosts).toBe(1247)
      expect(result.stats.jobListings).toBe(456)
      expect(result.stats.examUpdates).toBe(89)
      expect(result.stats.revenue).toBe(24567)
      expect(result.systemStatus).toHaveLength(3)
      expect(result.recentActivities).toHaveLength(2)
      expect(result.contentDistribution).toHaveLength(2)
      expect(result.generatedAt).toBeDefined()
    })

    it('should handle different period formats', () => {
      const result24h = ExportUtils.collectDashboardData('24h', mockStats, [], [], [])
      const result30d = ExportUtils.collectDashboardData('30d', mockStats, [], [], [])
      const result90d = ExportUtils.collectDashboardData('90d', mockStats, [], [], [])

      expect(result24h.period).toBe('Last 24 hours')
      expect(result30d.period).toBe('Last 30 days')
      expect(result90d.period).toBe('Last 90 days')
    })
  })

  describe('export methods', () => {
    let mockDownload: jest.SpyInstance
    let mockCreateElement: jest.SpyInstance
    let mockAppendChild: jest.SpyInstance
    let mockClick: jest.SpyInstance
    let mockRemoveChild: jest.SpyInstance
    let mockCreateObjectURL: jest.SpyInstance
    let mockRevokeObjectURL: jest.SpyInstance

    beforeEach(() => {
      mockCreateElement = jest.spyOn(document, 'createElement')
      mockAppendChild = jest.spyOn(document.body, 'appendChild')
      mockRemoveChild = jest.spyOn(document.body, 'removeChild')
      mockClick = jest.fn()
      mockCreateObjectURL = jest.spyOn(window.URL, 'createObjectURL')
      mockRevokeObjectURL = jest.spyOn(window.URL, 'revokeObjectURL')

      const mockLink = {
        href: '',
        download: '',
        click: mockClick
      }

      mockCreateElement.mockReturnValue(mockLink)
      mockCreateObjectURL.mockReturnValue('mock-url')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should export CSV format', () => {
      const testData: DashboardReportData = {
        period: 'Last 7 days',
        generatedAt: '2024-01-01 12:00:00',
        stats: {
          totalUsers: 1000,
          activeUsers: 800,
          blogPosts: 100,
          jobListings: 50,
          examUpdates: 20,
          revenue: 5000
        },
        systemStatus: [],
        recentActivities: [],
        contentDistribution: []
      }

      ExportUtils.exportToCSV(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export JSON format', () => {
      const testData: DashboardReportData = {
        period: 'Last 7 days',
        generatedAt: '2024-01-01 12:00:00',
        stats: {
          totalUsers: 1000,
          activeUsers: 800,
          blogPosts: 100,
          jobListings: 50,
          examUpdates: 20,
          revenue: 5000
        },
        systemStatus: [],
        recentActivities: [],
        contentDistribution: []
      }

      ExportUtils.exportToJSON(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export PDF format', () => {
      const testData: DashboardReportData = {
        period: 'Last 7 days',
        generatedAt: '2024-01-01 12:00:00',
        stats: {
          totalUsers: 1000,
          activeUsers: 800,
          blogPosts: 100,
          jobListings: 50,
          examUpdates: 20,
          revenue: 5000
        },
        systemStatus: [],
        recentActivities: [],
        contentDistribution: []
      }

      ExportUtils.exportToPDF(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })
})
