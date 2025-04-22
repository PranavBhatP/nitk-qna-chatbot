"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut, MessageCircle } from 'lucide-react'
import { SearchSuggestions } from '../components/SearchSuggestions'
import useClickOutside from '../hooks/useClickOutside'

interface HistoryItem {
  id: string
  query: string
  response: string
  createdAt: string
}

type LoadingStage = {
  stage: 'thinking' | 'searching' | 'processing' | 'saving' | null;
  message: string;
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<LoadingStage>({ stage: null, message: '' })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Common queries that will populate the search bar when clicked
  const commonQueries = [
    "What are the hostel facilities?",
    "How to apply for scholarships?",
    "What are the placement statistics?"
  ]

  const searchRef = useRef<HTMLDivElement>(null)
  useClickOutside(searchRef, () => setShowSuggestions(false))

  useEffect(() => {
    // Verify authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse("")
    
    try {
      // Initial thinking stage
      setLoadingStage({ stage: 'thinking', message: 'Understanding your question...' })
      await new Promise(resolve => setTimeout(resolve, 800)) // Brief pause for UX

      // Searching stage
      setLoadingStage({ stage: 'searching', message: 'Searching for relevant information...' })
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      // Processing stage
      setLoadingStage({ stage: 'processing', message: 'Processing the answer...' })
      const data = await response.json()
      setResponse(data.response)

      // Saving stage
      setLoadingStage({ stage: 'saving', message: 'Saving to history...' })
      await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, response: data.response }),
      })

      await fetchHistory()
    } catch (error) {
      console.error('Search failed:', error)
      setResponse('Failed to get response. Please try again.')
    }
    setIsLoading(false)
    setLoadingStage({ stage: null, message: '' })
  }

  const handleCommonQuery = (commonQuery: string) => {
    setQuery(commonQuery)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="w-full p-4 bg-white shadow-sm backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NITK Q&A Assistant
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Ask me anything about NITK
          </h2>
          <p className="text-gray-600 text-lg">
            Get instant answers to your questions about the college
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full mb-12">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-14 pr-32 py-7 text-lg rounded-2xl shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ask
            </Button>

            {showSuggestions && (
              <SearchSuggestions
                onSelect={handleSuggestionSelect}
                currentQuery={query}
              />
            )}
          </div>
        </form>

        {/* Common Queries */}
        <div className="mb-12">
          <p className="text-sm font-medium text-gray-600 mb-3">Popular questions:</p>
          <div className="flex flex-wrap gap-2">
            {commonQueries.map((commonQuery, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleCommonQuery(commonQuery)}
                className="text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                {commonQuery}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {(isLoading || response) && (
          <Card className="mb-12 overflow-hidden border-0 shadow-lg ring-1 ring-black/5">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s] ${loadingStage.stage === 'thinking' ? 'bg-yellow-500' : loadingStage.stage === 'searching' ? 'bg-blue-500' : loadingStage.stage === 'processing' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className={`h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s] ${loadingStage.stage === 'thinking' ? 'bg-yellow-500' : loadingStage.stage === 'searching' ? 'bg-blue-500' : loadingStage.stage === 'processing' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className={`h-2 w-2 bg-blue-600 rounded-full animate-bounce ${loadingStage.stage === 'thinking' ? 'bg-yellow-500' : loadingStage.stage === 'searching' ? 'bg-blue-500' : loadingStage.stage === 'processing' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  </div>
                  <div className="text-sm text-gray-600 animate-pulse">
                    {loadingStage.message}
                  </div>
                </div>
              ) : (
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-800 leading-relaxed">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* History Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Questions</h3>
          <div className="grid gap-4">
            {history.map((item) => (
              <Card 
                key={item.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors border-0 shadow-md ring-1 ring-black/5" 
                onClick={() => setQuery(item.query)}
              >
                <CardContent className="p-6">
                  <p className="font-medium text-gray-900 mb-2">{item.query}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.response}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 