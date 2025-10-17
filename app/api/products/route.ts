import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT id, name, description, price, image_url, category, created_at FROM products ORDER BY created_at DESC'
    )

    return NextResponse.json({
      products: result.rows,
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, price, image_url, category } = body

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO products (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description || '', parseFloat(price), image_url || '', category || 'general']
    )

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: result.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
