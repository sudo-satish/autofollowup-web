import PageLayout from "@/components/page-layout";
import { FollowUpForm } from "./follow-up-form";
import PageHeader from "@/components/page-header";

export default async function Page() {
    return (
        <PageLayout>
            <PageHeader rightMenu={[]} leftMenu={[]} title="Create Follow Up" showBackButton={true} backButtonHref="/dashboard/follow-up" />
            <FollowUpForm />
        </PageLayout>
    )
}
