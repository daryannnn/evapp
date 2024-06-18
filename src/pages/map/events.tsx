import EventsMap from "@/components/EventsMap";
import {Box} from "@mui/material";

export default function MapEvents() {
    return (
        <Box sx={{justifyContent: "center", margin: "0 auto"}}>
            <Box sx={{ flexGrow: 1 }} />
            <EventsMap user={"u7bg33K1sJT7vTjzrlSi3SKQbcA3"}/>
            <Box sx={{ flexGrow: 1 }} />
        </Box>
    )
}