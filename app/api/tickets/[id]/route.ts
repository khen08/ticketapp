import prisma from "@/prisma/db";
import { ticketPatchSchema } from "@/ValidationSchemas/ticket";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const validation = ticketPatchSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found." }, { status: 400 });
  }

  if (session.user.role !== "ADMIN" && ticket.createdBy !== session.user.name) {
    return NextResponse.json(
      { error: "Not Authorized to Edit This Ticket" },
      { status: 403 }
    );
  }

  if (body?.assignedToUserId) {
    body.assignedToUserId = parseInt(body.assignedToUserId);
  }

  const { createdBy, ...updateData } = body;

  const updateTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: updateData,
  });

  return NextResponse.json(updateTicket);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found." }, { status: 400 });
  }

  if (session.user.role !== "ADMIN" && ticket.createdBy !== session.user.name) {
    return NextResponse.json(
      { error: "Not Authorized to Delete This Ticket" },
      { status: 403 }
    );
  }

  await prisma.ticket.delete({
    where: { id: ticket.id },
  });

  return NextResponse.json({ message: "Ticket Deleted." });
}
