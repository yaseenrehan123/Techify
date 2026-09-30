/*
  Warnings:

  - You are about to drop the `SavedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_userClerkId_fkey";

-- DropTable
DROP TABLE "SavedPost";

-- CreateTable
CREATE TABLE "ViewedPost" (
    "postId" TEXT NOT NULL,
    "userClerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewedPost_pkey" PRIMARY KEY ("userClerkId","postId")
);

-- AddForeignKey
ALTER TABLE "ViewedPost" ADD CONSTRAINT "ViewedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedPost" ADD CONSTRAINT "ViewedPost_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
