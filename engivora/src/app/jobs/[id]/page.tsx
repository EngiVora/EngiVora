"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Star,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: string;
  postedDate: string;
  companyInfo: {
    name: string;
    description: string;
    size: string;
    industry: string;
    website: string;
    logo: string;
    founded: string;
  };
  relatedJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
  }[];
}

// Mock data - in real app this would come from API
const mockJobData: { [key: string]: JobDetail } = {
  "mechanical-engineer-intern": {
    id: "mechanical-engineer-intern",
    title: "Mechanical Engineer Intern",
    company: "Tech Solutions Inc",
    location: "Remote",
    type: "Internship",
    level: "Entry Level",
    salary: "$25-30/hour",
    description:
      "An exciting opportunity for a motivated student to gain hands-on experience in mechanical design and product development. You will work alongside our senior engineers on cutting-edge projects involving CAD design, prototype development, and testing of innovative mechanical systems.",
    requirements: [
      "Currently pursuing Bachelor's degree in Mechanical Engineering",
      "Proficiency in CAD software (SolidWorks, AutoCAD, or Fusion 360)",
      "Strong analytical and problem-solving skills",
      "Knowledge of manufacturing processes",
      "Excellent communication and teamwork abilities",
      "GPA of 3.0 or higher",
    ],
    responsibilities: [
      "Assist in the design and development of mechanical components",
      "Create detailed engineering drawings and specifications",
      "Participate in design reviews and prototype testing",
      "Collaborate with cross-functional teams on product development",
      "Conduct research on materials and manufacturing processes",
      "Support senior engineers in project execution",
    ],
    benefits: [
      "Competitive hourly wage",
      "Flexible remote work arrangement",
      "Mentorship from experienced engineers",
      "Access to industry-standard software and tools",
      "Professional development opportunities",
      "Potential for full-time offer upon graduation",
    ],
    skills: [
      "SolidWorks",
      "AutoCAD",
      "MATLAB",
      "Python",
      "Manufacturing",
      "3D Printing",
    ],
    applicationDeadline: "2024-08-15",
    postedDate: "2024-07-10",
    companyInfo: {
      name: "Tech Solutions Inc",
      description:
        "A leading technology company specializing in innovative mechanical solutions for the automotive and aerospace industries.",
      size: "500-1000 employees",
      industry: "Technology & Engineering",
      website: "https://techsolutions.com",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6byUVckMqg6gmZhI9DsFjBLDSADsBBPdbK0f3saTH0PXJD9YJAs16HQ9MnxyasAzqznROviksz6opuPiyoJyisTxYAjpWCmFizrDCO6aURW1d-WdZFTaoyKNy2ZzalhBXRTNRmDdkxVVw41UdGHZy7rWhGsXLaHIeGt1oaekIAsRJ4uo0rM1zq4qrRpuFt7jfpDMYUj7fNrBkPGAJJoIs3i-5CHxbXbGsbotvV2xSoBN5Z5f6bGoPBuGE7oUOsyK-o8XaqQQOlk",
      founded: "2015",
    },
    relatedJobs: [
      {
        id: "software-engineer",
        title: "Software Engineer",
        company: "Tech Solutions Inc",
        location: "Remote",
      },
      {
        id: "design-engineer",
        title: "Design Engineer",
        company: "Tech Solutions Inc",
        location: "San Francisco, CA",
      },
      {
        id: "product-manager",
        title: "Product Manager",
        company: "Tech Solutions Inc",
        location: "Remote",
      },
    ],
  },
  "software-engineer": {
    id: "software-engineer",
    title: "Software Engineer",
    company: "Innovate Systems",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Entry Level",
    salary: "$80,000 - $100,000",
    description:
      "Join our dynamic team and contribute to the development of our flagship product. This role is perfect for a recent graduate passionate about coding and problem-solving. You'll work on scalable web applications and contribute to our cutting-edge technology stack.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "Proficiency in JavaScript, Python, or Java",
      "Experience with React, Node.js, or similar frameworks",
      "Understanding of database systems and SQL",
      "Knowledge of version control systems (Git)",
      "Strong problem-solving and debugging skills",
    ],
    responsibilities: [
      "Develop and maintain web applications using modern technologies",
      "Write clean, efficient, and well-documented code",
      "Collaborate with product managers and designers",
      "Participate in code reviews and technical discussions",
      "Troubleshoot and debug applications",
      "Stay up-to-date with emerging technologies",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "401(k) with company matching",
      "Flexible PTO policy",
      "Professional development budget",
      "Modern office with free snacks and drinks",
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
    applicationDeadline: "2024-08-20",
    postedDate: "2024-07-08",
    companyInfo: {
      name: "Innovate Systems",
      description:
        "A fast-growing startup focused on developing innovative software solutions for enterprise clients.",
      size: "50-200 employees",
      industry: "Software & Technology",
      website: "https://innovatesystems.com",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1IU2jpeLS_hX69bOnAJKS0x5aYfdFUQTtSMCJzdFoyCMO-l2uzzxdAHbJ5GXn5Jdz4s5SfaBe_HopIr46pVcy67W2hx8LUPsJLKDXOvLX_AN7wqM4oUWCPfCqXwNSX4UN4lWtRW-FyF4Wej-YaF0JtTxME4YPIztBrHxqhjw6hsBxrAFytx2wa83Tq-YBBgRwBkCDTROeNIa8yU82fibAWQXA1WcvnSqpQfVREyUWS-qoJubyq2m-NUQkxp2zKmpJuqMbOmwLxzA",
      founded: "2018",
    },
    relatedJobs: [
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        company: "Innovate Systems",
        location: "San Francisco, CA",
      },
      {
        id: "backend-developer",
        title: "Backend Developer",
        company: "Innovate Systems",
        location: "Remote",
      },
      {
        id: "devops-engineer",
        title: "DevOps Engineer",
        company: "Innovate Systems",
        location: "San Francisco, CA",
      },
    ],
  },
  "electrical-engineer": {
    id: "electrical-engineer",
    title: "Electrical Engineer",
    company: "Power Grid Corp",
    location: "New York, NY",
    type: "Full-time",
    level: "Mid Level",
    salary: "$95,000 - $120,000",
    description:
      "We are seeking a skilled electrical engineer to design and oversee the installation of electrical equipment. A great opportunity to work on large-scale infrastructure projects and contribute to the modernization of our power grid systems.",
    requirements: [
      "Bachelor's degree in Electrical Engineering",
      "3+ years of experience in electrical design",
      "Professional Engineer (PE) license preferred",
      "Experience with AutoCAD and electrical design software",
      "Knowledge of electrical codes and standards",
      "Strong analytical and project management skills",
    ],
    responsibilities: [
      "Design electrical systems for power distribution",
      "Review and approve electrical drawings and specifications",
      "Oversee installation and commissioning of electrical equipment",
      "Conduct field inspections and troubleshooting",
      "Ensure compliance with safety regulations and codes",
      "Collaborate with contractors and project teams",
    ],
    benefits: [
      "Comprehensive health and wellness benefits",
      "Retirement savings plan with company match",
      "Professional development and training opportunities",
      "Flexible work arrangements",
      "Employee stock purchase plan",
      "Tuition reimbursement program",
    ],
    skills: [
      "Electrical Design",
      "AutoCAD",
      "Power Systems",
      "Project Management",
      "Safety Compliance",
      "Field Testing",
    ],
    applicationDeadline: "2024-08-25",
    postedDate: "2024-07-05",
    companyInfo: {
      name: "Power Grid Corp",
      description:
        "A leading utility company responsible for maintaining and modernizing electrical infrastructure across the region.",
      size: "1000+ employees",
      industry: "Utilities & Energy",
      website: "https://powergridcorp.com",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDux4P3_-rmP1G3tsHb2kbzpg44VRBZBwqlwfYovZXac4CLOml05b499gZ-DFWAB-I83A4du3_amUY_rSCVuL4VN13NFv7HzXizS13xko8zW2M0Bt46Pd1JpmNVGSN0Om7DE0UWXqqCiH3IvQZLwe04e2HOrYezmq-ZyD7z_EC0MiWlkLgyFgsx4C4-wEcIQhlsZsZyynIuFrn2EEwemNRMy1H0axAPet97__J6J6oHiKjQpWQjq-zXqE5WfKDc7CGnlMP5_D5dniI",
      founded: "1985",
    },
    relatedJobs: [
      {
        id: "power-systems-engineer",
        title: "Power Systems Engineer",
        company: "Power Grid Corp",
        location: "New York, NY",
      },
      {
        id: "project-engineer",
        title: "Project Engineer",
        company: "Power Grid Corp",
        location: "Boston, MA",
      },
      {
        id: "field-engineer",
        title: "Field Engineer",
        company: "Power Grid Corp",
        location: "Philadelphia, PA",
      },
    ],
  },
  "civil-engineer-intern": {
    id: "civil-engineer-intern",
    title: "Civil Engineer Intern",
    company: "BuildWell Construction",
    location: "Los Angeles, CA",
    type: "Internship",
    level: "Entry Level",
    salary: "$20-25/hour",
    description:
      "Assist project managers with planning and execution of construction projects. This internship provides invaluable experience in the civil engineering field, working on infrastructure projects including roads, bridges, and commercial buildings.",
    requirements: [
      "Currently pursuing Bachelor's degree in Civil Engineering",
      "Knowledge of AutoCAD and civil engineering software",
      "Strong mathematical and analytical skills",
      "Understanding of construction materials and methods",
      "Ability to work in both office and field environments",
      "Valid driver's license",
    ],
    responsibilities: [
      "Assist in project planning and design phases",
      "Prepare technical drawings and documentation",
      "Conduct site visits and field inspections",
      "Support project managers in daily operations",
      "Assist with quality control and testing procedures",
      "Maintain project records and documentation",
    ],
    benefits: [
      "Competitive hourly compensation",
      "Hands-on construction experience",
      "Mentorship from senior engineers",
      "Networking opportunities in the industry",
      "Potential for permanent placement",
      "Professional development workshops",
    ],
    skills: [
      "AutoCAD",
      "Civil 3D",
      "Project Management",
      "Construction Materials",
      "Site Inspection",
      "Technical Drawing",
    ],
    applicationDeadline: "2024-08-30",
    postedDate: "2024-07-12",
    companyInfo: {
      name: "BuildWell Construction",
      description:
        "A premier construction company specializing in commercial and infrastructure projects throughout California.",
      size: "200-500 employees",
      industry: "Construction & Engineering",
      website: "https://buildwellconstruction.com",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVRSGwOZxSZBU-lgbk1M4YGdR-mMhb6aVpW8VN_HhB8n9geDwBKPOl4TWSgkvAY352thjCQveODsddEBrbssBMuFxTO_eoXgSswWccg4NH2Dzas2eIC5oqK9ohN9GgkigAu-CTC6i-UjqbQVq-shrT-sNn98iMWM-cEevzxEUQ2RHS_bT4gHjs5SpHhk1w7HgbHfMAXD8s2DaWRbVqTiNeMRAomX1rlg9xOJuu3Pr4z6c7iPbKn4Yz3ZMa8yALrbTulU8CB8i7KyQ",
      founded: "2010",
    },
    relatedJobs: [
      {
        id: "structural-engineer",
        title: "Structural Engineer",
        company: "BuildWell Construction",
        location: "Los Angeles, CA",
      },
      {
        id: "construction-manager",
        title: "Construction Manager",
        company: "BuildWell Construction",
        location: "San Diego, CA",
      },
      {
        id: "project-coordinator",
        title: "Project Coordinator",
        company: "BuildWell Construction",
        location: "Los Angeles, CA",
      },
    ],
  },
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [jobData, setJobData] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockJobData[jobId];
      setJobData(data || null);
      setLoading(false);
    }, 1000);
  }, [jobId]);

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: jobData?.title,
        text: `Check out this job: ${jobData?.title} at ${jobData?.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, save to user's bookmarks
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <button
            onClick={() => router.back()}
            className="text-sky-400 hover:underline"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const ApplicationModal = () =>
    showApplicationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-lg p-6 w-full max-w-md"
        >
          <h3 className="text-xl font-bold mb-4">Apply for {jobData.title}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                alert("Application submitted successfully!");
                setShowApplicationModal(false);
              }}
              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Submit Application
            </button>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={jobData.companyInfo.logo}
                    alt={`${jobData.company} logo`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">
                        {jobData.title}
                      </h1>
                      <p className="text-lg text-slate-400 mb-3">
                        {jobData.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {jobData.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {jobData.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {jobData.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleShare}
                        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
                        title="Share job"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleBookmark}
                        className={`p-2 rounded-lg ${isBookmarked ? "text-sky-400 bg-sky-900/30" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"}`}
                        title="Bookmark job"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        jobData.type === "Internship"
                          ? "bg-sky-900/40 text-sky-300"
                          : jobData.type === "Full-time"
                            ? "bg-emerald-900/40 text-emerald-300"
                            : "bg-purple-900/40 text-purple-300"
                      }`}
                    >
                      {jobData.type}
                    </span>
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                      {jobData.level}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <p className="text-slate-300 leading-relaxed">
                {jobData.description}
              </p>
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {jobData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {jobData.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold mb-4">Benefits & Perks</h2>
              <ul className="space-y-2">
                {jobData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800 sticky top-8"
            >
              <button
                onClick={handleApply}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4"
              >
                Apply for this Job
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Posted:</span>
                  <span>
                    {new Date(jobData.postedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deadline:</span>
                  <span>
                    {new Date(jobData.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Job Type:</span>
                  <span>{jobData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span>{jobData.level}</span>
                </div>
              </div>
            </motion.div>

            {/* Company info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h3 className="text-lg font-bold mb-4">
                About {jobData.companyInfo.name}
              </h3>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  {jobData.companyInfo.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Industry:</span>
                    <span>{jobData.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Company Size:</span>
                    <span>{jobData.companyInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Founded:</span>
                    <span>{jobData.companyInfo.founded}</span>
                  </div>
                </div>
                <a
                  href={jobData.companyInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm"
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Related jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800"
            >
              <h3 className="text-lg font-bold mb-4">Related Jobs</h3>
              <div className="space-y-3">
                {jobData.relatedJobs.map((relatedJob, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/jobs/${relatedJob.id}`)}
                    className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">
                      {relatedJob.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {relatedJob.company}
                    </p>
                    <p className="text-xs text-slate-500">
                      {relatedJob.location}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ApplicationModal />
    </div>
  );
}
