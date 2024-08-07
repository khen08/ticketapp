import prisma from "@/prisma/db";
import { userSchema } from "@/ValidationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  // const session = await getServerSession(options);

  // if (!session) {
  //   return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  // }

  // if (session.user.role !== "ADMIN") {
  //   return NextResponse.json(
  //     { error: "Not Authenticated as Admin" },
  //     { status: 401 }
  //   );
  // }

  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { message: "Duplicate Username" },
      { status: 409 }
    );
  }

  const hashPassword = await bcrypt.hash(body.password, 10);
  body.password = hashPassword;

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  return NextResponse.json(newUser, { status: 201 });
}

export async function GET() {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        assignedTickets: {
          _count: "desc",
        },
      },
    });

    const topTechnicians = technicians.map((technician) => ({
      id: technician.id,
      name: technician.name,
      ticketCount: technician._count.assignedTickets,
    }));

    return NextResponse.json(topTechnicians);
  } catch (error) {
    console.error("Error fetching top technicians:", error);
    return NextResponse.error();
  }
}
