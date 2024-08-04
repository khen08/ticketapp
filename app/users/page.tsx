import UserForm from "@/components/UserForm";
import React from "react";
import UserTable from "./UserTable";
import prisma from "@/prisma/db";
import Pagination from "@/components/Pagination";
import RoleFilter from "@/components/RoleFilter";
import { User } from "@prisma/client";

export interface SearchParams {
  role: string;
  page: string;
  orderBy: keyof User;
  order: "asc" | "desc";
}

const Users = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 5;
  const page = parseInt(searchParams.page) || 1;

  const orderBy = searchParams.orderBy ? searchParams.orderBy : "name";
  const order = searchParams.order ? searchParams.order : "asc";

  const roles = ["ADMIN", "TECHNICIAN", "USER"];
  const role = roles.includes(searchParams.role)
    ? searchParams.role
    : undefined;

  let where = {};
  if (role) {
    where = { role };
  }

  const userCount = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    orderBy: {
      [orderBy]: order,
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <UserForm />
      <div className="flex gap-2">
        <RoleFilter />
      </div>
      <UserTable users={users} searchParams={searchParams} />
      <Pagination
        itemCount={userCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Users;
