import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all auctions with basic info
    const { data: auctions, error } = await supabase
      .from('auctions')
      .select(`
        id,
        name,
        location,
        auction_date,
        status,
        description,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching auctions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch auctions', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: auctions,
      count: auctions?.length || 0
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data: auction, error } = await supabase
      .from('auctions')
      .insert([{
        name: body.name,
        location: body.location,
        auction_date: body.auction_date,
        description: body.description,
        status: body.status || 'in_bewerking'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating auction:', error)
      return NextResponse.json(
        { error: 'Failed to create auction', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: auction
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
