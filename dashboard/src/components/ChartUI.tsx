import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from '../types/Dashboardtypes';

interface ChartUIProps {
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string;
}

export default function ChartUI({ data, loading, error }: ChartUIProps) {

   // Si hay loading o error, mostrar mensajes
   if (loading) {
      return (
         <>
            <Typography variant="h5" component="div">
               Cargando gráfico...
            </Typography>
         </>
      );
   }

   if (error) {
      return (
         <>
            <Typography variant="h5" component="div" color="error">
               Error: {error}
            </Typography>
         </>
      );
   }

   // Si no hay datos (porque no se ha seleccionado ciudad), mostrar mensaje
   if (!data || !data.hourly) {
      return (
         <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 5 }}>
            Seleccione una ciudad para ver el gráfico 🌤️
         </Typography>
      );
   }

   const chartData = {
      values1: data.hourly.temperature_2m.slice(0, 24),
      values2: data.hourly.wind_speed_10m.slice(0, 24),
      labels: data.hourly.time.slice(0, 24).map(time => {
         const date = new Date(time);
         return `${date.getHours()}:00`;
      }),
      label1: `Temperatura (${data.hourly_units.temperature_2m})`,
      label2: `Viento (${data.hourly_units.wind_speed_10m})`,
      title: 'Pronóstico (24 Horas)'
   };

   return (
      <>
         <Typography variant="h6" component="div" gutterBottom>
            {chartData.title}
         </Typography>
         <LineChart
            height={300}
            grid={{ horizontal: true }}
            series={[
               {
                  data: chartData.values1,
                  label: chartData.label1,
                  color: '#E65100', // Dark Orange
                  showMark: false,
                  curve: "linear"
               },
               {
                  data: chartData.values2,
                  label: chartData.label2,
                  color: '#0288D1', // Light Blue
                  showMark: false,
                  curve: "linear"
               },
            ]}
            xAxis={[{ scaleType: 'point', data: chartData.labels }]}
            sx={{
               '.MuiLineElement-root': { strokeWidth: 2 },
            }}
         />
      </>
   );
}