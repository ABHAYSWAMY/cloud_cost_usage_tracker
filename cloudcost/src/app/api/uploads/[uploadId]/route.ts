import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEV_USER_ID = "32468f30-2702-48cb-b2ac-823378204146";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  // ✅ FIX 1: await params
  const { uploadId } = await params;

  // 1️⃣ Verify upload belongs to user
  const upload = await prisma.upload.findFirst({
    where: {
      id: uploadId,
      userId: DEV_USER_ID,
    },
  });

  if (!upload) {
    return NextResponse.json(
      { error: "Upload not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Transaction: delete cost records + upload
  await prisma.$transaction([
    prisma.costRecord.deleteMany({
      where: { uploadId },
    }),
    prisma.upload.delete({
      where: { id: uploadId },
    }),
  ]);

  return NextResponse.json({
    success: true,
    deletedUploadId: uploadId,
  });
}

