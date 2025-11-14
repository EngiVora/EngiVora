"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Clock, XCircle, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistrationStatus {
  registrationId: string;
  examId: string;
  examTitle: string;
  candidateName: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  paymentStatus: 'pending' | 'completed' | 'failed';
  examDate: string;
  examCenter: string;
  admitCardUrl?: string;
  timeline: {
    event: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
    description?: string;
  }[];
}

const mockRegistrationData: RegistrationStatus = {
  registrationId: "REG1234567890",
  examId: "thermo",
  examTitle: "Thermodynamics Exam",
  candidateName: "John Doe",
  status: "confirmed",
  paymentStatus: "completed",
  examDate: "2024-07-20",
  examCenter: "New Delhi",
  admitCardUrl: "https://portal.example.com/admit-card/REG1234567890",
  timeline: [
    {
      event: "Registration Submitted",
      date: "2024-06-15",
      status: "completed",
      description: "Your application has been successfully submitted"
    },
    {
      event: "Payment Completed",
      date: "2024-06-15",
      status: "completed",
      description: "Registration fee payment of ₹1,500 received"
    },
    {
      event: "Document Verification",
      date: "2024-06-17",
      status: "completed",
      description: "All uploaded documents have been verified and approved"
    },
    {
      event: "Registration Confirmed",
      date: "2024-06-18",
      status: "completed",
      description: "Your registration has been confirmed"
    },
    {
      event: "Admit Card Available",
      date: "2024-07-15",
      status: "current",
      description: "Admit card is now available for download"
    },
    {
      event: "Exam Date",
      date: "2024-07-20",
      status: "pending",
      description: "Exam will be conducted at your selected center"
    }
  ]
};

export default function ExamTrackingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [registrationData, setRegistrationData] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a registration ID or email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, return mock data for any search
      setRegistrationData(mockRegistrationData);
    } catch (err) {
      setError("Registration not found. Please check your registration ID.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-slate-400" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      case 'completed':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  const handleDownloadAdmitCard = () => {
    if (registrationData?.admitCardUrl) {
      const link = document.createElement('a');
      link.href = registrationData.admitCardUrl;
      link.download = `admit-card-${registrationData.registrationId}.pdf`;
      link.click();
      alert("Admit card download started!");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exams
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Track Your Registration
          </h1>
          <p className="text-slate-400">
            Enter your registration ID or email to track your exam registration status
          </p>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Registration ID or Email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter registration ID (e.g., REG1234567890) or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                {loading ? "Searching..." : "Track Status"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </motion.div>

        {/* Registration Details */}
        {registrationData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Status Overview */}
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{registrationData.examTitle}</h2>
                  <div className="space-y-1 text-slate-300">
                    <p><span className="font-medium">Registration ID:</span> {registrationData.registrationId}</p>
                    <p><span className="font-medium">Candidate:</span> {registrationData.candidateName}</p>
                    <p><span className="font-medium">Exam Date:</span> {new Date(registrationData.examDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Exam Center:</span> {registrationData.examCenter}</p>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="mb-2">
                    <span className="text-sm text-slate-400">Registration Status</span>
                    <p className={`text-lg font-bold ${getStatusColor(registrationData.status)}`}>
                      {registrationData.status.charAt(0).toUpperCase() + registrationData.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-400">Payment Status</span>
                    <p className={`text-lg font-bold ${getStatusColor(registrationData.paymentStatus)}`}>
                      {registrationData.paymentStatus.charAt(0).toUpperCase() + registrationData.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {registrationData.status === 'confirmed' && registrationData.admitCardUrl && (
              <div className="bg-slate-900 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Available Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleDownloadAdmitCard}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Admit Card
                  </button>
                  <button
                    onClick={() => window.open(`/exams/${registrationData.examId}`, '_blank')}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                  >
                    View Exam Details
                  </button>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-6">Registration Timeline</h3>
              <div className="space-y-6">
                {registrationData.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className={`font-medium ${
                          item.status === 'current' ? 'text-yellow-400' :
                          item.status === 'completed' ? 'text-slate-100' : 'text-slate-400'
                        }`}>
                          {item.event}
                        </h4>
                        <span className="text-sm text-slate-400">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-slate-400 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Instructions */}
            <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-amber-200 mb-4">Important Instructions</h3>
              <ul className="space-y-2 text-amber-100 text-sm">
                <li>• Download and print your admit card at least 2 days before the exam</li>
                <li>• Carry a valid photo ID along with your admit card to the exam center</li>
                <li>• Reach the exam center at least 30 minutes before the reporting time</li>
                <li>• Electronic devices are not allowed in the exam hall</li>
                <li>• Check the exam center address and plan your travel accordingly</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-300 mb-2">Contact Support</p>
                  <p className="text-sky-400">support@engivora.com</p>
                  <p className="text-sky-400">+91-1800-123-4567</p>
                </div>
                <div>
                  <p className="text-slate-300 mb-2">Support Hours</p>
                  <p className="text-slate-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-slate-400">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-blue-200 text-sm">
            <strong>Demo Notice:</strong> This is a demonstration page. In a real application,
            enter any registration ID or email to see sample tracking information.
          </p>
        </div>
      </div>
    </main>
  );
}
