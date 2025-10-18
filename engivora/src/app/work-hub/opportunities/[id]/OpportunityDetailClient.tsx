"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Heart,
  Share,
  Check,
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type:
    | "internship"
    | "research"
    | "volunteer"
    | "competition"
    | "hackathon"
    | "job";
  organization: string;
  location: string;
  duration: string;
  startDate: string;
  endDate?: string;
  deadline: string;
  compensation?: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationProcess: string[];
  contactEmail: string;
  contactPerson: string;
  likes: number;
  views: number;
  applicants: number;
  maxApplicants?: number;
  featured: boolean;
  status: "open" | "closed" | "upcoming";
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

interface OpportunityDetailClientProps {
  opportunityId: string;
}

export default function OpportunityDetailClient({
  opportunityId,
}: OpportunityDetailClientProps) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null as File | null,
    coverLetter: "",
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  // Mock opportunity data - in real app, fetch from API
  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);

      // Simulate API call
      const mockOpportunities: Record<string, Opportunity> = {
        "1": {
          id: "1",
          title: "Internship: Robotics and Automation",
          description:
            "Gain hands-on experience in robotics and automation by working on real-world projects with industry experts. This internship program offers comprehensive exposure to cutting-edge robotics technologies, automation systems, and collaborative robotics applications. You'll work alongside experienced engineers on projects involving industrial automation, robotic process optimization, and human-robot interaction systems.",
          type: "internship",
          organization: "TechBot Industries",
          location: "San Francisco, CA",
          duration: "3 months",
          startDate: "2024-06-01",
          endDate: "2024-08-30",
          deadline: "2024-04-15",
          compensation: "$2,500/month + benefits",
          requirements: [
            "Currently enrolled in Engineering, Computer Science, or related field",
            "Basic understanding of robotics and automation concepts",
            "Programming experience in Python or C++",
            "Strong problem-solving and analytical skills",
            "Excellent communication and teamwork abilities",
            "GPA of 3.0 or higher",
          ],
          responsibilities: [
            "Assist in designing and testing robotic systems",
            "Collaborate on automation projects for manufacturing processes",
            "Participate in research and development activities",
            "Document project progress and technical findings",
            "Present work to team members and stakeholders",
            "Support maintenance and troubleshooting of existing systems",
          ],
          benefits: [
            "Mentorship from senior engineers and robotics experts",
            "Access to state-of-the-art robotics lab and equipment",
            "Professional development workshops and training sessions",
            "Networking opportunities with industry professionals",
            "Potential for full-time offer upon successful completion",
            "Certificate of completion and recommendation letter",
          ],
          skills: [
            "Python",
            "C++",
            "ROS",
            "CAD",
            "Control Systems",
            "Machine Learning",
          ],
          applicationProcess: [
            "Submit online application with resume and cover letter",
            "Complete technical assessment (programming and robotics fundamentals)",
            "Participate in virtual interview with hiring team",
            "Final interview with department head and team members",
            "Reference check and background verification",
          ],
          contactEmail: "internships@techbot.com",
          contactPerson: "Dr. Jennifer Martinez, Internship Coordinator",
          likes: 156,
          views: 892,
          applicants: 45,
          maxApplicants: 8,
          featured: true,
          status: "open",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T15:30:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDXJTVYo-zRR3-Bs3RdhOPwaDIkDjnUejgkfksENmmJnANZn18Tst0et15DWm39341f4S-Af3w3JOjmG6OLXZRlVUZYamxD6E6yu8-_oMS1Xyl_LAmOUnRr23-H8Uf1s_R1r5CGuOVJRB2Mgu8BQxqpqZ02qEiGcATJTUOdpIYXZTTdMe2m1rjKq_17L_2yNNenI0MRozjNNRos1PrQhPL4Lj3P7ysg7W6aC4u4uctYVThXJ4vt_75xck3FgwynVIjnH3KoMlFm7xY",
        },
        "2": {
          id: "2",
          title: "Research Assistant: AI in Engineering",
          description:
            "Assist in research projects focused on applying artificial intelligence techniques to solve engineering challenges. This position offers the opportunity to work on cutting-edge research at the intersection of AI and engineering, contributing to publications and conferences while gaining valuable research experience. You'll collaborate with PhD students and faculty on projects involving machine learning applications in structural engineering, materials science, and sustainable design.",
          type: "research",
          organization: "University Engineering Research Lab",
          location: "Boston, MA",
          duration: "1 year (renewable)",
          startDate: "2024-09-01",
          deadline: "2024-05-01",
          compensation: "$1,800/month",
          requirements: [
            "Bachelor's degree in Engineering, Computer Science, or Mathematics",
            "Strong background in machine learning and AI concepts",
            "Experience with Python, TensorFlow, or PyTorch",
            "Excellent written and verbal communication skills",
            "Previous research experience preferred",
            "Interest in interdisciplinary research",
          ],
          responsibilities: [
            "Conduct literature reviews on AI applications in engineering",
            "Develop and implement machine learning models",
            "Collect, process, and analyze research data",
            "Assist in writing research papers and grant proposals",
            "Present findings at research meetings and conferences",
            "Mentor undergraduate students on related projects",
          ],
          benefits: [
            "Opportunity to contribute to high-impact research publications",
            "Access to advanced computing resources and AI frameworks",
            "Collaboration with leading researchers in the field",
            "Professional development in research methodologies",
            "Potential pathway to PhD program",
            "Conference travel funding for paper presentations",
          ],
          skills: [
            "Python",
            "Machine Learning",
            "TensorFlow",
            "Data Analysis",
            "Research Methods",
          ],
          applicationProcess: [
            "Submit application with CV, transcript, and research statement",
            "Provide two academic references",
            "Complete technical interview with research team",
            "Present previous research work or relevant projects",
            "Final meeting with principal investigator",
          ],
          contactEmail: "research@university.edu",
          contactPerson: "Prof. David Chen, Principal Investigator",
          likes: 89,
          views: 445,
          applicants: 23,
          maxApplicants: 3,
          featured: true,
          status: "open",
          createdAt: "2024-01-10T14:00:00Z",
          updatedAt: "2024-01-22T09:15:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDGDS8qv5m9nCzESb39k3qt8KBVm3csZRtSbk_xms8nvDHqVtBvGmv5xTu3BvLMkmG6iMEWmHZuLyYx2FBBBSfKSHPsQpkuysJYoMLgcPpaFPIINyXi_bR6V4fI0CJazCyDl0k0x_xfq8ZbnHChPZUZ_9nVQr5At8Ib2w8LQu-4va-8lQiRvZc6WEpKy0nVynIprYXWvJwJoc8JQZNE52yr30e3DaRh_amM3osbYbJIv1CcBRaHarXILDp_nADlYIzUPizuLcuVL8I",
        },
        "3": {
          id: "3",
          title: "Engineering Outreach Program",
          description:
            "Inspire the next generation of engineers by volunteering in outreach programs and workshops for students. Join our mission to promote STEM education and engineering careers among K-12 students through hands-on activities, school visits, and community events. This volunteer opportunity allows you to give back to the community while developing leadership and communication skills.",
          type: "volunteer",
          organization: "Engineers Without Borders - Local Chapter",
          location: "Various schools in Metro Area",
          duration: "Ongoing (4 hours/month minimum)",
          startDate: "2024-02-01",
          deadline: "Open enrollment",
          requirements: [
            "Bachelor's degree in Engineering or related field",
            "Passion for education and working with young people",
            "Excellent communication and presentation skills",
            "Patience and enthusiasm for teaching",
            "Background check clearance for working with minors",
            "Weekend availability preferred",
          ],
          responsibilities: [
            "Conduct engaging engineering workshops for students",
            "Assist with STEM fair judging and mentoring",
            "Develop educational materials and activities",
            "Represent engineering profession at career fairs",
            "Support after-school and summer STEM programs",
            "Collaborate with teachers and school administrators",
          ],
          benefits: [
            "Make meaningful impact on students' lives and career choices",
            "Develop teaching and presentation skills",
            "Networking with other engineering professionals",
            "Community service hours for professional development",
            "Training workshops on effective STEM education",
            "Recognition awards and volunteer appreciation events",
          ],
          skills: [
            "Public Speaking",
            "Teaching",
            "STEM Education",
            "Workshop Development",
          ],
          applicationProcess: [
            "Complete volunteer application and background check",
            "Attend volunteer orientation and training session",
            "Shadow experienced volunteers on initial visits",
            "Commit to minimum volunteer hour requirements",
          ],
          contactEmail: "volunteer@ewb-local.org",
          contactPerson: "Sarah Johnson, Outreach Coordinator",
          likes: 67,
          views: 334,
          applicants: 12,
          featured: false,
          status: "open",
          createdAt: "2024-01-05T11:00:00Z",
          updatedAt: "2024-01-18T16:20:00Z",
        },
        "4": {
          id: "4",
          title: "Annual Design Challenge",
          description:
            "Showcase your skills and compete with peers in our annual engineering design competition. This year's challenge focuses on sustainable transportation solutions for urban environments. Teams will have 6 weeks to develop innovative concepts addressing mobility, environmental impact, and urban planning considerations. Winners receive cash prizes, mentorship opportunities, and potential startup funding.",
          type: "competition",
          organization: "National Engineering Society",
          location: "Hybrid (Online + Finals in Chicago)",
          duration: "6 weeks + Finals weekend",
          startDate: "2024-03-15",
          endDate: "2024-05-15",
          deadline: "2024-03-01",
          compensation: "$50,000 total prize pool",
          requirements: [
            "Teams of 3-5 members (students or recent graduates)",
            "At least one team member in engineering or design field",
            "Access to design software and prototyping resources",
            "Commitment to full competition timeline",
            "Willingness to present solution at finals",
          ],
          responsibilities: [
            "Research and analyze urban transportation challenges",
            "Develop innovative and feasible design solutions",
            "Create detailed technical documentation",
            "Build functional prototype or detailed simulation",
            "Prepare and deliver final presentation to judges",
            "Collaborate effectively within team structure",
          ],
          benefits: [
            "Cash prizes: $25K first place, $15K second, $10K third",
            "Mentorship from industry leaders and investors",
            "Networking opportunities with engineering professionals",
            "Portfolio-worthy project for career advancement",
            "Potential startup incubation and funding opportunities",
            "Recognition in engineering publications and conferences",
          ],
          skills: [
            "Design Thinking",
            "Prototyping",
            "Team Collaboration",
            "Presentation",
          ],
          applicationProcess: [
            "Register team and submit initial concept proposal",
            "Pass preliminary screening round",
            "Participate in virtual mentor matching session",
            "Submit milestone deliverables throughout competition",
            "Qualify for finals through judging rounds",
          ],
          contactEmail: "competition@nes.org",
          contactPerson: "Mark Thompson, Competition Director",
          likes: 203,
          views: 1156,
          applicants: 78,
          maxApplicants: 50,
          featured: true,
          status: "open",
          createdAt: "2024-01-20T09:00:00Z",
          updatedAt: "2024-01-25T14:45:00Z",
        },
        "5": {
          id: "5",
          title: "Innovate for Good Hackathon",
          description:
            "Collaborate with a team to build innovative solutions for social and environmental problems. This 48-hour hackathon brings together engineers, designers, and social innovators to tackle pressing global challenges. Focus areas include climate change, social equity, healthcare accessibility, and sustainable development. All skill levels welcome with mentorship and resources provided throughout the event.",
          type: "hackathon",
          organization: "Global Innovation Foundation",
          location: "Seattle, WA + Virtual participation",
          duration: "48 hours",
          startDate: "2024-04-12",
          endDate: "2024-04-14",
          deadline: "2024-04-01",
          requirements: [
            "No specific qualifications required - all backgrounds welcome",
            "Enthusiasm for social impact and innovation",
            "Ability to work intensively in team environment",
            "Laptop and necessary development tools",
            "Commitment to full event participation",
          ],
          responsibilities: [
            "Form or join a diverse, multidisciplinary team",
            "Identify and define social/environmental problem to solve",
            "Develop functional prototype or proof of concept",
            "Create presentation showcasing solution impact",
            "Pitch final solution to panel of expert judges",
            "Network with other participants and mentors",
          ],
          benefits: [
            "Win prizes up to $10,000 for winning solutions",
            "Access to expert mentors from tech and social sectors",
            "Free meals, snacks, and networking events",
            "Potential follow-up funding and incubation opportunities",
            "Certificate of participation and networking connections",
            "Media coverage and recognition for winning teams",
          ],
          skills: ["Programming", "Design", "Problem Solving", "Teamwork"],
          applicationProcess: [
            "Register online with brief background information",
            "Indicate areas of interest and expertise",
            "Attend pre-event networking and team formation",
            "Participate in opening ceremonies and challenge presentation",
          ],
          contactEmail: "hackathon@globalinnovation.org",
          contactPerson: "Lisa Park, Event Coordinator",
          likes: 145,
          views: 728,
          applicants: 156,
          maxApplicants: 200,
          featured: true,
          status: "open",
          createdAt: "2024-01-12T13:30:00Z",
          updatedAt: "2024-01-24T10:15:00Z",
        },
      };

      setTimeout(() => {
        const foundOpportunity = mockOpportunities[opportunityId];
        if (foundOpportunity) {
          setOpportunity(foundOpportunity);
        }
        setLoading(false);
      }, 1000);
    };

    fetchOpportunity();
  }, [opportunityId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In real app, make API call to update likes
  };

  const handleApplicationSubmit = async () => {
    if (
      !applicationData.name ||
      !applicationData.email ||
      !applicationData.coverLetter
    ) {
      return;
    }

    setSubmittingApplication(true);

    // Simulate API call
    setTimeout(() => {
      setSubmittingApplication(false);
      setShowApplicationForm(false);
      setApplicationData({
        name: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: "",
      });
      // Show success message
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship":
        return "bg-sky-900/40 text-sky-300";
      case "research":
        return "bg-purple-900/40 text-purple-300";
      case "volunteer":
        return "bg-green-900/40 text-green-300";
      case "competition":
        return "bg-orange-900/40 text-orange-300";
      case "hackathon":
        return "bg-pink-900/40 text-pink-300";
      case "job":
        return "bg-blue-900/40 text-blue-300";
      default:
        return "bg-gray-900/40 text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-900/40 text-green-300";
      case "closed":
        return "bg-red-900/40 text-red-300";
      case "upcoming":
        return "bg-yellow-900/40 text-yellow-300";
      default:
        return "bg-gray-900/40 text-gray-300";
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded mb-8"></div>
            <div className="h-96 bg-slate-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
        <div className="w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunity Not Found</h1>
          <p className="text-slate-400 mb-8">
            The opportunity you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
          <Link
            href="/work-hub"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
          >
            Back to Work Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/work-hub"
            className="inline-flex items-center text-sky-400 hover:text-sky-300 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Work Hub
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Opportunity Image */}
            {opportunity.imageUrl && (
              <div className="lg:w-1/3">
                <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                  <Image
                    src={opportunity.imageUrl}
                    alt={opportunity.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Opportunity Info */}
            <div className="lg:w-2/3">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-block ${getTypeColor(opportunity.type)} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {opportunity.type}
                </span>
                <span
                  className={`inline-block ${getStatusColor(opportunity.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {opportunity.status}
                </span>
                {opportunity.featured && (
                  <span className="inline-block bg-yellow-900/40 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {opportunity.title}
              </h1>

              <div className="flex items-center gap-6 text-slate-400 mb-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "text-red-500 fill-current" : ""}`}
                  />
                  <span>{opportunity.likes + (isLiked ? 1 : 0)} likes</span>
                </button>
                <div className="flex items-center gap-2">
                  <span>{opportunity.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{opportunity.applicants} applicants</span>
                </div>
                <button className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              <p className="text-lg text-slate-300 mb-6">
                {opportunity.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Location</span>
                  </div>
                  <div className="text-sm font-medium">
                    {opportunity.location}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Duration</span>
                  </div>
                  <div className="text-sm font-medium">
                    {opportunity.duration}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Deadline</span>
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                </div>

                {opportunity.compensation && (
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-sky-400" />
                      <span className="text-sm text-slate-400">
                        Compensation
                      </span>
                    </div>
                    <div className="text-sm font-medium">
                      {opportunity.compensation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {opportunity.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                Benefits & Opportunities
              </h2>
              <ul className="space-y-3">
                {opportunity.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Application Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Application Process</h2>
              <ol className="space-y-3">
                {opportunity.applicationProcess.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Apply */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">
                Apply for This Opportunity
              </h3>
              {opportunity.status === "open" &&
              (!opportunity.maxApplicants ||
                opportunity.applicants < opportunity.maxApplicants) ? (
                <div>
                  <p className="text-slate-400 text-sm mb-4">
                    Application deadline:{" "}
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                  {!showApplicationForm ? (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={applicationData.name}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={applicationData.email}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={applicationData.phone}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cover-letter"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Cover Letter / Why are you interested? *
                        </label>
                        <textarea
                          id="cover-letter"
                          rows={4}
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Tell us about your interest and relevant experience..."
                          value={applicationData.coverLetter}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              coverLetter: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleApplicationSubmit}
                          disabled={
                            submittingApplication ||
                            !applicationData.name ||
                            !applicationData.email ||
                            !applicationData.coverLetter
                          }
                          className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          {submittingApplication
                            ? "Submitting..."
                            : "Submit Application"}
                        </button>
                        <button
                          onClick={() => {
                            setShowApplicationForm(false);
                            setApplicationData({
                              name: "",
                              email: "",
                              phone: "",
                              resume: null,
                              coverLetter: "",
                            });
                          }}
                          className="px-4 py-2 text-slate-400 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : opportunity.status === "closed" ? (
                <div className="text-center">
                  <p className="text-slate-400 mb-4">
                    This opportunity is no longer accepting applications.
                  </p>
                  <button className="w-full bg-slate-700 text-slate-400 font-medium py-3 px-4 rounded-md cursor-not-allowed">
                    Applications Closed
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-400 mb-4">
                    Maximum number of applications reached.
                  </p>
                  <button className="w-full bg-slate-700 text-slate-400 font-medium py-3 px-4 rounded-md cursor-not-allowed">
                    Applications Full
                  </button>
                </div>
              )}
            </motion.div>

            {/* Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Organization</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">{opportunity.organization}</div>
                  <div className="text-sm text-slate-400">
                    {opportunity.location}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Contact Person</div>
                  <div className="font-medium">{opportunity.contactPerson}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <div className="font-medium">{opportunity.contactEmail}</div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Relevant Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-sky-900/40 text-sky-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">
                    Application Deadline
                  </span>
                  <span className="font-medium">
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Start Date</span>
                  <span className="font-medium">
                    {new Date(opportunity.startDate).toLocaleDateString()}
                  </span>
                </div>
                {opportunity.endDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">End Date</span>
                    <span className="font-medium">
                      {new Date(opportunity.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
