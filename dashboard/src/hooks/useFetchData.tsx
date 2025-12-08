import { useEffect, useState } from "react";
import { type OpenMeteoResponse } from "../types/Dashboardtypes";

export default function useFetchData() : OpenMeteoResponse | undefined{ 
    const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1894&longitude=-79.8889&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=America%2FChicago';

    const [data, setData] = useState<OpenMeteoResponse>();

    useEffect(() => { 
        const fetchData = async () => {
            const response = await fetch(URL);
            const json = await response.json();
            setData(json);
        };
        
        fetchData();
    }, [] );

    return data;

}

