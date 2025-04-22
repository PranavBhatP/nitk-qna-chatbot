"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

interface SearchSuggestionsProps {
  onSelect: (suggestion: string) => void
  currentQuery: string
}

export function SearchSuggestions({ onSelect, currentQuery }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/suggestions')
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  // Filter suggestions based on current query
  const filteredSuggestions = currentQuery
    ? suggestions.filter(s => 
        s.toLowerCase().includes(currentQuery.toLowerCase())
      )
    : suggestions

  if (isLoading || filteredSuggestions.length === 0) return null

  return (
    <Card className="absolute w-full mt-1 z-10 bg-white shadow-lg rounded-md overflow-hidden">
      <div className="p-2">
        {filteredSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            onClick={() => onSelect(suggestion)}
          >
            <Search className="h-4 w-4 text-gray-500" />
            {suggestion}
          </Button>
        ))}
      </div>
    </Card>
  )
}