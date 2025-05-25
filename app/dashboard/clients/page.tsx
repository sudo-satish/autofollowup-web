import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "./columns";
import prisma from "@/lib/prisma";

export default async function Page() {
    const data = await prisma.userClient.findMany();

    console.log(data)

    return <PageLayout>
        <div className="container mx-auto">
            <div className="flex justify-end w-full">
                <Button asChild>
                    <Link href="/dashboard/clients/create">Create</Link>
                </Button>

            </div>
        </div>
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    </PageLayout>
}