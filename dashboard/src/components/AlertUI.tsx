import Alert from "@mui/material/Alert"

interface AlertConfig{
    description: string;
}

export default function AlertUI(configr:AlertConfig){
    return(
        <Alert variant="outlined"  severity="success"> {configr.description } </Alert>
    )


}