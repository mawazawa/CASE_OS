import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const url = new URL(req.url)
    const state = url.searchParams.get('state')
    
    if (!state) {
      return new NextResponse('State parameter is required', { status: 400 })
    }

    const requirements = await prisma.legalRequirement.findMany({
      where: {
        state: state,
      },
      orderBy: {
        category: 'asc',
      },
    })

    return NextResponse.json(requirements)
  } catch (error) {
    console.error('Error fetching legal requirements:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    const { state, category, title, description, details } = data

    if (!state || !category || !title || !description || !details) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const requirement = await prisma.legalRequirement.create({
      data: {
        state,
        category,
        title,
        description,
        details,
      },
    })

    return NextResponse.json(requirement)
  } catch (error) {
    console.error('Error creating legal requirement:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
