import  FormControl  from "@mui/material/FormControl";
import  InputLabel from "@mui/material/InputLabel";
import Select, {type SelectChangeEvent} from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react";

export default function SelectorUI(){
    const [cityInput, setCityInput] = useState('');


    const handleChange = (event: SelectChangeEvent<string>) => {
        setCityInput(event.target.value)
    }


    return(
        <FormControl fullWidth>
            <InputLabel id = "city-select-label">Ciudad</InputLabel>
            <Select 
                
                labelId="city-select-label"
                id = "city-simple-select"
                label = "Ciudad"
                value = {cityInput}
                onChange = {handleChange}
            >
                <MenuItem disabled><em> Seleccione una Ciudad</em></MenuItem>
                <MenuItem value = {"guayaquil"}><em> Guayaquil</em></MenuItem>
                <MenuItem value = {"quito"}><em> Quito</em></MenuItem>
                <MenuItem value = {"manta"}><em> Manta</em></MenuItem>

            </Select>
            {cityInput && (
                <p> 
                    Información del clima en 
                    <span style = {{textTransform: 'capitalize', fontWeight: 'bold'}}> {cityInput} </span>
                </p>
            )}

        </FormControl>












    )
}