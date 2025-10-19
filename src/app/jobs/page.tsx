"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SmartImage } from "@/components/smart-image";
import { LocationService, CITY_COORDINATES } from "@/utils/locationService";

export default function JobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationService, setLocationService] = useState<any>(null);
  const [locationPermission, setLocationPermission] = useState("prompt");
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]); // Add state for jobs
  const [loading, setLoading] = useState(true); // Add loading state
  const itemsPerPage = 6;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        const data = await response.json();
        if (data.success) {
          // Transform API data to match existing structure
          const transformedJobs = data.data.map((job: any) => ({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            branch: job.category || "Software", // Map category to branch
            description: job.description,
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
            salary: job.salary ? `${job.salary.currency || 'INR'} ${job.salary.min?.toLocaleString()}-${job.salary.max?.toLocaleString()}` : "Competitive",
            image: "/images/company-placeholder.svg" // Use placeholder image
          }));
          setJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Fallback to hardcoded data if API fails
        setJobs([
          {
            id: "mechanical-engineer-intern",
            title: "Mechanical Engineer Intern",
            company: "Tech Solutions Inc",
            location: "Remote",
            type: "Internship",
            branch: "Mechanical",
            description:
              "An exciting opportunity for a motivated student to gain hands-on experience in mechanical design and product development.",
            postedDate: "2 days ago",
            salary: "$25-30/hour",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6byUVckMqg6gmZhI9DsFjBLDSADsBBPdbK0f3saTH0PXJD9YJAs16HQ9MnxyasAzqznROviksz6opuPiyoJyisTxYAjpWCmFizrDCO6aURW1d-WdZFTaoyKNy2ZzalhBXRTNRmDdkxVVw41UdGHZy7rWhGsXLaHIeGt1oaekIAsRJ4uo0rM1zq4qrRpuFt7jfpDMYUj7fNrBkPGAJJoIs3i-5CHxbXbGsbotvV2xSoBN5Z5f6bGoPBuGE7oUOsyK-o8XaqQQOlk",
          },
          {
            id: "software-engineer",
            title: "Software Engineer",
            company: "Innovate Systems",
            location: "San Francisco, CA",
            type: "Full-time",
            branch: "Software",
            description:
              "Join our dynamic team and contribute to the development of our flagship product. Perfect for recent graduates.",
            postedDate: "3 days ago",
            salary: "$80,000 - $100,000",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA1IU2jpeLS_hX69bOnAJKS0x5aYfdFUQTtSMCJzdFoyCMO-l2uzzxdAHbJ5GXn5Jdz4s5SfaBe_HopIr46pVcy67W2hx8LUPsJLKDXOvLX_AN7wqM4oUWCPfCqXwNSX4UN4lWtRW-FyF4Wej-YaF0JtTxME4YPIztBrHxqhjw6hsBxrAFytx2wa83Tq-YBBgRwBkCDTROeNIa8yU82fibAWQXA1WcvnSqpQfVREyUWS-qoJubyq2m-NUQkxp2zKmpJuqMbOmwLxzA",
          },
          {
            id: "electrical-engineer",
            title: "Electrical Engineer",
            company: "Power Grid Corp",
            location: "New York, NY",
            type: "Full-time",
            branch: "Electrical",
            description:
              "Seeking a skilled electrical engineer to design and oversee installation of electrical equipment.",
            postedDate: "5 days ago",
            salary: "$95,000 - $120,000",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDux4P3_-rmP1G3tsHb2kbzpg44VRBZBwqlwfYovZXac4CLOml05b499gZ-DFWAB-I83A4du3_amUY_rSCVuL4VN13NFv7HzXizS13xko8zW2M0Bt46Pd1JpmNVGSN0Om7DE0UWXqqCiH3IvQZLwe04e2HOrYezmq-ZyD7z_EC0MiWlkLgyFgsx4C4-wEcIQhlsZsZyynIuFrn2EEwemNRMy1H0axAPet97__J6J6oHiKjQpWQjq-zXqE5WfKDc7CGnlMP5_D5dniI",
          },
          {
            id: "civil-engineer-intern",
            title: "Civil Engineer Intern",
            company: "BuildWell Construction",
            location: "Los Angeles, CA",
            type: "Internship",
            branch: "Civil",
            description:
              "Assist project managers with planning and execution of construction projects.",
            postedDate: "1 week ago",
            salary: "$20-25/hour",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBVRSGwOZxSZBU-lgbk1M4YGdR-mMhb6aVpW8VN_HhB8n9geDwBKPOl4TWSgkvAY352thjCQveODsddEBrbssBMuFxTO_eoXgSswWccg4NH2Dzas2eIC5oqK9ohN9GgkigAu-CTC6i-UjqbQVq-shrT-sNn98iMWM-cEevzxEUQ2RHS_bT4gHjs5SpHhk1w7HgbHfMAXD8s2DaWRbVqTiNeMRAomX1rlg9xOJuu3Pr4z6c7iPbKn4Yz3ZMa8yALrbTulU8CB8i7KyQ",
          },
          {
            id: "product-design-engineer",
            title: "Product Design Engineer",
            company: "Creative Assembly",
            location: "Remote",
            type: "Full-time",
            branch: "Mechanical",
            description:
              "Lead product design initiatives and collaborate with cross-functional teams.",
            postedDate: "4 days ago",
            salary: "$75,000 - $95,000",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6byUVckMqg6gmZhI9DsFjBLDSADsBBPdbK0f3saTH0PXJD9YJAs16HQ9MnxyasAzqznROviksz6opuPiyoJyisTxYAjpWCmFizrDCO6aURW1d-WdZFTaoyKNy2ZzalhBXRTNRmDdkxVVw41UdGHZy7rWhGsXLaHIeGt1oaekIAsRJ4uo0rM1zq4qrRpuFt7jfpDMYUj7fNrBkPGAJJoIs3i-5CHxbXbGsbotvV2xSoBN5Z5f6bGoPBuGE7oUOsyK-o8XaqQQOlk",
          },
          {
            id: "data-engineer",
            title: "Data Engineer",
            company: "DataFlow Inc",
            location: "Seattle, WA",
            type: "Full-time",
            branch: "Software",
            description:
              "Build and maintain data pipelines for large-scale analytics platforms.",
            postedDate: "6 days ago",
            salary: "$85,000 - $110,000",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA1IU2jpeLS_hX69bOnAJKS0x5aYfdFUQTtSMCJzdFoyCMO-l2uzzxdAHbJ5GXn5Jdz4s5SfaBe_HopIr46pVcy67W2hx8LUPsJLKDXOvLX_AN7wqM4oUWCPfCqXwNSX4UN4lWtRW-FyF4Wej-YaF0JtTxME4YPIztBrHxqhjw6hsBxrAFytx2wa83Tq-YBBgRwBkCDTROeNIa8yU82fibAWQXA1WcvnSqpQfVREyUWS-qoJubyq2m-NUQkxp2zKmpJuqMbOmwLxzA",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // All available locations from jobs
  const allLocations = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Los Angeles, CA",
    "Seattle, WA",
    "Boston, MA",
    "Austin, TX",
    "Chicago, IL",
    "Denver, CO",
    "Portland, OR",
    "Atlanta, GA",
    "Miami, FL",
    "Dallas, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "Houston, TX",
  ];

  // Initialize location service
  useEffect(() => {
    const initLocationService = async () => {
      const service = LocationService.getInstance();
      try {
        await service.initialize();
        setLocationService(service);
        setLocationPermission(service.getPermissionStatus());
      } catch (error) {
        setLocationPermission("denied");
        console.log("Location service initialization failed:", error);
      }
    };

    initLocationService();
  }, []);

  // Handle location permission request
  const handleLocationRequest = async () => {
    setRequestingLocation(true);
    try {
      const service = LocationService.getInstance();
      await service.initialize();
      setLocationService(service);
      setLocationPermission(service.getPermissionStatus());

      if (service.getPermissionStatus() === "granted") {
        setSelectedLocation("Near me (50 miles)");
      }
    } catch (error) {
      setLocationPermission("denied");
      console.log("Location permission request failed:", error);
    } finally {
      setRequestingLocation(false);
    }
  };

  // Get sorted locations for dropdown
  const getSortedLocations = () => {
    if (locationService && locationPermission === "granted") {
      return locationService.getSortedLocations(allLocations);
    } else {
      // Default alphabetical order when location is not available
      return [
        "All Locations",
        "Remote",
        ...allLocations.filter((loc) => loc !== "Remote").sort(),
      ];
    }
  };

  const featuredJobs = jobs.slice(0, 5);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesLocation = true;
      if (selectedLocation === "All Locations") {
        matchesLocation = true;
      } else if (selectedLocation === "Near me (50 miles)") {
        // Filter jobs within 50 miles of user location using location service
        if (locationService && locationPermission === "granted") {
          const nearbyJobs = locationService.filterJobsByRadius(jobs, 50);
          matchesLocation = nearbyJobs.some(
            (nearbyJob: any) => nearbyJob.id === job.id,
          );
        } else {
          matchesLocation = job.location === "Remote";
        }
      } else if (selectedLocation === "---") {
        matchesLocation = false; // Separator, should not match any jobs
      } else {
        matchesLocation = job.location === selectedLocation;
      }

      const matchesBranch =
        selectedBranch === "All Branches" || job.branch === selectedBranch;

      return matchesSearch && matchesLocation && matchesBranch;
    });
  }, [
    searchQuery,
    selectedLocation,
    selectedBranch,
    jobs,
    locationService,
    locationPermission,
  ]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleApplyClick = (jobId: string) => {
    router.push(`/jobs/${jobId}#apply`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document
      .getElementById("job-results")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl"
              >
                Find Your{" "}
                <span className="bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">
                  Engineering
                </span>{" "}
                Job
              </motion.h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Explore thousands of opportunities tailored for ambitious
                engineering students.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="currentColor"
                      height="24"
                      viewBox="0 0 256 256"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    className="block w-full rounded-md border-slate-800 bg-slate-950 pl-10 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-sky-600 focus:ring-sky-600"
                    placeholder="Job title or keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <div className="relative">
                  <select
                    aria-label="Filter by location"
                    className="block w-full rounded-md border-slate-800 bg-slate-950 py-3 text-sm text-slate-100 focus:border-sky-600 focus:ring-sky-600"
                    value={selectedLocation}
                    onChange={(e) => {
                      if (e.target.value !== "---") {
                        setSelectedLocation(e.target.value);
                      }
                    }}
                  >
                    {getSortedLocations().map(
                      (location: any, index: number) => (
                        <option
                          key={index}
                          value={location}
                          disabled={location === "---"}
                          className={
                            location === "---"
                              ? "text-slate-500 text-center"
                              : ""
                          }
                        >
                          {location === "---"
                            ? "──── Other Locations ────"
                            : location}
                          {location === "Near me (50 miles)" &&
                          locationPermission !== "granted"
                            ? " (Enable location)"
                            : ""}
                        </option>
                      ),
                    )}
                  </select>
                  {/* Location Status Indicator */}
                  <div className="absolute -bottom-12 left-0 w-full">
                    {locationPermission === "prompt" && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-500">
                          💡 Enable location for nearby jobs
                        </span>
                        <button
                          onClick={handleLocationRequest}
                          disabled={requestingLocation}
                          className="ml-2 px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded transition-colors disabled:bg-slate-600"
                        >
                          {requestingLocation ? "Requesting..." : "Enable"}
                        </button>
                      </div>
                    )}
                    {locationPermission === "granted" && locationService && (
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        📍 Location enabled - showing nearby jobs first
                      </div>
                    )}
                    {locationPermission === "denied" && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        ⚠️ Location access denied -{" "}
                        {selectedLocation === "Near me (50 miles)"
                          ? "showing remote jobs only"
                          : "showing all locations"}
                      </div>
                    )}
                    {locationPermission === "unsupported" && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        ℹ️ Location not supported in this browser
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <select
                    aria-label="Filter by branch"
                    className="block w-full rounded-md border-slate-800 bg-slate-950 py-3 text-sm text-slate-100 focus:border-sky-600 focus:ring-sky-600"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option>All Branches</option>
                    <option>Mechanical</option>
                    <option>Software</option>
                    <option>Electrical</option>
                    <option>Civil</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center rounded-md h-12 px-6 bg-sky-600 text-white text-base font-semibold tracking-tight hover:bg-sky-500 w-full transition-colors"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Show loading indicator within the main content area to avoid hydration mismatch */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                  <p className="mt-4 text-slate-400">Loading jobs...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 lg:col-span-3">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg sticky top-8">
                    <h3 className="text-lg font-bold mb-4">Featured Jobs</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {featuredJobs.map((job, index) => (
                        <div
                          key={job.id}
                          onClick={() => handleJobClick(job.id)}
                          className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-slate-700"
                        >
                          <h4 className="font-bold">{job.title}</h4>
                          <p className="text-sm text-slate-400">{job.company}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {job.location}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                job.type === "Internship"
                                  ? "bg-sky-900/40 text-sky-300"
                                  : "bg-emerald-900/40 text-emerald-300"
                              }`}
                            >
                              {job.type}
                            </span>
                            <span className="text-xs text-slate-400">
                              {job.postedDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="md:col-span-8 lg:col-span-9 space-y-6"
                  id="job-results"
                >
                  {/* Search Results Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedLocation === "Near me (50 miles)" &&
                        locationPermission === "granted"
                          ? "Jobs Near You"
                          : searchQuery ||
                              selectedLocation !== "All Locations" ||
                              selectedBranch !== "All Branches"
                            ? "Search Results"
                            : "All Jobs"}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {filteredJobs.length} job
                        {filteredJobs.length !== 1 ? "s" : ""} found
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedLocation === "Near me (50 miles)" &&
                          locationPermission === "granted" &&
                          " within 50 miles of your location"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {locationPermission === "denied" && (
                        <button
                          onClick={handleLocationRequest}
                          disabled={requestingLocation}
                          className="text-sm px-3 py-1 rounded-full bg-slate-800 text-orange-400 hover:bg-slate-700 transition-colors disabled:bg-slate-600"
                        >
                          {requestingLocation
                            ? "Requesting..."
                            : "🔄 Try Location Again"}
                        </button>
                      )}
                      {locationPermission === "granted" && locationService && (
                        <button
                          onClick={() => {
                            setSelectedLocation("Near me (50 miles)");
                            setCurrentPage(1);
                          }}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            selectedLocation === "Near me (50 miles)"
                              ? "bg-sky-600 text-white"
                              : "bg-slate-800 text-sky-400 hover:bg-slate-700"
                          }`}
                        >
                          📍 Show Nearby Jobs
                        </button>
                      )}
                      {(searchQuery ||
                        selectedLocation !== "All Locations" ||
                        selectedBranch !== "All Branches") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedLocation("All Locations");
                            setSelectedBranch("All Branches");
                            setCurrentPage(1);
                          }}
                          className="text-sky-400 hover:text-sky-300 text-sm"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Job Results */}
                  {currentJobs.length > 0 ? (
                    <>
                      {/* Featured job card (first result) */}
                      {currentJobs[0] && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-start gap-6 border-l-4 border-l-sky-600"
                        >
                          <div className="w-full sm:w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden">
                            <SmartImage
                              src={currentJobs[0].image}
                              alt={`${currentJobs[0].company} logo`}
                              className="h-full w-full object-cover"
                              width={128}
                              height={128}
                              fallbackSrc="/images/company-placeholder.svg"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <h3
                                className="text-2xl font-bold cursor-pointer hover:text-sky-400 transition-colors"
                                onClick={() => handleJobClick(currentJobs[0].id)}
                              >
                                {currentJobs[0].title}
                              </h3>
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  currentJobs[0].type === "Internship"
                                    ? "bg-sky-900/40 text-sky-300"
                                    : "bg-emerald-900/40 text-emerald-300"
                                }`}
                              >
                                {currentJobs[0].type}
                              </span>
                            </div>
                            <p className="text-md text-slate-400 mb-3">
                              {currentJobs[0].company} - {currentJobs[0].location}
                            </p>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                              {currentJobs[0].description}
                            </p>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() =>
                                  handleApplyClick(currentJobs[0].id)
                                }
                                className="inline-flex items-center justify-center rounded-md h-10 px-5 bg-sky-600 text-white text-sm font-semibold tracking-tight hover:bg-sky-500 transition-colors"
                              >
                                Apply Now
                              </button>
                              <span className="text-sm text-slate-500">
                                Posted {currentJobs[0].postedDate}
                              </span>
                              <span className="text-sm text-slate-500 font-medium">
                                {currentJobs[0].salary}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Grid of remaining jobs */}
                      {currentJobs.length > 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {currentJobs.slice(1).map((job, index) => (
                            <motion.div
                              key={job.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: (index + 1) * 0.1,
                              }}
                              className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                              onClick={() => handleJobClick(job.id)}
                            >
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                                  <SmartImage
                                    src={job.image}
                                    alt={`${job.company} logo`}
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64}
                                    fallbackSrc="/images/company-placeholder.svg"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold hover:text-sky-400 transition-colors">
                                    {job.title}
                                  </h3>
                                  <p className="text-md text-slate-400">
                                    {job.company}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {job.location}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-slate-400 line-clamp-3 flex-grow mb-4">
                                {job.description}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      job.type === "Internship"
                                        ? "bg-sky-900/40 text-sky-300"
                                        : "bg-emerald-900/40 text-emerald-300"
                                    }`}
                                  >
                                    {job.type}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {job.postedDate}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-sm font-medium text-slate-300">
                                    {job.salary}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApplyClick(job.id);
                                    }}
                                    className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                                  >
                                    Apply →
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 p-12 rounded-xl shadow-lg text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                      <p className="text-slate-400 mb-4">
                        We couldn&apos;t find any jobs matching your criteria.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedLocation("All Locations");
                          setSelectedBranch("All Branches");
                          setCurrentPage(1);
                        }}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center p-8 mt-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex size-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <svg
                    fill="currentColor"
                    height="18px"
                    viewBox="0 0 256 256"
                    width="18px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`text-sm font-medium flex size-10 items-center justify-center rounded-md mx-1 transition-colors ${
                        currentPage === page
                          ? "text-white bg-sky-600"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex size-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <svg
                    fill="currentColor"
                    height="18px"
                    viewBox="0 0 256 256"
                    width="18px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}