import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  )
}
