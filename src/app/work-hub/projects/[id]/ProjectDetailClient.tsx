"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Clock, Star, Eye, Heart, Share } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: {
    estimate: number;
    unit: "days" | "weeks" | "months";
  };
  teamSize: {
    min: number;
    max: number;
    current: number;
  };
  requirements: string[];
  goals: string[];
  resources: Array<{
    title: string;
    url: string;
    type: "documentation" | "tutorial" | "repository" | "tool" | "other";
  }>;
  tags: string[];
  status: "planning" | "in-progress" | "completed" | "on-hold";
  progress: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: "owner" | "lead" | "member";
    joinedAt: string;
  }>;
  applications: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    message: string;
    status: "pending" | "accepted" | "rejected";
    appliedAt: string;
  }>;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({
  projectId,
}: ProjectDetailClientProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submittingApplication, setSubmittingApplication] = useState(false);

  // Mock project data - in real app, fetch from API
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);

      // Simulate API call
      const mockProjects: Record<string, Project> = {
        "1": {
          id: "1",
          title: "Autonomous Drone Navigation System",
          description:
            "Develop a drone capable of navigating complex environments autonomously using advanced computer vision and machine learning algorithms. This project involves creating a comprehensive navigation system that can handle obstacle avoidance, path planning, and real-time decision making in dynamic environments.",
          category: "robotics",
          techStack: [
            "Python",
            "OpenCV",
            "TensorFlow",
            "ROS",
            "C++",
            "Arduino",
          ],
          difficulty: "advanced",
          duration: { estimate: 6, unit: "months" },
          teamSize: { min: 4, max: 8, current: 5 },
          requirements: [
            "Strong programming skills in Python and C++",
            "Experience with computer vision and OpenCV",
            "Knowledge of machine learning and neural networks",
            "Familiarity with robotics and ROS framework",
            "Understanding of flight dynamics and control systems",
          ],
          goals: [
            "Implement real-time obstacle detection and avoidance",
            "Develop autonomous path planning algorithms",
            "Create stable flight control system",
            "Build comprehensive testing and simulation environment",
            "Achieve reliable navigation in complex indoor/outdoor environments",
          ],
          resources: [
            {
              title: "ROS Documentation",
              url: "https://docs.ros.org/",
              type: "documentation",
            },
            {
              title: "OpenCV Tutorials",
              url: "https://opencv.org/courses/",
              type: "tutorial",
            },
            {
              title: "Drone Programming Repository",
              url: "https://github.com/dronekit/dronekit-python",
              type: "repository",
            },
          ],
          tags: ["robotics", "ai", "computer-vision", "autonomous", "drone"],
          status: "in-progress",
          progress: 45,
          owner: {
            id: "owner1",
            name: "Dr. Sarah Chen",
            email: "sarah.chen@university.edu",
          },
          members: [
            {
              id: "owner1",
              name: "Dr. Sarah Chen",
              email: "sarah.chen@university.edu",
              role: "owner",
              joinedAt: "2024-01-01T10:00:00Z",
            },
            {
              id: "member1",
              name: "Alex Rodriguez",
              email: "alex.r@student.edu",
              role: "lead",
              joinedAt: "2024-01-05T14:30:00Z",
            },
            {
              id: "member2",
              name: "Maria Johnson",
              email: "maria.j@student.edu",
              role: "member",
              joinedAt: "2024-01-10T09:15:00Z",
            },
            {
              id: "member3",
              name: "David Kim",
              email: "david.k@student.edu",
              role: "member",
              joinedAt: "2024-01-12T16:45:00Z",
            },
            {
              id: "member4",
              name: "Emma Wilson",
              email: "emma.w@student.edu",
              role: "member",
              joinedAt: "2024-01-15T11:20:00Z",
            },
          ],
          applications: [
            {
              id: "app1",
              userId: "user1",
              userName: "John Smith",
              userEmail: "john.smith@student.edu",
              message:
                "I have extensive experience with computer vision and would love to contribute to the obstacle detection module.",
              status: "pending",
              appliedAt: "2024-01-20T10:30:00Z",
            },
          ],
          likes: 127,
          views: 892,
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-20T15:45:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBimXFuIxr5Cd0DrrnkQ3myr_LU7p9SWluKnwVYWmfwQUnfSZw6ktPB_PhWKTkxqkapjwOTq8vwlgMlBe-vKO85NdhfoIRjNdt9d6MBJQWRfxj2YmM07viQE9Z2XMLV1AS3qaiPgG8hkifCa4q1DbQZE6iejrA1DkHsDvXvV26V8uptaGcrGLQJa5O4cj-yuiJEzd37GfLgAXQMNaSxRCImekiN3uT9Tz2cB6FvCYMpMlboxS7oeeW7VfS7prFFZaGZT1ATWsXQYUY",
        },
        "2": {
          id: "2",
          title: "Smart Agriculture Monitoring",
          description:
            "Monitor crop health and soil conditions to optimize agricultural practices using IoT sensors, satellite imagery, and machine learning analytics. This comprehensive system will help farmers make data-driven decisions to improve crop yield and reduce resource waste.",
          category: "iot",
          techStack: [
            "Python",
            "Arduino",
            "Raspberry Pi",
            "Node.js",
            "React",
            "MongoDB",
          ],
          difficulty: "intermediate",
          duration: { estimate: 4, unit: "months" },
          teamSize: { min: 3, max: 6, current: 4 },
          requirements: [
            "Experience with IoT devices and sensors",
            "Knowledge of data analytics and visualization",
            "Familiarity with web development",
            "Understanding of agricultural principles",
            "Basic machine learning knowledge",
          ],
          goals: [
            "Deploy sensor network for real-time monitoring",
            "Develop predictive analytics for crop health",
            "Create farmer-friendly dashboard interface",
            "Implement automated alert system",
            "Integrate weather and satellite data",
          ],
          resources: [
            {
              title: "Arduino IoT Guide",
              url: "https://www.arduino.cc/en/Guide/ArduinoIoTCloud",
              type: "tutorial",
            },
            {
              title: "Agricultural Data API",
              url: "https://github.com/agriculture-data/api",
              type: "repository",
            },
          ],
          tags: [
            "iot",
            "agriculture",
            "sensors",
            "data-analytics",
            "sustainability",
          ],
          status: "in-progress",
          progress: 60,
          owner: {
            id: "owner2",
            name: "Prof. Michael Green",
            email: "m.green@agri.university.edu",
          },
          members: [
            {
              id: "owner2",
              name: "Prof. Michael Green",
              email: "m.green@agri.university.edu",
              role: "owner",
              joinedAt: "2024-01-08T09:00:00Z",
            },
            {
              id: "member5",
              name: "Lisa Zhang",
              email: "lisa.z@student.edu",
              role: "lead",
              joinedAt: "2024-01-10T11:00:00Z",
            },
            {
              id: "member6",
              name: "Carlos Martinez",
              email: "carlos.m@student.edu",
              role: "member",
              joinedAt: "2024-01-12T14:00:00Z",
            },
            {
              id: "member7",
              name: "Priya Patel",
              email: "priya.p@student.edu",
              role: "member",
              joinedAt: "2024-01-15T16:30:00Z",
            },
          ],
          applications: [],
          likes: 89,
          views: 654,
          createdAt: "2024-01-08T09:00:00Z",
          updatedAt: "2024-01-18T12:20:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCH2B3R68rXfPTE6c3mR4-onZAQvDmjzJ9cuVsQeI1GPkIXpsEGCARGFLUW5MtxU8c-ZaqiEJtfrCaynVMuJNPexMlGPw8YCj0QIE9ehbDSK8aaPyhKailiVVkmHY_vPiwWA-NyeF4ng4844mwQEDKepP9-PjDt3OM0S_P8HXKW_eKSD6BgCB2ORLotzA53upSfJupwtpext23ByF91PJLJSStYmGcqICcU7a_PZJrsCoN0uD27ul73RzVbPnyQolP06ErQ6kWUgy8",
        },
        "3": {
          id: "3",
          title: "Renewable Energy Grid Integration",
          description:
            "Integrate solar and wind sources into existing power grids with smart load balancing and energy storage optimization. This project focuses on developing algorithms for efficient renewable energy distribution and grid stability.",
          category: "engineering",
          techStack: ["MATLAB", "Python", "Simulink", "Java", "SQL", "React"],
          difficulty: "advanced",
          duration: { estimate: 8, unit: "months" },
          teamSize: { min: 5, max: 10, current: 7 },
          requirements: [
            "Strong background in electrical engineering",
            "Experience with power systems and grid technology",
            "Knowledge of renewable energy systems",
            "Proficiency in MATLAB/Simulink",
            "Understanding of energy storage systems",
          ],
          goals: [
            "Develop grid integration algorithms",
            "Create energy storage optimization system",
            "Implement load balancing mechanisms",
            "Build real-time monitoring dashboard",
            "Test system with renewable energy sources",
          ],
          resources: [
            {
              title: "Power System Analysis",
              url: "https://www.mathworks.com/solutions/power-electronics-control.html",
              type: "documentation",
            },
            {
              title: "Renewable Energy Grid Tools",
              url: "https://github.com/renewable-grid/tools",
              type: "repository",
            },
          ],
          tags: [
            "renewable-energy",
            "grid",
            "power-systems",
            "sustainability",
            "matlab",
          ],
          status: "completed",
          progress: 100,
          owner: {
            id: "owner3",
            name: "Dr. James Wilson",
            email: "j.wilson@engineering.edu",
          },
          members: [
            {
              id: "owner3",
              name: "Dr. James Wilson",
              email: "j.wilson@engineering.edu",
              role: "owner",
              joinedAt: "2024-01-01T08:00:00Z",
            },
            {
              id: "member8",
              name: "Anna Kowalski",
              email: "anna.k@student.edu",
              role: "lead",
              joinedAt: "2024-01-03T10:00:00Z",
            },
            {
              id: "member9",
              name: "Robert Taylor",
              email: "robert.t@student.edu",
              role: "member",
              joinedAt: "2024-01-05T13:00:00Z",
            },
            {
              id: "member10",
              name: "Sophie Brown",
              email: "sophie.b@student.edu",
              role: "member",
              joinedAt: "2024-01-07T15:00:00Z",
            },
            {
              id: "member11",
              name: "Ahmed Hassan",
              email: "ahmed.h@student.edu",
              role: "member",
              joinedAt: "2024-01-10T09:30:00Z",
            },
            {
              id: "member12",
              name: "Elena Rodriguez",
              email: "elena.r@student.edu",
              role: "member",
              joinedAt: "2024-01-12T11:45:00Z",
            },
            {
              id: "member13",
              name: "Thomas Lee",
              email: "thomas.l@student.edu",
              role: "member",
              joinedAt: "2024-01-15T14:20:00Z",
            },
          ],
          applications: [],
          likes: 156,
          views: 1243,
          createdAt: "2024-01-01T08:00:00Z",
          updatedAt: "2024-01-20T17:00:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD1saGR20qhEquw9a-di530B4ww2pfZ3_Lax78WHda44TGzMN8ECkwRSy6N7wUdGFxzCQoP1IYeSJX_eFBuWaZNELE-xYkkPsBb0SLYPDEghaifQKkyRDtNpZq9XHeSnYqpULi8WrOvGp9oCwc0Oek2_Vb10oeKi__oZKj-0VSpcsA2Xs3MtHSV8gVcL5HNTDrgrV9wNBFgZP8sPOmt6rrTpAGkkhlYe4JebTsNrZyYfLiSjCkcfqpKBYq-dp-3mwyz5jzbsLWqrYU",
        },
        "4": {
          id: "4",
          title: "3D-Printed Prosthetics",
          description:
            "Design and create affordable, custom-fit prosthetic limbs using 3D printing technology and advanced biomechanical engineering. This humanitarian project aims to provide accessible prosthetic solutions for underserved communities worldwide.",
          category: "biomedical",
          techStack: [
            "CAD",
            "Python",
            "Arduino",
            "3D Printing",
            "Fusion 360",
            "C++",
          ],
          difficulty: "intermediate",
          duration: { estimate: 5, unit: "months" },
          teamSize: { min: 4, max: 7, current: 3 },
          requirements: [
            "Experience with 3D modeling and CAD software",
            "Knowledge of biomechanics and human anatomy",
            "3D printing experience preferred",
            "Interest in humanitarian engineering",
            "Basic programming skills for control systems",
          ],
          goals: [
            "Design modular prosthetic components",
            "Develop custom fitting algorithms",
            "Create cost-effective manufacturing process",
            "Test prototypes with user feedback",
            "Establish distribution network",
          ],
          resources: [
            {
              title: "Fusion 360 for Prosthetics",
              url: "https://www.autodesk.com/education/free-software/fusion-360",
              type: "tool",
            },
            {
              title: "Open Prosthetics Project",
              url: "https://github.com/OpenProsthetics/OPP",
              type: "repository",
            },
          ],
          tags: [
            "3d-printing",
            "prosthetics",
            "biomedical",
            "humanitarian",
            "cad",
          ],
          status: "planning",
          progress: 25,
          owner: {
            id: "owner4",
            name: "Dr. Maria Santos",
            email: "m.santos@biomedical.edu",
          },
          members: [
            {
              id: "owner4",
              name: "Dr. Maria Santos",
              email: "m.santos@biomedical.edu",
              role: "owner",
              joinedAt: "2024-01-10T09:00:00Z",
            },
            {
              id: "member14",
              name: "Kevin O'Connor",
              email: "kevin.o@student.edu",
              role: "member",
              joinedAt: "2024-01-15T12:00:00Z",
            },
            {
              id: "member15",
              name: "Fatima Al-Rashid",
              email: "fatima.a@student.edu",
              role: "member",
              joinedAt: "2024-01-18T14:30:00Z",
            },
          ],
          applications: [
            {
              id: "app2",
              userId: "user2",
              userName: "Ryan Thompson",
              userEmail: "ryan.t@student.edu",
              message:
                "I have experience with 3D printing and CAD design. I'm passionate about using technology to help people.",
              status: "pending",
              appliedAt: "2024-01-22T09:15:00Z",
            },
          ],
          likes: 93,
          views: 567,
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-22T09:15:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD9kDCwmqC5iGJhE7Q22ywVSGw73uC_VpW1tiCznE6wUyJ8K0g4LXJKYPRtXeOjfjCa4h19ObZpBd6xLCUixBKOZDhlMcFdVuXqjGUEMmS8Kvu0mGS063mefglQUs7ScSyyeTGQvMKMUo3x_tlinch3E1-0Gl7kNFAsIcWnGdM1NhcEef86jOyAEdCVRmpECPMvIhlp5zLUhSkHsJUQkuoGyW-q7UDneX0a5wPrbcK4rbj_iSfHk8h6otuNXfzEd14i6wGlTDqOD6o",
        },
      };

      setTimeout(() => {
        const foundProject = mockProjects[projectId];
        if (foundProject) {
          setProject(foundProject);
        }
        setLoading(false);
      }, 1000);
    };

    fetchProject();
  }, [projectId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In real app, make API call to update likes
  };

  const handleApply = async () => {
    if (!applicationMessage.trim()) return;

    setSubmittingApplication(true);

    // Simulate API call
    setTimeout(() => {
      setSubmittingApplication(false);
      setShowApplicationForm(false);
      setApplicationMessage("");
      // Show success message
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-900/40 text-green-300";
      case "intermediate":
        return "bg-yellow-900/40 text-yellow-300";
      case "advanced":
        return "bg-red-900/40 text-red-300";
      default:
        return "bg-gray-900/40 text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-900/40 text-blue-300";
      case "in-progress":
        return "bg-yellow-900/40 text-yellow-300";
      case "completed":
        return "bg-green-900/40 text-green-300";
      case "on-hold":
        return "bg-gray-900/40 text-gray-300";
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

  if (!project) {
    return (
      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
        <div className="w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-slate-400 mb-8">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
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
            {/* Project Image */}
            {project.imageUrl && (
              <div className="lg:w-1/3">
                <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="lg:w-2/3">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-block ${getDifficultyColor(project.difficulty)} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {project.difficulty}
                </span>
                <span
                  className={`inline-block ${getStatusColor(project.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {project.status.replace("-", " ")}
                </span>
                <span className="inline-block bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {project.category}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {project.title}
              </h1>

              <div className="flex items-center gap-6 text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span>{project.views} views</span>
                </div>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "text-red-500 fill-current" : ""}`}
                  />
                  <span>{project.likes + (isLiked ? 1 : 0)} likes</span>
                </button>
                <button className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              <p className="text-lg text-slate-300 mb-6">
                {project.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Duration</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {project.duration.estimate} {project.duration.unit}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Team</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {project.teamSize.current}/{project.teamSize.max}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-sky-400" />
                    <span className="text-sm text-slate-400">Progress</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {project.progress}%
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-400">Applications</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {project.applications.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-sky-900/40 text-sky-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Project Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Project Goals</h2>
              <ul className="space-y-2">
                {project.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{goal}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {project.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Resources</h2>
              <div className="space-y-3">
                {project.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {resource.type.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-slate-400 capitalize">
                        {resource.type}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Apply to Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Join This Project</h3>
              {project.teamSize.current < project.teamSize.max ? (
                <div>
                  <p className="text-slate-400 text-sm mb-4">
                    This team is looking for{" "}
                    {project.teamSize.max - project.teamSize.current} more
                    members.
                  </p>
                  {!showApplicationForm ? (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                      Apply to Join
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="application-message"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Why do you want to join this project?
                        </label>
                        <textarea
                          id="application-message"
                          rows={4}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Tell the team about your relevant experience and interest..."
                          value={applicationMessage}
                          onChange={(e) =>
                            setApplicationMessage(e.target.value)
                          }
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleApply}
                          disabled={
                            submittingApplication || !applicationMessage.trim()
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
                            setApplicationMessage("");
                          }}
                          className="px-4 py-2 text-slate-400 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-400 mb-4">
                    This team is currently full.
                  </p>
                  <button className="w-full bg-slate-700 text-slate-400 font-medium py-3 px-4 rounded-md cursor-not-allowed">
                    Team Full
                  </button>
                </div>
              )}
            </motion.div>

            {/* Project Owner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Project Leader</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                  {project.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{project.owner.name}</div>
                  <div className="text-sm text-slate-400">
                    {project.owner.email}
                  </div>
                </div>
              </div>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Contact Leader
              </button>
            </motion.div>

            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">
                Team Members ({project.members.length})
              </h3>
              <div className="space-y-3">
                {project.members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-slate-400 capitalize">
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
                {project.members.length > 5 && (
                  <div className="text-sm text-slate-400 text-center pt-2">
                    +{project.members.length - 5} more members
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-slate-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
