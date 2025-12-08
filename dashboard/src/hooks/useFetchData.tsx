import { useEffect, useState } from "react";
import { type OpenMeteoResponse } from "../types/Dashboardtypes";

export default function useFetchData() {
    const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-1.25&longitude=-78.25&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&timezone=auto';

    const [data, setData] = useState<OpenMeteoResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(URL);
                const json = await response.json();
                setData(json);
            } catch (error) {
                setError(String(error))
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [] );

    return {data, loading, error};

}

