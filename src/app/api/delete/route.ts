import { NextRequest } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.text();
        const body = JSON.parse(reqBody);

        const rowNumber = body.rowNumber;
        console.log(rowNumber);

        if (!rowNumber) throw new Error("No row number provided");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(
                    /\\n/g,
                    "\n"
                ),
            },
            scopes: [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
            ],
        });

        const sheet = google.sheets({
            auth,
            version: "v4",
        });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        await sheet.spreadsheets.values.clear({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: `A${rowNumber}:F${rowNumber}`,
        });

        const requests = [
            {
                moveDimension: {
                    source: {
                        sheetId: 0,
                        dimension: "ROWS",
                        startIndex: rowNumber,
                    },
                    destinationIndex: rowNumber - 1,
                },
            },
        ];

        await sheet.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            requestBody: {
                requests: requests,
            },
        });

        return new Response('{"success": true}', { status: 200 });
    } catch (err: any) {
        console.log(err);
        return new Response(err.message, { status: 500 });
    }
}
