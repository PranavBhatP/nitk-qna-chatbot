import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Search, History, Bot, Database, Code } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Responses",
      description: "Get instant, accurate answers about NITK using advanced language models"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Search",
      description: "Intelligent search suggestions based on previous queries and common questions"
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Query History",
      description: "Keep track of your previous questions and answers for quick reference"
    }
  ]

  const technologies = [
    {
      icon: <Bot className="h-6 w-6" />,
      name: "LangChain",
      description: "Advanced LLM framework for natural language processing"
    },
    {
      icon: <Database className="h-6 w-6" />,
      name: "Vector Database",
      description: "Efficient storage and retrieval of semantic information"
    },
    {
      icon: <Code className="h-6 w-6" />,
      name: "Next.js & React",
      description: "Modern web framework for a seamless user experience"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NITK Q&A Assistant
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Your AI-Powered Guide to NITK
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant, accurate answers to all your questions about National Institute of Technology Karnataka
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Asking Questions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Powered By</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white"
              >
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  {tech.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{tech.name}</h4>
                <p className="text-gray-300">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Get Your Questions Answered?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join now and get instant access to our AI-powered NITK knowledge base
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
