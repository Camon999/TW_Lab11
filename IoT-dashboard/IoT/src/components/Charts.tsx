import { LineChart } from "@mui/x-charts/LineChart";

type DeviceData = {
    timestamp: string;
    temperature: number;
    pressure: number;
    humidity: number;
};

type Props = {
    data: DeviceData[];
};

const Charts = ({ data }: Props) => {
    if (!data || data.length === 0) return <p style={{ color: "#fff" }}>Brak danych do wyświetlenia.</p>;

    return (
        <div style={{ flex: 1, padding: "20px" }}>
            <LineChart
                width={600}
                height={300}
                series={[
                    { data: data.map((entry) => entry.pressure), label: "Pressure x10 [hPa]", color: "#008080" }, // Morski
                    { data: data.map((entry) => entry.humidity), label: "Humidity [%]", color: "#87CEEB" }, // Jasnoniebieski
                    { data: data.map((entry) => entry.temperature), label: "Temperature [°C]", color: "#FF69B4" }, // Różowy
                ]}
                xAxis={[{ scaleType: "point", data: data.map((entry) => entry.timestamp), label: "Time" }]}
                sx={{
                    ".MuiChartsAxis-tickLabel": { fill: "#fff !important" },
                    ".MuiChartsLegend-root": { fill: "#fff !important" },   // <- fill zamiast color
                    ".MuiChartsAxis-label": { fill: "#fff !important" },
                }}


            />
        </div>
    );
};

export default Charts;
