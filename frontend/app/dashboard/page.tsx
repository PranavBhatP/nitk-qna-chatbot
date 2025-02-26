"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Common queries that will populate the search bar when clicked
  const commonQueries = [
    "What are the hostel facilities?",
    "How to apply for scholarships?",
    "What are the placement statistics?"
  ]

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
    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Search failed:', error)
      setResponse('Failed to get response. Please try again.')
    }
    setIsLoading(false)
  }

  const handleCommonQuery = (commonQuery: string) => {
    setQuery(commonQuery)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">NITK Q&A Assistant</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-20 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ask me anything about NITK</h2>
          <p className="text-gray-600">Get instant answers to your questions about the college</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 text-lg rounded-xl shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700"
            >
              Ask
            </Button>
          </div>
        </form>

        {/* Common Queries */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Common questions:</p>
          <div className="flex flex-wrap gap-2">
            {commonQueries.map((commonQuery, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleCommonQuery(commonQuery)}
                className="text-sm"
              >
                {commonQuery}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Area - You can add the chatbot response here */}
        <Card className="mt-8">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center">
                <p className="text-gray-600">Processing your question...</p>
              </div>
            ) : response ? (
              <div className="prose max-w-none">
                <p className="text-gray-800">{response}</p>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                Your answers will appear here...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 