import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const NewTicket = async () => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Not Authenticated.</p>;
  }

  return <div>{session && <TicketForm />}</div>;
};

export default NewTicket;
