import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { type OpenMeteoResponse } from '../types/Dashboardtypes';

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   {
      field: 'label',
      headerName: 'Label',
      width: 125,
   },
   {
      field: 'value1',
      headerName: 'Value 1',
      width: 125,
   },
   {
      field: 'value2',
      headerName: 'Value 2',
      width: 125,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 100,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];

const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const arrLabels = ['A','B','C','D','E','F','G'];

interface TableUIProps {
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string;
}

function prepareApiData(data: OpenMeteoResponse) {
   const maxHours = 48;
   
   return data.hourly.time.slice(0, maxHours).map((time, index) => {
      const date = new Date(time);
      const horaFormateada = date.toLocaleString('es-ES', {
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });

      return {
         id: index,
         label: horaFormateada,
         value1: data.hourly.temperature_2m[index],
         value2: data.hourly.wind_speed_10m[index],
      };
   });
}

export default function TableUI({ data, loading, error }: TableUIProps) {

   // Si hay loading o error, mostrar mensajes
   if (loading) {
      return (
         <Box sx={{ height: 350, width: '100%' }}>
            <Typography> Cargando tabla...</Typography>
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ height: 350, width: '100%' }}>
            <Typography color="error">❌ Error: {error}</Typography>
         </Box>
      );
   }

   // Si hay datos de la API, usarlos; si no, usar datos originales
   const rows = (data && data.hourly) 
      ? prepareApiData(data)
      : combineArrays(arrLabels, arrValues1, arrValues2);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}