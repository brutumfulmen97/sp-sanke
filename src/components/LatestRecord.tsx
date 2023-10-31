export default function LatestRecord({
    latestRecord,
}: {
    latestRecord: string[];
}) {
    return (
        <div className="flex gap-2 flex-wrap items-center justify-center mb-4">
            <h2 className="font-semibold">LATEST DONATION:</h2>
            <p>
                <span className="font-semibold">A:</span> {latestRecord[0]} Ft
            </p>
            <p>
                <span className="font-semibold">B:</span> {latestRecord[1]} Ft
            </p>
            <p>
                <span className="font-semibold">C:</span> {latestRecord[2]} Ft
            </p>
            <p>
                <span className="font-semibold">D:</span> {latestRecord[3]} Ft
            </p>
            <p>
                <span className="font-semibold">IP:</span> {latestRecord[4]}
            </p>
            <p>
                <span className="font-semibold">CREATED AT:</span>{" "}
                {latestRecord[5]}
            </p>
            <hr />
        </div>
    );
}
