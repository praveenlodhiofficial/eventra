"use server";

import { PerformerSummaryOutput } from "@/domains/performer/performer.schema";
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

export const searchPerformersByName = async (
  query: string,
  limit = 10
): Promise<PerformerSummaryOutput[]> => {
  return prisma.performer.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
};
