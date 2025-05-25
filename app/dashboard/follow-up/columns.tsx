"use client"

import { Agent, UserClient } from "@/shared/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Followup = {
  userClient: UserClient
  agent: Agent
  followupDate: Date | null
  context: string | null
}

export const columns: ColumnDef<Followup>[] = [
  {
    accessorKey: "userClient.name",
    header: "Client",
  },
  {
    accessorKey: "agent.name",
    header: "Agent",
  },
  {
    accessorKey: "followupDate",
    header: "Followup Date & Time",
  },
  {
    accessorKey: "context",
    header: "Context",
  },
]
