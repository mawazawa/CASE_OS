import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { S3 } from 'aws-sdk'

const prisma = new PrismaClient()
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, description, fileType } = await req.json()

    // Generate a pre-signed URL for file upload
    const key = `${userId}/${Date.now()}-${title}`
    const presignedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 300, // URL expires in 5 minutes
    })

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        userId,
        title,
        description,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        fileType,
      },
    })

    return NextResponse.json({ presignedUrl, document })
  } catch (error) {
    console.error('Error creating document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
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
    const documentId = searchParams.get('id')

    if (!documentId) {
      return new NextResponse('Document ID is required', { status: 400 })
    }

    // Get document to find S3 key
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document || document.userId !== userId) {
      return new NextResponse('Document not found', { status: 404 })
    }

    // Delete from S3
    const key = document.fileUrl.split('.com/')[1]
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }).promise()

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
