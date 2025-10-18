"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, MapPin, Calendar, Users, Clock } from "lucide-react";

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
  deadline: string;
  compensation?: string;
  likes: number;
  views: number;
  applicants: number;
  maxApplicants?: number;
  featured: boolean;
  status: "open" | "closed" | "upcoming";
  createdAt: string;
  imageUrl?: string;
}

export default function OpportunitiesClient() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock opportunities data
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);

      // Simulate API call
      const mockOpportunities: Opportunity[] = [
        {
          id: "1",
          title: "Internship: Robotics and Automation",
          description:
            "Gain hands-on experience in robotics and automation by working on real-world projects with industry experts. This internship program offers comprehensive exposure to cutting-edge robotics technologies.",
          type: "internship",
          organization: "TechBot Industries",
          location: "San Francisco, CA",
          duration: "3 months",
          deadline: "2024-04-15",
          compensation: "$2,500/month + benefits",
          likes: 156,
          views: 892,
          applicants: 45,
          maxApplicants: 8,
          featured: true,
          status: "open",
          createdAt: "2024-01-15T10:00:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDXJTVYo-zRR3-Bs3RdhOPwaDIkDjnUejgkfksENmmJnANZn18Tst0et15DWm39341f4S-Af3w3JOjmG6OLXZRlVUZYamxD6E6yu8-_oMS1Xyl_LAmOUnRr23-H8Uf1s_R1r5CGuOVJRB2Mgu8BQxqpqZ02qEiGcATJTUOdpIYXZTTdMe2m1rjKq_17L_2yNNenI0MRozjNNRos1PrQhPL4Lj3P7ysg7W6aC4u4uctYVThXJ4vt_75xck3FgwynVIjnH3KoMlFm7xY",
        },
        {
          id: "2",
          title: "Research Assistant: AI in Engineering",
          description:
            "Assist in research projects focused on applying artificial intelligence techniques to solve engineering challenges. Work on cutting-edge research at the intersection of AI and engineering.",
          type: "research",
          organization: "University Engineering Research Lab",
          location: "Boston, MA",
          duration: "1 year (renewable)",
          deadline: "2024-05-01",
          compensation: "$1,800/month",
          likes: 89,
          views: 445,
          applicants: 23,
          maxApplicants: 3,
          featured: true,
          status: "open",
          createdAt: "2024-01-10T14:00:00Z",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDGDS8qv5m9nCzESb39k3qt8KBVm3csZRtSbk_xms8nvDHqVtBvGmv5xTu3BvLMkmG6iMEWmHZuLyYx2FBBBSfKSHPsQpkuysJYoMLgcPpaFPIINyXi_bR6V4fI0CJazCyDl0k0x_xfq8ZbnHChPZUZ_9nVQr5At8Ib2w8LQu-4va-8lQiRvZc6WEpKy0nVynIprYXWvJwJoc8JQZNE52yr30e3DaRh_amM3osbYbJIv1CcBRaHarXILDp_nADlYIzUPizuLcuVL8I",
        },
        {
          id: "3",
          title: "Engineering Outreach Program",
          description:
            "Inspire the next generation of engineers by volunteering in outreach programs and workshops for students. Join our mission to promote STEM education and engineering careers among K-12 students.",
          type: "volunteer",
          organization: "Engineers Without Borders - Local Chapter",
          location: "Various schools in Metro Area",
          duration: "Ongoing (4 hours/month minimum)",
          deadline: "Open enrollment",
          likes: 67,
          views: 334,
          applicants: 12,
          featured: false,
          status: "open",
          createdAt: "2024-01-05T11:00:00Z",
        },
        {
          id: "4",
          title: "Annual Design Challenge",
          description:
            "Showcase your skills and compete with peers in our annual engineering design competition. This year's challenge focuses on sustainable transportation solutions for urban environments.",
          type: "competition",
          organization: "National Engineering Society",
          location: "Hybrid (Online + Finals in Chicago)",
          duration: "6 weeks + Finals weekend",
          deadline: "2024-03-01",
          compensation: "$50,000 total prize pool",
          likes: 203,
          views: 1156,
          applicants: 78,
          maxApplicants: 50,
          featured: true,
          status: "open",
          createdAt: "2024-01-20T09:00:00Z",
        },
        {
          id: "5",
          title: "Innovate for Good Hackathon",
          description:
            "Collaborate with a team to build innovative solutions for social and environmental problems. This 48-hour hackathon brings together engineers, designers, and social innovators.",
          type: "hackathon",
          organization: "Global Innovation Foundation",
          location: "Seattle, WA + Virtual participation",
          duration: "48 hours",
          deadline: "2024-04-01",
          likes: 145,
          views: 728,
          applicants: 156,
          maxApplicants: 200,
          featured: true,
          status: "open",
          createdAt: "2024-01-12T13:30:00Z",
        },
        {
          id: "6",
          title: "Software Engineering Intern - Clean Energy",
          description:
            "Join our team developing next-generation clean energy management software. Work on scalable applications that help optimize renewable energy distribution and storage systems.",
          type: "internship",
          organization: "GreenTech Solutions",
          location: "Austin, TX",
          duration: "4 months",
          deadline: "2024-03-20",
          compensation: "$3,200/month + benefits",
          likes: 98,
          views: 567,
          applicants: 34,
          maxApplicants: 6,
          featured: false,
          status: "open",
          createdAt: "2024-01-18T08:30:00Z",
        },
        {
          id: "7",
          title: "Biomedical Research Assistant",
          description:
            "Support groundbreaking research in biomedical engineering focusing on medical device development and tissue engineering. Opportunity to contribute to publications and patents.",
          type: "research",
          organization: "Medical University Research Center",
          location: "Philadelphia, PA",
          duration: "6 months - 1 year",
          deadline: "2024-04-30",
          compensation: "$2,000/month",
          likes: 76,
          views: 389,
          applicants: 19,
          maxApplicants: 4,
          featured: false,
          status: "open",
          createdAt: "2024-01-22T11:15:00Z",
        },
        {
          id: "8",
          title: "International Bridge Building Competition",
          description:
            "Design and build a model bridge that can support maximum load while meeting strict weight and material constraints. Compete against teams from around the world.",
          type: "competition",
          organization: "World Engineering Society",
          location: "Montreal, Canada",
          duration: "3 months preparation + 2 days competition",
          deadline: "2024-02-28",
          compensation: "$25,000 prize pool",
          likes: 234,
          views: 1345,
          applicants: 67,
          maxApplicants: 40,
          featured: true,
          status: "upcoming",
          createdAt: "2024-01-08T14:20:00Z",
        },
      ];

      setTimeout(() => {
        setOpportunities(mockOpportunities);
        setLoading(false);
      }, 1000);
    };

    fetchOpportunities();
  }, []);

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

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.organization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" || opportunity.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || opportunity.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const featuredOpportunities = filteredOpportunities.filter(
    (opp) => opp.featured,
  );
  const regularOpportunities = filteredOpportunities.filter(
    (opp) => !opp.featured,
  );

  if (loading) {
    return (
      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
        <div className="w-full max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-800 rounded w-1/2 mx-auto"></div>
            <div className="h-16 bg-slate-800 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">
            Engineering Opportunities
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-400">
            Discover internships, research positions, volunteer opportunities,
            competitions, and hackathons to advance your engineering career and
            make an impact.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 rounded-lg p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Types</option>
                    <option value="internship">Internships</option>
                    <option value="research">Research</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="competition">Competitions</option>
                    <option value="hackathon">Hackathons</option>
                    <option value="job">Jobs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing {filteredOpportunities.length} opportunities
          </p>
        </div>

        {/* Featured Opportunities */}
        {featuredOpportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Featured Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/work-hub/opportunities/${opportunity.id}`}
                  className="group relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  {opportunity.imageUrl && (
                    <div className="h-48 relative">
                      <Image
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                          FEATURED
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
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
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors">
                      {opportunity.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium">
                          {opportunity.organization}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Apply by{" "}
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {opportunity.compensation && (
                      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-400">
                          Compensation
                        </div>
                        <div className="font-semibold text-green-400">
                          {opportunity.compensation}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>{opportunity.likes} likes</span>
                        <span>{opportunity.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{opportunity.applicants} applicants</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Opportunities */}
        {regularOpportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">All Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularOpportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/work-hub/opportunities/${opportunity.id}`}
                  className="group relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  {opportunity.imageUrl && (
                    <div className="h-48 relative">
                      <Image
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
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
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors">
                      {opportunity.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium">
                          {opportunity.organization}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Apply by{" "}
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {opportunity.compensation && (
                      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-400">
                          Compensation
                        </div>
                        <div className="font-semibold text-green-400">
                          {opportunity.compensation}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>{opportunity.likes} likes</span>
                        <span>{opportunity.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{opportunity.applicants} applicants</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {filteredOpportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-bold mb-4">No Opportunities Found</h3>
            <p className="text-slate-400 mb-8">
              Try adjusting your search criteria or filters to find more
              opportunities.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedStatus("all");
              }}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
