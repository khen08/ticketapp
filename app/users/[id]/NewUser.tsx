import UserForm from "@/components/UserForm";
import React from "react";

const NewUser = async () => {
  // Temporarily bypass the admin access check
  // const session = await getServerSession(options);

  // if (session?.user.role !== "ADMIN") {
  //   return <p className="text-destructive">Admin access required.</p>;
  // }

  return <UserForm />;
};

export default NewUser;
