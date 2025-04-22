import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string
    }

    const history = await prisma.history.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 10 // Get last 10 queries
    })

    return NextResponse.json({ history })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string
    }

    const { query, response } = await request.json()

    const history = await prisma.history.create({
      data: {
        query,
        response,
        userId: decoded.userId
      }
    })

    return NextResponse.json({ history })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to save history' },
      { status: 500 }
    )
  }
} 