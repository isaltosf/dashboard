import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react";

interface SelectorProps {
    onOptionSelect: (option: string) => void;
}

export default function SelectorUI({ onOptionSelect }: SelectorProps) {
    const [cityInput, setCityInput] = useState('');


    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        setCityInput(selectedValue);
        onOptionSelect(selectedValue);
    }


    return (
        <FormControl fullWidth>
            <InputLabel id="city-select-label">Ciudad</InputLabel>
            <Select

                labelId="city-select-label"
                id="city-simple-select"
                label="Ciudad"
                value={cityInput}
                onChange={handleChange}
            >
                <MenuItem disabled><em> Seleccione una Ciudad</em></MenuItem>
                <MenuItem value={"Guayaquil"}><em> Guayaquil</em></MenuItem>
                <MenuItem value={"Quito"}><em> Quito</em></MenuItem>
                <MenuItem value={"Manta"}><em> Manta</em></MenuItem>

            </Select>
            {cityInput && (
                <p>
                    Información del clima en
                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}> {cityInput} </span>
                </p>
            )}

        </FormControl>
    )
}