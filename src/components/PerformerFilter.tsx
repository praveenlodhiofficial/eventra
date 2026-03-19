"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ActionButton2 } from "./ui/action-button";

type Props = {
  roles: string[];
};

export function PerformerFilter({ roles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get("role");

  const handleFilter = (role: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      <ActionButton2
        variant={!currentRole ? "default" : "secondary"}
        className="cursor-pointer rounded-full whitespace-nowrap"
        onClick={() => handleFilter(null)}
      >
        All Performers
      </ActionButton2>
      {roles.map((role) => (
        <ActionButton2
          key={role}
          variant={currentRole === role ? "default" : "secondary"}
          className="cursor-pointer rounded-full whitespace-nowrap capitalize"
          onClick={() => handleFilter(role)}
        >
          {role}
        </ActionButton2>
      ))}
    </div>
  );
}
