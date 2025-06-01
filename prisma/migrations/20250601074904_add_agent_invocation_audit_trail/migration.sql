-- CreateTable
CREATE TABLE "AgentInvocationAuditTrail" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messages" JSONB NOT NULL,
    "response" JSONB NOT NULL,

    CONSTRAINT "AgentInvocationAuditTrail_pkey" PRIMARY KEY ("id")
);
