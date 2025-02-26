import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const res = cookieStore.delete('token')
  return NextResponse.json({ message: 'Logged out successfully' })
} 