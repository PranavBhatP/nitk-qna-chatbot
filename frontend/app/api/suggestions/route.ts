import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Get most frequent queries from history
    const popularQueries = await prisma.history.groupBy({
      by: ['query'],
      _count: {
        query: true
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: 5
    })

    const suggestions = popularQueries.map(item => item.query)

    return NextResponse.json({ suggestions })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
} 