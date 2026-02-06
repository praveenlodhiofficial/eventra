"use server";

import prisma from "@/lib/prisma";

export const getPerformerById = async (id: string) => {
  return prisma.performer.findUnique({
    where: { id },
  });
};

export const getAllPerformers = async () => {
  return prisma.performer.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
};
