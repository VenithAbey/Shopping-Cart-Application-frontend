import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock authentication - replace with actual Spring Boot API call
    // For demo: accept demo@example.com / demo123
    if (email === 'demo@example.com' && password === 'demo123') {
      const user = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'user'
      }

      const token = Buffer.from(JSON.stringify(user)).toString('base64')

      return NextResponse.json({
        user,
        token,
        message: 'Login successful'
      })
    }

    // Admin user for demo
    if (email === 'admin@example.com' && password === 'admin123') {
      const user = {
        id: '2',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      }

      const token = Buffer.from(JSON.stringify(user)).toString('base64')

      return NextResponse.json({
        user,
        token,
        message: 'Login successful'
      })
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
