import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { date, description } = await req.json()

    const timeline = await prisma.timeline.create({
      data: {
        userId,
        date: new Date(date),
        description,
      },
    })

    return NextResponse.json(timeline)
  } catch (error) {
    console.error('Error creating timeline item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const timeline = await prisma.timeline.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(timeline)
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await req.json()
    
    const timeline = await prisma.timeline.findUnique({
      where: { id },
    })

    if (!timeline || timeline.userId !== userId) {
      return new NextResponse('Timeline item not found', { status: 404 })
    }

    const updated = await prisma.timeline.update({
      where: { id },
      data: { completed: !timeline.completed },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating timeline item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Timeline item ID is required', { status: 400 })
    }

    const timeline = await prisma.timeline.findUnique({
      where: { id },
    })

    if (!timeline || timeline.userId !== userId) {
      return new NextResponse('Timeline item not found', { status: 404 })
    }

    await prisma.timeline.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting timeline item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
