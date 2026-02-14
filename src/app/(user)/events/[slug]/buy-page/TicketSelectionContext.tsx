"use client";

import * as React from "react";

export type TicketTypeForSelection = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Selections = Record<string, number>;

type TicketSelectionContextValue = {
  ticketTypes: TicketTypeForSelection[];
  selections: Selections;
  setQuantity: (ticketTypeId: string, quantity: number) => void;
};

const TicketSelectionContext =
  React.createContext<TicketSelectionContextValue | null>(null);

export function TicketSelectionProvider({
  ticketTypes,
  children,
}: {
  ticketTypes: TicketTypeForSelection[];
  children: React.ReactNode;
}) {
  const [selections, setSelections] = React.useState<Selections>({});

  const setQuantity = React.useCallback(
    (ticketTypeId: string, quantity: number) => {
      setSelections((prev) => {
        if (quantity <= 0) {
          const next = { ...prev };
          delete next[ticketTypeId];
          return next;
        }
        return { ...prev, [ticketTypeId]: quantity };
      });
    },
    []
  );

  const value = React.useMemo(
    () => ({ ticketTypes, selections, setQuantity }),
    [ticketTypes, selections, setQuantity]
  );

  return (
    <TicketSelectionContext.Provider value={value}>
      {children}
    </TicketSelectionContext.Provider>
  );
}

export function useTicketSelection() {
  const ctx = React.useContext(TicketSelectionContext);
  if (!ctx) {
    throw new Error(
      "useTicketSelection must be used within TicketSelectionProvider"
    );
  }
  return ctx;
}
