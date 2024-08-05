import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  console.log("Session:", session);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { content } = body;

  console.log("Body:", body);

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  console.log("Content:", content);

  try {
    const newReply = await prisma.reply.create({
      data: {
        content,
        ticketId: parseInt(params.id),
        userId: session.user.id,
      },
    });

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Error creating reply" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const replies = await prisma.reply.findMany({
      where: { ticketId: parseInt(params.id) },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Error fetching replies" },
      { status: 500 }
    );
  }
}
