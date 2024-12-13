import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    
    // Convert filingDate string to Date if present
    if (data.filingDate) {
      data.filingDate = new Date(data.filingDate)
    }

    const user = await prisma.user.update({
      where: { clerkId },
      data,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
