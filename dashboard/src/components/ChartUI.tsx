import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from '../types/Dashboardtypes';

const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const arrLabels = ['A','B','C','D','E','F','G'];

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

   // Si hay datos de la API, usarlos; si no, usar datos originales
   const useApiData = data && data.hourly;
   
   const chartData = useApiData ? {
      values1: data.hourly.temperature_2m.slice(0, 24),
      values2: data.hourly.wind_speed_10m.slice(0, 24),
      labels: data.hourly.time.slice(0, 24).map(time => {
         const date = new Date(time);
         return `${date.getHours()}:00`;
      }),
      label1: `Temperatura (${data.hourly_units.temperature_2m})`,
      label2: `Viento (${data.hourly_units.wind_speed_10m})`,
      title: 'Pronóstico por Hora (24h)'
   } : {
      values1: arrValues1,
      values2: arrValues2,
      labels: arrLabels,
      label1: 'value1',
      label2: 'value2',
      title: 'Chart arrLabels vs arrValues1 & arrValues2'
   };

   return (
      <>
         <Typography variant="h5" component="div">
            {chartData.title}
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: chartData.values1, label: chartData.label1},
               { data: chartData.values2, label: chartData.label2},
            ]}
            xAxis={[{ scaleType: 'point', data: chartData.labels }]}
         />
      </>
   );
}