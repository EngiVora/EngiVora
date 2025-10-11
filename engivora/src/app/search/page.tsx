"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Calendar, ExternalLink } from "lucide-react"

interface SearchResult {
  title: string
  description: string
  url: string
  type: 'exam' | 'job' | 'blog' | 'event'
  date?: string
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    if (query) {
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      // Update URL
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const filteredResults = selectedFilter === 'all' 
    ? results 
    : results.filter(result => result.type === selectedFilter)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'job': return 'bg-green-100 text-green-800 border-green-200'
      case 'blog': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'event': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeCount = (type: string) => {
    return results.filter(result => result.type === type).length
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Search Results</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exams, jobs, blogs, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Results Summary */}
            {searchQuery && (
              <p className="text-slate-400">
                {isLoading ? 'Searching...' : `Found ${total} results for "${searchQuery}"`}
              </p>
            )}
          </div>

          {/* Filters */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({total})
              </button>
              {['exam', 'job', 'blog', 'event'].map((type) => {
                const count = getTypeCount(type)
                return count > 0 ? (
                  <button
                    key={type}
                    onClick={() => setSelectedFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === type
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}s ({count})
                  </button>
                ) : null
              })}
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-slate-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400"></div>
                  Searching...
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <div key={index} className="bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                  <Link href={result.url} className="block p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-100 hover:text-sky-400 transition-colors">
                            {result.title}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="text-slate-400 mb-3 line-clamp-2">{result.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            getTypeColor(result.type)
                          }`}>
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </span>
                          {result.date && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {result.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : searchQuery && !isLoading ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No results found</h3>
                  <p className="text-slate-400 mb-4">
                    We could not find any results for &quot;{searchQuery}&quot;. Try different keywords or check your spelling.
                  </p>
                  <div className="text-sm text-slate-500">
                    <p className="mb-2">Suggestions:</p>
                    <ul className="space-y-1">
                      <li>• Use more general terms</li>
                      <li>• Check for typos</li>
                      <li>• Try different keywords</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">Start your search</h3>
                  <p className="text-slate-400">
                    Enter keywords above to search through exams, jobs, blogs, and events.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}