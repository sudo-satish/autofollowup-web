-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "website" TEXT,
    "description" TEXT,
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_clerkId_key" ON "Company"("clerkId");
