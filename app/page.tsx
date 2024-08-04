import React from "react";
import prisma from "@/prisma/db";
import RecentTickets from "@/components/RecentTickets";
import DashboardChart from "@/components/DashboardChart";

const Dashboard = async () => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "SOLVED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2">
        <div>
          <RecentTickets tickets={tickets} />
        </div>
        <div>
          <DashboardChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
