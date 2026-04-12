import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Mock signup - replace with actual Spring Boot API call
    // For demo purposes, accept any email that doesn't exist
    const user = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user'
    }

    const token = Buffer.from(JSON.stringify(user)).toString('base64')

    return NextResponse.json({
      user,
      token,
      message: 'Account created successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
