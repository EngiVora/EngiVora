import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminApiDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground">Overview of admin API endpoints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin API Endpoints</CardTitle>
          <CardDescription>
            Secure endpoints for admin panel functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Authentication</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">POST /api/auth/login</div>
                  <div className="text-sm text-muted-foreground">Admin login endpoint</div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Request Body:</div>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`{
  "email": "string",
  "password": "string"
}`}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium">POST /api/auth/logout</div>
                  <div className="text-sm text-muted-foreground">Admin logout endpoint</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium">POST /api/auth/verify-token</div>
                  <div className="text-sm text-muted-foreground">Verify admin token</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Dashboard</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">GET /api/admin/dashboard</div>
                  <div className="text-sm text-muted-foreground">Get admin dashboard data</div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Headers:</div>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`Authorization: Bearer <token>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">User Management</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">GET /api/admin/users</div>
                  <div className="text-sm text-muted-foreground">Get all users with pagination</div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Query Parameters:</div>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`page: number (default: 1)
limit: number (default: 10)`}
                    </pre>
                    <div className="font-medium mt-2">Headers:</div>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`Authorization: Bearer <token>`}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium">POST /api/admin/users</div>
                  <div className="text-sm text-muted-foreground">Create a new user</div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Headers:</div>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`Authorization: Bearer <token>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}