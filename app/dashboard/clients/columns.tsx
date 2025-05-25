"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Client = {
  name: string
  phone: string
  countryCode: string
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorFn: (data) => `${data.countryCode}${data.phone}`,
    header: "Mobile number",
  },
]
