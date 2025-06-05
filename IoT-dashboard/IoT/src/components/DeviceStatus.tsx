import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import OpacityIcon from "@mui/icons-material/Opacity";

interface DeviceData {
  id: number;
  temperature: number;
  pressure: number;
  humidity: number;
}

const DeviceStatus = ({ data }: { data: DeviceData | null }) => {
  const hasData = !!data;

  return (
    <div className="device-status">
      <Typography variant="h5" component="div">
        Device No. {data?.id ?? "N/A"}
      </Typography>

      <Divider sx={{ backgroundColor: "white", margin: "10px 0" }} />

      {hasData ? (
        <>
          <Typography variant="h6" component="div">
            <DeviceThermostatIcon />
            <span className="value">{data?.temperature}</span> <span>&deg;C</span>
          </Typography>
          <Typography variant="h6" component="div">
            <CloudUploadIcon />
            <span className="value">{data?.pressure}</span> hPa
          </Typography>
          <Typography variant="h6" component="div">
            <OpacityIcon />
            <span className="value">{data?.humidity}</span>%
          </Typography>
        </>
      ) : (
        <Typography variant="h6" color="error">
          Brak danych
        </Typography>
      )}
    </div>
  );
};

export default DeviceStatus;
