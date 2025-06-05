import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import DeviceStatus from "./components/DeviceStatus";
import Charts from "./components/Charts";

function App() {
  const devicesToShow = 4;

  const sampleData = [
    { id: 0, timestamp: "2024-06-01 10:00", temperature: 20, pressure: 1010, humidity: 50 },
    { id: 1, timestamp: "2024-06-01 12:00", temperature: 22, pressure: 1013, humidity: 55 },
    { id: 2, timestamp: "2024-06-02 14:30", temperature: 23, pressure: 1012, humidity: 54 },
    { id: 3, timestamp: "2024-06-03 08:15", temperature: 21, pressure: 1011, humidity: 56 },
    { id: 4, timestamp: "2024-06-03 10:00", temperature: 20, pressure: 1010, humidity: 53 },
    { id: 5, timestamp: "2024-06-04 09:00", temperature: 19, pressure: 1009, humidity: 52 },
  ];

  const latestDataById = sampleData.reduce<Record<number, typeof sampleData[0]>>((acc, entry) => {
    if (!acc[entry.id] || new Date(entry.timestamp) > new Date(acc[entry.id].timestamp)) {
      acc[entry.id] = entry;
    }
    return acc;
  }, {});

  const devicesToRender = Object.values(latestDataById).slice(0, devicesToShow);

  return (
    <div className="app-container">
      <Navbar />

      <div className="main-section">
        <DeviceStatus data={latestDataById[0]} />
        <Charts data={sampleData} />
      </div>

      <hr className="separator" />

      <div className="device-grid">
        {devicesToRender.map((data) => (
          <DeviceStatus key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
}

export default App;
