import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Key,
  Shield,
  Lock,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminAuthDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Authentication System</h1>
        <p className="text-muted-foreground">
          Documentation for the admin portal authentication
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              System Overview
            </CardTitle>
            <CardDescription>
              How the admin authentication system works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The admin portal uses a separate, hardcoded authentication
                system that is independent of the main client authentication
                used by regular users.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Email/password authentication</li>
                <li>JWT-based session management</li>
                <li>Role-based access control (admin only)</li>
                <li>Secure authentication system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Features
            </CardTitle>
            <CardDescription>Current security implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">JWT Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure token-based authentication
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Password Hashing</h3>
                  <p className="text-sm text-muted-foreground">
                    BCrypt for secure password storage
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Role Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Only admin users can access admin routes
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Limited Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Not suitable for production use
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Demo Credentials
          </CardTitle>
          <CardDescription>
            Pre-configured credentials for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Admin User</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Email:</strong> admin@engivora.com
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
                <p>
                  <strong>Role:</strong> admin
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50">
              <h3 className="font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                Important Note
              </h3>
              <p className="text-sm text-yellow-700">
                These credentials are hardcoded for development/testing purposes
                only. Do not use in production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            API Endpoints
          </CardTitle>
          <CardDescription>Available authentication endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">POST /api/auth/login</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Authenticate admin user
              </p>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Request Body:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                  {`{
  "email": "string",
  "password": "string"
}`}
                </pre>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">POST /api/auth/logout</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Logout admin user
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">POST /api/auth/verify-token</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Verify admin token
              </p>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Headers:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                  {`Authorization: Bearer <token>`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Production Considerations
          </CardTitle>
          <CardDescription>
            Important notes for production deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-yellow-700">
              <strong>Warning:</strong> This authentication system is intended
              for development and testing purposes only. For production use, you
              should:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                Replace hardcoded credentials with a proper user management
                system
              </li>
              <li>Implement database storage for admin users</li>
              <li>Add proper password reset functionality</li>
              <li>Implement email verification for admin accounts</li>
              <li>Add multi-factor authentication for enhanced security</li>
              <li>Use environment variables for sensitive configuration</li>
              <li>Implement proper session management and expiration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
