import { NextRequest } from "next/server";

export function getUserIp(req: NextRequest) {
    let ip = req.headers.get("X-Real-Ip");
    if (ip === "" || ip === null) {
        ip = req.headers.get("X-Forwarded-For");
    }
    if (ip === "" || ip === null) {
        ip = req.headers.get("CF-Connecting-IP");
    }

    return ip;
}
