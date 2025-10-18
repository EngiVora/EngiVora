"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, Suspense, useCallback } from "react";

type UpcomingItem = {
  id: string;
  title: string;
  institution: string;
  date: string;
  image: string;
  category: string;
};

const upcoming: UpcomingItem[] = [
  {
    id: "thermo",
    title: "Thermodynamics Exam",
    institution: "City College",
    date: "July 20, 2024",
    category: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmT7ROMoMsK2UnyY2rmN_ZgFMw5JLlv_EC07--IxAafJogoTFfOqEsyv7ZfYiciCERmg91LicnHpSxAg6rDtuIi7B-NrbnsRgJ9IBBnNUJCqfsnvYjg0oL7-JA5Ey-a4yZsYiArFvIo1NHSrFeQpPLBiPEpFEd3xzUR64RTziA9unL3nNcynhhUhfZ5Jc7e9RkbXWGKhmgmEpIAiZOkDc4_QPLaB8I2Ys4rZoNf8DTR9RioyYkujhveKvfYmVKCQWibQSwx2llfqM",
  },
  {
    id: "eee",
    title: "Electrical Engineering Exam",
    institution: "Technical Institute",
    date: "July 25, 2024",
    category: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_C4QnsvaON6lEjCdyWTLsVtjpgZfpDF_wdwR4bMAfmIa-J75kddtqJdl7soXDPy-LtTU07V-dW6DAJ3czDnNGv5dxc-ZerstgxoshKqU2qiuQcSlH-L3HUrPpv0VFcI3-JSS0n6K6aJ48e9WduOKWogEAMBCporyhL-HRllZbsuNdq5HZicM_V3zDqqvz9sGYAGPmcVhdf82_1fe7aEBH0CN1UxgVPL-0lGKSaNuihQShGXe_g61iu5KQ958WET8OeaApu7RAnWU",
  },
  {
    id: "mech",
    title: "Mechanical Design Exam",
    institution: "Polytechnic University",
    date: "August 5, 2024",
    category: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXhXUW7R7ymVYcA1Wb-ygm-fRmkq1yZwQ19mHFAGdZWjTy95s90h9ujT6M0t2K9_wD7gwp4FNxzid3lpQarBmo4-r4y5fwlaeEy5oSLrn0BEUEt1apqBZDZG0do8vWJDcIXUgxBQiN6dIPbOh5S4TLGskkwxtX3DbHis__chgjuzSevM5FNFAgNWG9CIQ7mXWgfJBSI3Y5VTTlaKmOik015FOrqPnxMhGlltzKAck-attaxg7GZSTJdfD7xOTDsJCGO_zDHnUwv_A",
  },
  {
    id: "fluid",
    title: "Fluid Mechanics",
    institution: "Global Tech",
    date: "August 10, 2024",
    category: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSF05e2HC9BPCELrCKYehau509GDr9g6BDNem9sqOTam1S4oKL8DUn5S1fZ8v8cR8eA2ip0MGUkHEUIYS_8zJAvWyDzD3FCNIPxlx4j_4IKmjQWqXqumyq6SzKd3eTQT_uiH9xXtphpxB10BN_VHR2el-P4Y2ZuEVJqM-S0fdp45FnFhduYnsAiukZgRbru8Nf_6XtMdTef6j0Vz7pBUoq0JMcTlTrxZwWaFFJbEDQWzmvjUhafDHoBgVavyhTsLq5zaFQQxNMFqw",
  },
];

const allExams = [
  {
    id: "calculus",
    title: "Calculus II Exam",
    institution: "State University",
    date: "July 15, 2024",
    category: "mathematics",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMfIFU4e0eEDP_Oo_ALTcq-djJpCW-2lTOExw9CAJJxPuP1wSUGf1RaoBWNz7eAMARc2B43MOWhfFa8OUMEG18OJutW2kyDJZQJCduBaDHN-dx5MYwsM90N0HH2rmI_tq2Ru19tHRqWWWIWz1_yAlm44Q-KOOQgUoPgvRxa2iWXlCAQvxo2fizm6cxo88yUUq9MsmJkf-X0qJgGMnRf4PjeKfpDDMuCHLrKy6AcqwYw5iSPToL5YHWcFaE8l4cGi1ljtlsXaJ4k74",
  },
  {
    id: "materials",
    title: "Materials Science",
    institution: "University of Engineering",
    date: "August 15, 2024",
    category: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSF05e2HC9BPCELrCKYehau509GDr9g6BDNem9sqOTam1S4oKL8DUn5S1fZ8v8cR8eA2ip0MGUkHEUIYS_8zJAvWyDzD3FCNIPxlx4j_4IKmjQWqXqumyq6SzKd3eTQT_uiH9xXtphpxB10BN_VHR2el-P4Y2ZuEVJqM-S0fdp45FnFhduYnsAiukZgRbru8Nf_6XtMdTef6j0Vz7pBUoq0JMcTlTrxZwWaFFJbEDQWzmvjUhafDHoBgVavyhTsLq5zaFQQxNMFqw",
  },
  {
    id: "digital-logic",
    title: "Digital Logic Design",
    institution: "Tech Academy",
    date: "August 22, 2024",
    category: "computer science",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_C4QnsvaON6lEjCdyWTLsVtjpgZfpDF_wdwR4bMAfmIa-J75kddtqJdl7soXDPy-LtTU07V-dW6DAJ3czDnNGv5dxc-ZerstgxoshKqU2qiuQcSlH-L3HUrPpv0VFcI3-JSS0n6K6aJ48e9WduOKWogEAMBCporyhL-HRllZbsuNdq5HZicM_V3zDqqvz9sGYAGPmcVhdf82_1fe7aEBH0CN1UxgVPL-0lGKSaNuihQShGXe_g61iu5KQ958WET8OeaApu7RAnWU",
  },
  ...upcoming,
];

function ExamsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isPageChanging, setIsPageChanging] = useState(false);

  // Initialize state from URL parameters
  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlSearch = searchParams.get("search");
    const urlFilter = searchParams.get("filter");
    const urlPerPage = searchParams.get("per_page");

    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (pageNum > 0) setCurrentPage(pageNum);
    }
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlFilter) setActiveFilter(urlFilter);
    if (urlPerPage) {
      const perPage = parseInt(urlPerPage);
      if (perPage > 0 && perPage <= 50) setItemsPerPage(perPage);
    }
  }, [searchParams]);

  const handleViewDetails = (examId: string) => {
    router.push(`/exams/${examId}`);
  };

  const handleRegister = (examId: string, title: string) => {
    router.push(
      `/exams/register?examId=${examId}&title=${encodeURIComponent(title)}`,
    );
  };

  const handleSyllabusDownload = (examId: string) => {
    // Simulate syllabus download
    const link = document.createElement("a");
    link.href = `/syllabus/${examId}-syllabus.pdf`;
    link.download = `${examId}-syllabus.pdf`;
    link.click();
    alert("Syllabus download started!");
  };

  const filteredExams = useMemo(() => {
    let filtered = allExams;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.institution.toLowerCase().includes(query) ||
          exam.category.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (activeFilter !== "All") {
      const filterMap: { [key: string]: string } = {
        Subject: "category",
        Institution: "institution",
        Date: "date",
      };

      if (filterMap[activeFilter]) {
        // For demo, we'll just return all exams when filter is selected
        // In a real app, you'd implement specific filtering logic
        filtered = filtered;
      }
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const updateUrlParams = useCallback(
    (page: number, search: string, filter: string, perPage: number) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", page.toString());
      if (search) params.set("search", search);
      if (filter !== "All") params.set("filter", filter);
      if (perPage !== 6) params.set("per_page", perPage.toString());

      const newUrl = params.toString() ? `?${params.toString()}` : "/exams";
      router.replace(newUrl, { scroll: false });
    },
    [router],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setIsPageChanging(true);
      setCurrentPage(page);
      updateUrlParams(page, searchQuery, activeFilter, itemsPerPage);

      // Scroll to top of exam section
      document
        .getElementById("exam-content")
        ?.scrollIntoView({ behavior: "smooth" });

      // Reset loading state after animation
      setTimeout(() => setIsPageChanging(false), 300);
    },
    [searchQuery, activeFilter, itemsPerPage, updateUrlParams],
  );

  const handleItemsPerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    const newTotalPages = Math.ceil(filteredExams.length / newPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    setCurrentPage(newCurrentPage);
    updateUrlParams(newCurrentPage, searchQuery, activeFilter, newPerPage);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't interfere with input fields

      if (e.key === "ArrowLeft" && currentPage > 1) {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        handlePageChange(1);
      } else if (e.key === "End") {
        e.preventDefault();
        handlePageChange(totalPages);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Previous page (←)"
      >
        ‹
      </button>,
    );

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          title="Go to page 1"
        >
          1
        </button>,
      );

      if (startPage > 2) {
        buttons.push(
          <span
            key="ellipsis1"
            className="flex h-10 w-10 items-center justify-center text-sm text-slate-400"
          >
            ...
          </span>,
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold transition-colors ${
            currentPage === i
              ? "bg-sky-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-800"
          }`}
          title={`Go to page ${i}`}
        >
          {i}
        </button>,
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span
            key="ellipsis2"
            className="flex h-10 w-10 items-center justify-center text-sm text-slate-400"
          >
            ...
          </span>,
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          title={`Go to page ${totalPages}`}
        >
          {totalPages}
        </button>,
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Next page (→)"
      >
        ›
      </button>,
    );

    return buttons;
  };

  return (
    <main className="flex-1 bg-slate-950 px-4 sm:px-6 lg:px-20 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl" id="exam-content">
        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Exam Updates
          </motion.h2>
          <p className="mt-2 text-base md:text-lg text-slate-400">
            Stay informed about upcoming exams and important deadlines.
          </p>
          <div className="mt-4">
            <Link
              href="/exams/track"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
            >
              Track Registration Status
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search for exams by subject or institution"
              aria-label="Search exams"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrlParams(1, e.target.value, activeFilter, itemsPerPage);
              }}
              className="h-12 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 text-sm md:text-base text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {[
            { label: "All" },
            { label: "Subject" },
            { label: "Institution" },
            { label: "Date" },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => {
                setActiveFilter(f.label);
                updateUrlParams(1, searchQuery, f.label, itemsPerPage);
              }}
              className={
                activeFilter === f.label
                  ? "rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                  : "rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-800"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Left big card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden"
          >
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMfIFU4e0eEDP_Oo_ALTcq-djJpCW-2lTOExw9CAJJxPuP1wSUGf1RaoBWNz7eAMARc2B43MOWhfFa8OUMEG18OJutW2kyDJZQJCduBaDHN-dx5MYwsM90N0HH2rmI_tq2Ru19tHRqWWWIWz1_yAlm44Q-KOOQgUoPgvRxa2iWXlCAQvxo2fizm6cxo88yUUq9MsmJkf-X0qJgGMnRf4PjeKfpDDMuCHLrKy6AcqwYw5iSPToL5YHWcFaE8l4cGi1ljtlsXaJ4k74")',
              }}
            />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold">Calculus II Exam</h3>
              <p className="mt-1 text-sm text-slate-400">
                Institution: State University
              </p>
              <p className="mt-1 text-sm text-slate-400">Date: July 15, 2024</p>
              <button
                onClick={() => handleViewDetails("calculus")}
                className="mt-4 w-full rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-400"
              >
                View Details
              </button>
            </div>
          </motion.div>

          {/* Middle: Upcoming list */}
          <div className="col-span-1 lg:col-span-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 p-6">
              <h3 className="text-xl font-bold mb-4">
                {searchQuery ? "Search Results" : "Upcoming Exams"}
                {searchQuery && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({filteredExams.length} found)
                  </span>
                )}
                {!searchQuery && totalPages > 1 && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </h3>
              <div className="max-h-96 overflow-y-auto pr-2">
                {isPageChanging ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                  </div>
                ) : currentExams.length > 0 ? (
                  currentExams.map((u) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-6 rounded-md p-4 mb-4 last:mb-0 hover:bg-slate-800"
                    >
                      <div
                        className="h-20 w-28 shrink-0 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url("${u.image}")` }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold">{u.title}</h4>
                        <p className="text-sm text-slate-400">
                          Institution: {u.institution}, Date: {u.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(u.id)}
                        className="text-sky-400 hover:underline text-sm font-medium"
                      >
                        Details
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">
                      {filteredExams.length === 0
                        ? "No exams found matching your search."
                        : "No exams on this page."}
                    </p>
                    {filteredExams.length === 0 && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveFilter("All");
                          setCurrentPage(1);
                          router.replace("/exams", { scroll: false });
                        }}
                        className="mt-2 text-sky-400 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlay image card */}
          <div className="relative flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSF05e2HC9BPCELrCKYehau509GDr9g6BDNem9sqOTam1S4oKL8DUn5S1fZ8v8cR8eA2ip0MGUkHEUIYS_8zJAvWyDzD3FCNIPxlx4j_4IKmjQWqXqumyq6SzKd3eTQT_uiH9xXtphpxB10BN_VHR2el-P4Y2ZuEVJqM-S0fdp45FnFhduYnsAiukZgRbru8Nf_6XtMdTef6j0Vz7pBUoq0JMcTlTrxZwWaFFJbEDQWzmvjUhafDHoBgVavyhTsLq5zaFQQxNMFqw")',
              }}
            />
            <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-60 transition-opacity z-10" />
            <div className="p-6 flex-1 flex flex-col justify-end z-20 text-white">
              <h3 className="text-lg font-bold">Materials Science</h3>
              <p className="mt-1 text-sm">
                Institution: University of Engineering, Date: August 15, 2024
              </p>
              <button
                onClick={() => handleViewDetails("materials")}
                className="mt-4 w-full rounded-md bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/30 border border-white/30"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Structural analysis card */}
          <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold">Structural Analysis</h3>
              <p className="mt-1 text-sm text-slate-400">
                Institution: National Institute, Date: August 20, 2024
              </p>
              <p className="mt-4 text-sm text-slate-300">
                Prepare for a comprehensive exam covering key concepts in
                structural analysis. Key topics include trusses, beams, and
                frames.
              </p>
            </div>
            <div className="bg-slate-900 p-4 border-t border-slate-800 mt-auto">
              <button
                onClick={() => handleSyllabusDownload("structural-analysis")}
                className="text-sm font-medium text-sky-400 hover:underline"
              >
                Download Syllabus
              </button>
            </div>
          </div>

          {/* Promo card */}
          <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-md transition-shadow hover:shadow-sky-500/20 overflow-hidden items-center text-center p-6">
            <div className="h-24 w-24 rounded-full bg-sky-900/40 text-sky-300 flex items-center justify-center mb-4">
              📘
            </div>
            <h3 className="text-lg font-bold">Digital Logic Design</h3>
            <p className="mt-1 text-sm text-slate-400">
              Institution: Tech Academy, Date: August 22, 2024
            </p>
            <button
              onClick={() =>
                handleRegister("digital-logic", "Digital Logic Design")
              }
              className="mt-4 rounded-full bg-teal-500 px-6 py-2 text-sm font-medium text-white hover:bg-teal-400"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            {/* Items per page selector */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(parseInt(e.target.value))
                }
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Pagination Info */}
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredExams.length)} of{" "}
              {filteredExams.length} exams
            </div>

            {/* Pagination Controls */}
            <nav aria-label="Pagination" className="flex items-center gap-2">
              {renderPaginationButtons()}
            </nav>

            {/* Quick Page Jump */}
            {totalPages > 10 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <span className="text-slate-400">of {totalPages}</span>
              </div>
            )}

            {/* Pagination Presets */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Quick jump:</span>
              <button
                onClick={() => handlePageChange(1)}
                className="px-2 py-1 text-sky-400 hover:text-sky-300 hover:underline"
              >
                First
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => handlePageChange(Math.ceil(totalPages / 2))}
                className="px-2 py-1 text-sky-400 hover:text-sky-300 hover:underline"
              >
                Middle
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-2 py-1 text-sky-400 hover:text-sky-300 hover:underline"
              >
                Last
              </button>
            </div>

            {/* Keyboard Navigation Hint */}
            <div className="text-xs text-slate-500 text-center max-w-md">
              <div className="mb-1">Keyboard shortcuts:</div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <span>
                  <kbd className="px-1 bg-slate-800 rounded text-slate-400">
                    ←
                  </kbd>{" "}
                  Previous
                </span>
                <span>
                  <kbd className="px-1 bg-slate-800 rounded text-slate-400">
                    →
                  </kbd>{" "}
                  Next
                </span>
                <span>
                  <kbd className="px-1 bg-slate-800 rounded text-slate-400">
                    Home
                  </kbd>{" "}
                  First
                </span>
                <span>
                  <kbd className="px-1 bg-slate-800 rounded text-slate-400">
                    End
                  </kbd>{" "}
                  Last
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function ExamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
        </div>
      }
    >
      <ExamsPageContent />
    </Suspense>
  );
}
