import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parse } from "csv-parse/sync";
import { parseAwsRow } from "@/services/csv/awsParser";
import { parseGcpRow } from "@/services/csv/gcpParser";
import { detectProvider } from "@/services/csv/detectProvider";
import { parseAzureRow } from "@/services/csv/azureParser";
import { getCurrentUser } from "@/lib/current-user";


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const user = await getCurrentUser();

  // 1️⃣ Validate file
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json(
      { error: "Only CSV files are allowed" },
      { status: 400 }
    );
  }

  console.log("File name:", file.name);
  console.log("File type:", file.type);
  console.log("File size:", file.size);

  // 2️⃣ Create Upload record
  const upload = await prisma.upload.create({
    data: {
      userId: user.id, // dev user
      filename: file.name,
      status: "PENDING",
    },
  });

  try {
    // 3️⃣ Mark processing
    await prisma.upload.update({
      where: { id: upload.id },
      data: { status: "PROCESSING" },
    });

    // 4️⃣ Read CSV text
    const csvText = await file.text();

    // 5️⃣ Parse CSV WITH HEADERS
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Optional safety check
    if (records.length === 0) {
      throw new Error("CSV contains no data rows");
    }

    // 6️⃣ Normalize rows (pure logic)
    const provider = detectProvider(Object.keys(records[0]));

const parser =
  (provider === "AWS"
    ? parseAwsRow
    : provider === "GCP"
    ? parseGcpRow
    : parseAzureRow);

const normalized = records.map(parser);



    // 7️⃣ Insert cost records
    await prisma.costRecord.createMany({
      data: normalized.map((r) => ({
        ...r,
        uploadId: upload.id,
      })),
    });

    // 8️⃣ Mark completed
    await prisma.upload.update({
      where: { id: upload.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ uploadId: upload.id });

  } catch (err) {
    console.error("Upload failed:", err);

    await prisma.upload.update({
      where: { id: upload.id },
      data: { status: "FAILED" },
    });

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const user = await getCurrentUser();

  const uploads = await prisma.upload.findMany({
    where: { userId: user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(uploads);
}

