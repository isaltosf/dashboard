import { useEffect, useState } from "react";
import { type OpenMeteoResponse } from "../types/Dashboardtypes";

const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
    'Guayaquil': { latitude: -2.1962, longitude: -79.8862 },
    'Quito': { latitude: -0.1807, longitude: -78.4678 },
    'Manta': { latitude: -0.9500, longitude: -80.7333 }
};

export default function useFetchData(selectedOption: string | null) {
    const [data, setData] = useState<OpenMeteoResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedOption) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const cityConfig = CITY_COORDS[selectedOption];
                if (!cityConfig) throw new Error("City coordinates not found");

                const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature&timezone=auto`;

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
    }, [selectedOption]);

    return { data, loading, error };
}

