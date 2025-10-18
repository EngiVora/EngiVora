"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";

interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  education: {
    qualification: string;
    institution: string;
    passingYear: string;
    percentage: string;
  };
  examPreferences: {
    examCenter: string;
    language: string;
  };
  documents: {
    photo: File | null;
    signature: File | null;
    qualification: File | null;
    identity: File | null;
  };
}

const examCenters = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Pune",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const languages = ["English", "Hindi"];

function ExamRegistrationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || "thermo";
  const examTitle = searchParams.get("title") || "Thermodynamics Exam";

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    address: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    education: {
      qualification: "",
      institution: "",
      passingYear: "",
      percentage: "",
    },
    examPreferences: {
      examCenter: "",
      language: "",
    },
    documents: {
      photo: null,
      signature: null,
      qualification: null,
      identity: null,
    },
  });

  const steps = [
    { id: 1, title: "Personal Information", description: "Basic details" },
    { id: 2, title: "Address", description: "Contact information" },
    { id: 3, title: "Education", description: "Academic qualifications" },
    { id: 4, title: "Exam Preferences", description: "Center and language" },
    { id: 5, title: "Documents", description: "Upload required documents" },
    { id: 6, title: "Review & Submit", description: "Final verification" },
  ];

  const updateFormData = (
    section: keyof FormData,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (
    field: keyof FormData["documents"],
    file: File | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/exam-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Registration submitted successfully! Your registration ID is: ${result.data.registrationId}. You will receive confirmation via email.`,
        );
        router.push(`/exams/${examId}`);
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.personalInfo.fullName}
                  onChange={(e) =>
                    updateFormData("personalInfo", "fullName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    updateFormData("personalInfo", "email", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    updateFormData("personalInfo", "phone", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    updateFormData(
                      "personalInfo",
                      "dateOfBirth",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Gender *
                </label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.personalInfo.gender === gender}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "gender",
                            e.target.value,
                          )
                        }
                        className="mr-2"
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Address *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.address.address}
                  onChange={(e) =>
                    updateFormData("address", "address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    value={formData.address.city}
                    onChange={(e) =>
                      updateFormData("address", "city", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    value={formData.address.state}
                    onChange={(e) =>
                      updateFormData("address", "state", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    value={formData.address.pincode}
                    onChange={(e) =>
                      updateFormData("address", "pincode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">
              Educational Qualification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Highest Qualification *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.education.qualification}
                  onChange={(e) =>
                    updateFormData("education", "qualification", e.target.value)
                  }
                >
                  <option value="">Select Qualification</option>
                  <option value="bachelor">Bachelor&apos;s Degree</option>
                  <option value="master">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Institution/University *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.education.institution}
                  onChange={(e) =>
                    updateFormData("education", "institution", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Year of Passing *
                </label>
                <input
                  type="number"
                  required
                  min="1980"
                  max="2024"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.education.passingYear}
                  onChange={(e) =>
                    updateFormData("education", "passingYear", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Percentage/CGPA *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.education.percentage}
                  onChange={(e) =>
                    updateFormData("education", "percentage", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Exam Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Exam Center *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.examPreferences.examCenter}
                  onChange={(e) =>
                    updateFormData(
                      "examPreferences",
                      "examCenter",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select Exam Center</option>
                  {examCenters.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Exam Language *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={formData.examPreferences.language}
                  onChange={(e) =>
                    updateFormData(
                      "examPreferences",
                      "language",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select Language</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        const DocumentUpload = ({
          label,
          field,
          accept,
          required = false,
        }: {
          label: string;
          field: keyof FormData["documents"];
          accept: string;
          required?: boolean;
        }) => (
          <div>
            <label className="block text-sm font-medium mb-2">
              {label} {required && "*"}
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
              <input
                type="file"
                accept={accept}
                onChange={(e) =>
                  handleFileUpload(field, e.target.files?.[0] || null)
                }
                className="hidden"
                id={field}
              />
              <label htmlFor={field} className="cursor-pointer">
                {formData.documents[field] ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{formData.documents[field]?.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleFileUpload(field, null);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">
                      Click to upload {label.toLowerCase()}
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentUpload
                label="Passport Size Photo"
                field="photo"
                accept="image/*"
                required
              />
              <DocumentUpload
                label="Signature"
                field="signature"
                accept="image/*"
                required
              />
              <DocumentUpload
                label="Educational Certificate"
                field="qualification"
                accept=".pdf,image/*"
                required
              />
              <DocumentUpload
                label="Identity Proof"
                field="identity"
                accept=".pdf,image/*"
                required
              />
            </div>
            <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4">
              <p className="text-amber-200 text-sm">
                <strong>Note:</strong> All documents should be clear and
                legible. Maximum file size: 2MB per document. Accepted formats:
                JPG, PNG, PDF.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
            <div className="space-y-6">
              {/* Personal Info Summary */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Name: {formData.personalInfo.fullName}</span>
                  <span>Email: {formData.personalInfo.email}</span>
                  <span>Phone: {formData.personalInfo.phone}</span>
                  <span>Gender: {formData.personalInfo.gender}</span>
                </div>
              </div>

              {/* Education Summary */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Education</h4>
                <div className="text-sm">
                  <p>
                    {formData.education.qualification} from{" "}
                    {formData.education.institution}
                  </p>
                  <p>
                    Year: {formData.education.passingYear}, Score:{" "}
                    {formData.education.percentage}
                  </p>
                </div>
              </div>

              {/* Exam Preferences */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Exam Preferences</h4>
                <div className="text-sm">
                  <p>Center: {formData.examPreferences.examCenter}</p>
                  <p>Language: {formData.examPreferences.language}</p>
                </div>
              </div>

              {/* Fee Details */}
              <div className="bg-sky-900/30 border border-sky-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Fee Summary</h4>
                <div className="flex justify-between">
                  <span>Registration Fee:</span>
                  <span className="font-bold">₹1,500</span>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms" className="text-sm text-slate-300">
                  I agree to the terms and conditions and confirm that all
                  information provided is accurate.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
            Back
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Register for {examTitle}
          </h1>
          <p className="text-slate-400">
            Complete all steps to register for the exam
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep >= step.id
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-px w-8 ml-2 ${
                      currentStep > step.id ? "bg-sky-600" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="font-semibold">{steps[currentStep - 1]?.title}</h2>
            <p className="text-sm text-slate-400">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900 rounded-lg p-6 mb-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-600 text-white rounded-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ExamRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
        </div>
      }
    >
      <ExamRegistrationPageContent />
    </Suspense>
  );
}
