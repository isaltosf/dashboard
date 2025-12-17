import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { type OpenMeteoResponse } from '../types/Dashboardtypes';

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

interface TableUIProps {
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string;
}

function prepareApiData(data: OpenMeteoResponse) {
   const maxHours = 24;

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

   // Si hay datos de la API, usarlos; si no, mostrar tabla vacía
   const rows = (data && data.hourly)
      ? prepareApiData(data)
      : [];

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