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

    if (!body) return Response.json({ success: "false" }, { status: 500 });

    const { charityA, charityB, charityC, charityD } = body;

    const ip = getUserIp(req);

    const createdAt = new Date().toISOString();

    if (!sheet) return Response.json({ success: "false" }, { status: 500 });

    const res = await sheet.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID!,
        range: "Sheet1!E2:E",
    });

    const lastRecord = res.data.values?.flat().lastIndexOf(ip);

    const res2 = await sheet.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID!,
        range: `Sheet1!F${lastRecord! + 2}`,
    });

    const lastRecordCreatedAt = res2.data.values?.flat()[0];

    const date = new Date(lastRecordCreatedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / 1000 / 60);
    console.log(diffMinutes);

    if (diffMinutes < 10) {
        console.log("ne mere");
        return Response.json({ error: "wait 10 minutes" }, { status: 403 });
    }

    await sheet.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "A2:F2",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[charityA, charityB, charityC, charityD, ip, createdAt]],
        },
    });

    return Response.json({ success: "true" }, { status: 200 });
}
