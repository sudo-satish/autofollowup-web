import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Page() {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in")
    }
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}