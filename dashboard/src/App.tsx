//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { Grid, IconButton, createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IndicatorUI from './components/indicatorUI';
import HeaderUI from './components/HeaderUI'
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import ChatbotUI from './components/ChatbotUI';
import './App.css'

function App() {
   const [selectedOption, setSelectedOption] = useState<string | null>(null);
   const [darkMode, setDarkMode] = useState(false);
   const { data, loading, error } = useFetchData(selectedOption);

   const theme = useMemo(
      () =>
         createTheme({
            palette: {
               mode: darkMode ? 'dark' : 'light',
               primary: {
                  main: '#1976d2',
               },
               background: {
                  default: darkMode ? '#121212' : '#f5f5f5',
                  paper: darkMode ? '#1e1e1e' : '#ffffff',
               },
            },
         }),
      [darkMode],
   );

   const handleOptionSelect = (option: string) => {
      setSelectedOption(option);
   };

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1100 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
               {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
         </Box>
         <Grid container spacing={5} justifyContent={"center"} alignItems={"center"} sx={{ p: 4, minHeight: '100vh' }}>

            {/* Encabezado */}
            <Grid size={{ xs: 12, md: 12 }}>
               <HeaderUI />
            </Grid>
            {/* Alertas */}
            <Grid size={{ xs: 12, md: 12 }} >
               <AlertUI description="No se preveen lluvias" />

            </Grid>

            {/* Selector */}
            <Grid size={{ xs: 12, md: 3 }}><SelectorUI onOptionSelect={handleOptionSelect} />
            </Grid>

            {/* Indicadores */}
            {loading && <Grid size={{ xs: 12, md: 9 }}> Cargando datos del clima...</Grid>}
            {error && <Grid size={{ xs: 12, md: 9 }}>Error: {error}</Grid>}

            <Grid container size={{ xs: 12, md: 9 }} >

               <Grid size={{ xs: 12, md: 3 }}>
                  {data &&
                     (<IndicatorUI
                        title='Temperatura (2m)'
                        description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} />)
                  }

               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                  {data &&
                     (<IndicatorUI
                        title='Temperatura aparente'
                        description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} />)
                  }
               </Grid>

               <Grid size={{ xs: 12, md: 3 }}>
                  {data &&
                     (<IndicatorUI
                        title='Velocidad del viento'
                        description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} />) // implementar las otras opciones además de la temperatura
                  }
               </Grid>

               <Grid size={{ xs: 12, md: 3 }}>
                  {data &&
                     (<IndicatorUI
                        title='Humedad relativa'
                        description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} />)
                  }
               </Grid>

               <Grid size={{ xs: 12, md: 3 }}>
                  {/* IndicatorUI con la Temperatura aparente en °C' */}
               </Grid>

               <Grid size={{ xs: 12, md: 3 }}>
                  {/* IndicatorUI con la Velocidad del viento en km/h' */}
               </Grid>

               <Grid size={{ xs: 12, md: 3 }}>
                  {/* IndicatorUI con la Humedad relativa en %' */}
               </Grid>

            </Grid>

            {/* Gráfico */}
            <Grid sx={{ display: { xs: "none ", md: "block" } }} >
               <ChartUI data={data} loading={loading} error={error} />
            </Grid>

            {/* Tabla */}
            <Grid sx={{ display: { xs: "none ", md: "block" } }} >
               <TableUI data={data} loading={loading} error={error} />
            </Grid>


            {/* Información adicional */}
            <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

            {/* Chatbot */}
            <ChatbotUI activeCity={selectedOption} weatherData={data} />

         </Grid >
      </ThemeProvider>
   );

}

export default App;