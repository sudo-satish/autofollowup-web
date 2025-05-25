import { Button } from "@/components/ui/button"
import { columns, Followup } from "./columns"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import prisma from "@/lib/prisma"

export default async function Page() {

	const data = await prisma.followup.findMany({
		orderBy: {
			createdAt: "desc"
		},
		include: {
			userClient: true,
			agent: true,
		},
	})

	console.log({
		data
	})

  return (
    <div>
        <div className="container mx-auto py-10">
            <div className="flex justify-end w-full">
            <Button asChild>
                <Link href="/dashboard/follow-up/create">Create</Link>
            </Button>

            </div>
        </div>
				<div className="container mx-auto py-10">
					<DataTable columns={columns} data={data} />
				</div>
    </div>
  )
}
