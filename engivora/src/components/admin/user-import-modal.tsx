"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
} from "lucide-react";
import { UserExportUtils } from "../../utils/user-export-utils";

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

interface UserImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (users: Omit<User, "id">[]) => void;
  isImporting?: boolean;
}

export function UserImportModal({
  isOpen,
  onClose,
  onImport,
  isImporting = false,
}: UserImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [previewUsers, setPreviewUsers] = useState<User[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (!isImporting) {
      setFileContent("");
      setFileName("");
      setValidation(null);
      setPreviewUsers([]);
      onClose();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setValidation({
        isValid: false,
        errors: ["Please select a valid CSV file"],
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      // Validate the CSV
      const validationResult = UserExportUtils.validateCSVFormat(content);
      setValidation(validationResult);

      if (validationResult.isValid) {
        const users = UserExportUtils.parseCSVToUsers(content);
        setPreviewUsers(users);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (validation?.isValid && previewUsers.length > 0) {
      onImport(previewUsers);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      "Name,Email,Role,Status",
      "John Doe,john.doe@example.com,Student,Active",
      "Jane Smith,jane.smith@example.com,Admin,Active",
      "Mike Johnson,mike.johnson@example.com,Moderator,Inactive",
    ].join("\n");

    const blob = new Blob([templateData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-import-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Import Users
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isImporting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : validation?.isValid
                    ? "border-green-400 bg-green-50"
                    : validation?.isValid === false
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />

              {fileName ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">
                    {fileName}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your CSV file here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    CSV files only. Max file size: 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <div
              className={`p-4 rounded-lg ${
                validation.isValid
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      validation.isValid ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {validation.isValid
                      ? "File is valid"
                      : "File validation failed"}
                  </h3>
                  {validation.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {validation?.isValid && previewUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Preview ({previewUsers.length} users)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewUsers.slice(0, 5).map((user, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {user.role}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {user.status}
                          </td>
                        </tr>
                      ))}
                      {previewUsers.length > 5 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-2 text-sm text-gray-500 text-center"
                          >
                            ... and {previewUsers.length - 5} more users
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Need a template?
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Download our CSV template to see the required format.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Required columns: Name, Email, Role, Status
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              disabled={isImporting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={
                !validation?.isValid || previewUsers.length === 0 || isImporting
              }
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import {previewUsers.length} Users
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
