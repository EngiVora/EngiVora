import { UserExportUtils, UserExportData } from '../user-export-utils'

// Mock user data for testing
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-12-10",
    lastActive: "1 hour ago"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Moderator",
    status: "Inactive",
    joinDate: "2024-02-01",
    lastActive: "1 week ago"
  }
]

describe('UserExportUtils', () => {
  describe('collectUserData', () => {
    it('should collect and format user data correctly', () => {
      const result = UserExportUtils.collectUserData(mockUsers)

      expect(result.totalUsers).toBe(3)
      expect(result.activeUsers).toBe(2)
      expect(result.inactiveUsers).toBe(1)
      expect(result.suspendedUsers).toBe(0)
      expect(result.adminCount).toBe(1)
      expect(result.moderatorCount).toBe(1)
      expect(result.studentCount).toBe(1)
      expect(result.users).toHaveLength(3)
      expect(result.generatedAt).toBeDefined()
    })

    it('should handle empty user array', () => {
      const result = UserExportUtils.collectUserData([])

      expect(result.totalUsers).toBe(0)
      expect(result.activeUsers).toBe(0)
      expect(result.inactiveUsers).toBe(0)
      expect(result.suspendedUsers).toBe(0)
      expect(result.adminCount).toBe(0)
      expect(result.moderatorCount).toBe(0)
      expect(result.studentCount).toBe(0)
      expect(result.users).toHaveLength(0)
    })
  })

  describe('validateCSVFormat', () => {
    it('should validate correct CSV format', () => {
      const validCSV = 'Name,Email,Role,Status\nJohn Doe,john@example.com,Student,Active'
      const result = UserExportUtils.validateCSVFormat(validCSV)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required columns', () => {
      const invalidCSV = 'Name,Email\nJohn Doe,john@example.com'
      const result = UserExportUtils.validateCSVFormat(invalidCSV)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required column: role')
      expect(result.errors).toContain('Missing required column: status')
    })

    it('should detect insufficient data rows', () => {
      const invalidCSV = 'Name,Email,Role,Status\nJohn Doe,john@example.com'
      const result = UserExportUtils.validateCSVFormat(invalidCSV)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Row 2: Insufficient columns')
    })

    it('should handle empty CSV', () => {
      const emptyCSV = ''
      const result = UserExportUtils.validateCSVFormat(emptyCSV)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('CSV file must have at least a header row and one data row')
    })
  })

  describe('parseCSVToUsers', () => {
    it('should parse valid CSV to user data', () => {
      const csvContent = 'Name,Email,Role,Status\nJohn Doe,john@example.com,Student,Active\nJane Smith,jane@example.com,Admin,Active'
      const result = UserExportUtils.parseCSVToUsers(csvContent)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Student',
        status: 'Active',
        joinDate: expect.any(String),
        lastActive: 'Never'
      })
      expect(result[1]).toEqual({
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Active',
        joinDate: expect.any(String),
        lastActive: 'Never'
      })
    })

    it('should handle CSV with quotes', () => {
      const csvContent = '"Name","Email","Role","Status"\n"John Doe","john@example.com","Student","Active"'
      const result = UserExportUtils.parseCSVToUsers(csvContent)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('John Doe')
      expect(result[0].email).toBe('john@example.com')
    })

    it('should handle empty CSV', () => {
      const csvContent = 'Name,Email,Role,Status'
      const result = UserExportUtils.parseCSVToUsers(csvContent)

      expect(result).toHaveLength(0)
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

    it('should export user CSV format', () => {
      const testData = UserExportUtils.collectUserData(mockUsers)

      UserExportUtils.exportToCSV(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export user JSON format', () => {
      const testData = UserExportUtils.collectUserData(mockUsers)

      UserExportUtils.exportToJSON(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should export user PDF format', () => {
      const testData = UserExportUtils.collectUserData(mockUsers)

      UserExportUtils.exportToPDF(testData)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })
})
