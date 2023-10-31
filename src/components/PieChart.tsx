import { Pie } from "react-chartjs-2";

export default function PieChart({
    percents,
    totals,
}: {
    percents: Record<string, string>;
    totals: Record<string, number>;
}) {
    // const values = Object.values(data);
    // console.log(values);
    const chartData = {
        labels: [
            `A: ${percents.charityA}%`,
            `B: ${percents.charityB}%`,
            `C: ${percents.charityC}%`,
            `D: ${percents.charityD}%`,
        ],
        datasets: [
            {
                label: "Amount: ",
                data: [
                    totals.charityATotal,
                    totals.charityBTotal,
                    totals.charityCTotal,
                    totals.charityDTotal,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={chartData} />;
}
