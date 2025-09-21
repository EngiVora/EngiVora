import { AnalyticsExportUtils, AnalyticsReportData } from '../analytics-export-utils'

// Mock analytics data for testing
const mockAnalyticsData = {
  overview: {
    totalUsers: 12543,
    activeUsers: 8234,
    pageViews: 456789,
    sessions: 234567,
    bounceRate: 42.5,
    avgSessionDuration: "3:24"
  },
  userGrowth: [
    { month: "Jan", users: 1200, growth: 5.2 },
    { month: "Feb", users: 1350, growth: 12.5 }
  ],
  topPages: [
    { page: "/", views: 45678, uniqueViews: 23456 },
    { page: "/blogs", views: 23456, uniqueViews: 18900 }
  ],
  trafficSources: [
    { source: "Direct", percentage: 45, visitors: 11250 },
    { source: "Google", percentage: 30, visitors: 7500 }
  ],
  deviceBreakdown: [
    { device: "Desktop", percentage: 60, users: 15000 },
    { device: "Mobile", percentage: 35, users: 8750 }
  ]
}

const mockRealTimeActivity = [
  {
    type: "user_registration",
    message: "User registered: john.doe@example.com",
    timestamp: "2 seconds ago"
  },
  {
    type: "page_view",
    message: "Blog post viewed: 'AI in Engineering'",
    timestamp: "5 seconds ago"
  }
]

describe('AnalyticsExportUtils', () => {
  describe('collectAnalyticsData', () => {
    it('should collect and format analytics data correctly', () => {
      const result = AnalyticsExportUtils.collectAnalyticsData(
        '30d',
        mockAnalyticsData,
        mockRealTimeActivity
      )

      expect(result.period).toBe('Last 30 days')
      expect(result.overview.totalUsers).toBe(12543)
      expect(result.overview.activeUsers).toBe(8234)
      expect(result.overview.pageViews).toBe(456789)
      expect(result.overview.sessions).toBe(234567)
      expect(result.overview.bounceRate).toBe(42.5)
      expect(result.overview.avgSessionDuration).toBe("3:24")
      expect(result.userGrowth).toHaveLength(2)
      expect(result.topPages).toHaveLength(2)
      expect(result.trafficSources).toHaveLength(2)
      expect(result.deviceBreakdown).toHaveLength(2)
      expect(result.realTimeActivity).toHaveLength(2)
      expect(result.generatedAt).toBeDefined()
    })

    it('should handle different period formats', () => {
      const result7d = AnalyticsExportUtils.collectAnalyticsData('7d', mockAnalyticsData, [])
      const result90d = AnalyticsExportUtils.collectAnalyticsData('90d', mockAnalyticsData, [])
      const result1y = AnalyticsExportUtils.collectAnalyticsData('1y', mockAnalyticsData, [])

      expect(result7d.period).toBe('Last 7 days')
      expect(result90d.period).toBe('Last 90 days')
      expect(result1y.period).toBe('Last year')
    })
  })

  describe('export methods', () => {
    let mockDownload: jest.SpyInstance
    let mockCreateElement: jest.SpyInstance
    let mockAppendChild: jest.SpyInstance
    let mockClick: jest.MockedFunction<() => void>
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

    it('should export analytics CSV format', () => {
      const testData: AnalyticsReportData = {
        period: 'Last 30 days',
        generatedAt: '2024-01-01 12:00:00',
        overview: {
          totalUsers: 1000,
          activeUsers: 800,
          pageViews: 50000,
          sessions: 25000,
          bounceRate: 40.5,
          avgSessionDuration: "2:30"
        },
        userGrowth: [],
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
        realTimeActivity: []
      }

      AnalyticsExportUtils.exportToCSV(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export analytics JSON format', () => {
      const testData: AnalyticsReportData = {
        period: 'Last 30 days',
        generatedAt: '2024-01-01 12:00:00',
        overview: {
          totalUsers: 1000,
          activeUsers: 800,
          pageViews: 50000,
          sessions: 25000,
          bounceRate: 40.5,
          avgSessionDuration: "2:30"
        },
        userGrowth: [],
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
        realTimeActivity: []
      }

      AnalyticsExportUtils.exportToJSON(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export analytics PDF format', () => {
      const testData: AnalyticsReportData = {
        period: 'Last 30 days',
        generatedAt: '2024-01-01 12:00:00',
        overview: {
          totalUsers: 1000,
          activeUsers: 800,
          pageViews: 50000,
          sessions: 25000,
          bounceRate: 40.5,
          avgSessionDuration: "2:30"
        },
        userGrowth: [],
        topPages: [],
        trafficSources: [],
        deviceBreakdown: [],
        realTimeActivity: []
      }

      AnalyticsExportUtils.exportToPDF(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })
})
