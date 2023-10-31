import { NextRequest } from "next/server";
import { google } from "googleapis";
import { getUserIp } from "@/lib/helpers";

let sheet: any;
try {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL!,
            private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        },
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
        ],
    });

    sheet = google.sheets({
        auth,
        version: "v4",
    });
} catch (e) {
    console.error(e);
}

const sheetId = process.env.GOOGLE_SHEET_ID!;

export async function POST(req: NextRequest) {
    const reqBody = await req.text();
    const body = JSON.parse(reqBody);

    if (!body) return { status: 400, body: "No body provided" };

    const { charityA, charityB, charityC, charityD } = body;

    const ip = getUserIp(req);

    const createdAt = new Date().toISOString();

    if (!sheet) return { status: 500, body: "Sheet not initialized" };

    await sheet.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "A2:F2",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[charityA, charityB, charityC, charityD, ip, createdAt]],
        },
    });

    return Response.json({ status: 200, body: "Success" });
}
