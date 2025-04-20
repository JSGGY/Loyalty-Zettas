-- CreateTable
CREATE TABLE "Qualification" (
    "id" SERIAL NOT NULL,
    "donationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "qualityCalificationId" INTEGER NOT NULL,
    "generalScore" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityCalification" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,

    CONSTRAINT "QualityCalification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_qualityCalificationId_key" ON "Qualification"("qualityCalificationId");

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_qualityCalificationId_fkey" FOREIGN KEY ("qualityCalificationId") REFERENCES "QualityCalification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
