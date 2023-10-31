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
    if (!sheet) return Response.json({ success: "false" }, { status: 500 });

    const reqBody = await req.text();
    const body = JSON.parse(reqBody);

    if (!body) return Response.json({ success: "false" }, { status: 500 });

    const { charityA, charityB, charityC, charityD } = body;

    const ip = getUserIp(req);

    const createdAt = new Date().toISOString();

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
        return Response.json(
            { error: "Wait 10 minutes before submitting again!" },
            { status: 425 }
        );
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

export async function GET(req: NextRequest) {
    if (!sheet) return Response.json({ success: "false" }, { status: 500 });

    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? 1;
    const sortDirection = url.searchParams.get("sortDirection") ?? "desc";

    const response1 = await sheet.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Sheet1!A1:F",
    });

    if (!response1.data.values)
        return Response.json({ success: "false" }, { status: 500 });

    const numOfRecords = response1.data.values.length - 1;
    const numPages = Math.ceil((numOfRecords - 1) / 10);
    const latestRecord = response1.data.values[numOfRecords - 1];

    if (numOfRecords === 0) {
        return new Response(
            JSON.stringify({
                data: [],
                numPages,
                numOfRecords,
                latestRecord,
                totals: {
                    charityfATotal: 0,
                    charityfBTotal: 0,
                    charityfCTotal: 0,
                    charityfDTotal: 0,
                },
            })
        );
    }

    let sortRange = "";
    if (sortDirection === "asc") {
        sortRange = `Sheet1!A${+page === 1 ? 2 : +page * 10 - 8}:F${
            +page === 1 ? +page * 10 + 1 : +page * 10 + 1
        }`;
    } else {
        sortRange = `Sheet1!A${
            +page === 1
                ? numOfRecords < 10
                    ? 2
                    : numOfRecords - 8
                : numOfRecords - +page * 10 + 2 < 2
                ? 2
                : numOfRecords - +page * 10 + 2
        }:F${+page === 1 ? numOfRecords + 1 : numOfRecords - +page * 10 + 11}`;
    }

    const response = await sheet.spreadsheets.values.batchGet({
        spreadsheetId: sheetId,
        ranges: [
            sortRange,
            "Sheet1!A2:A",
            "Sheet1!B2:B",
            "Sheet1!C2:C",
            "Sheet1!D2:D",
        ],
    });

    if (!response.data.valueRanges)
        return Response.json({ success: "false" }, { status: 500 });

    const data = response.data.valueRanges[0].values;

    const charityATotal = response.data.valueRanges[1].values?.reduce(
        (acc: number, curr: number) => {
            return acc + +curr;
        },
        0
    );
    const charityBTotal = response.data.valueRanges[2].values?.reduce(
        (acc: number, curr: number) => {
            return acc + +curr;
        },
        0
    );
    const charityCTotal = response.data.valueRanges[3].values?.reduce(
        (acc: number, curr: number) => {
            return acc + +curr;
        },
        0
    );
    const charityDTotal = response.data.valueRanges[4].values?.reduce(
        (acc: number, curr: number) => {
            return acc + +curr;
        },
        0
    );

    return new Response(
        JSON.stringify({
            data,
            numPages,
            numOfRecords,
            latestRecord,
            totals: {
                charityATotal,
                charityBTotal,
                charityCTotal,
                charityDTotal,
            },
        })
    );
}
