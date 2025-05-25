import PageLayout from "@/components/page-layout";
import { ClientForm } from "../clients-form";
import PageHeader from "@/components/page-header";

export default async function Page() {
    return <PageLayout>
            <PageHeader rightMenu={[]} leftMenu={[]} title="Create Client" showBackButton={true} backButtonHref="/dashboard/clients" />
            <ClientForm />
        </PageLayout>
}