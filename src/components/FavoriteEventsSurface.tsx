import {
    Autocomplete,
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import React, {lazy} from "react";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {blue} from "@mui/material/colors";
import FavoriteEvents from "@/components/FavoriteEvents";
import {theme} from "@/utils/theme";

const specializations = [
    'Бег',
    'Аэробика',
    'Тренажерный зал',
    'Теннис'
];

const cities = [
    { label: 'Москва'},
    { label: 'Санкт-Петербург'},
    { label: 'Новосибирск'},
];

interface Props {
    currentUserId: string,
}

export default function FavoriteEventsSurface(props: Props) {
    const [specialization, setSpec] = React.useState<string[]>([]);

    const handleSpec = (event: SelectChangeEvent<typeof specialization>) => {
        const {
            target: { value },
        } = event;
        setSpec(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [fromDate, setFromDate] = React.useState<Dayjs | null>();
    const [toDate, setToDate] = React.useState<Dayjs | null>();

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{padding: "10px", margin: "30px 0px", maxWidth: "20vw", minWidth: "150px"}}>
                    <Typography color={"text.secondary"}>Выберите спорт</Typography>
                    <FormControl fullWidth sx={{margin: "10px auto 15px auto"}}>
                        <InputLabel id="demo-multiple-name-label">Спорт</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={specialization}
                            onChange={handleSpec}
                            input={<OutlinedInput label="Специализация" />}
                        >
                            {specializations.map((i) => (
                                <MenuItem
                                    key={i}
                                    value={i}
                                >
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography color={"text.secondary"}>Выберите город</Typography>
                    <Autocomplete
                        disablePortal
                        id="city-box"
                        options={cities}
                        sx={{ margin: "10px auto 15px auto" }}
                        renderInput={(params) => <TextField {...params} label="Город" />}
                    />
                    <Typography color={"text.secondary"}>Выберите период</Typography>
                    <DatePicker
                        sx={{margin: "10px auto 5px auto"}}
                        label="Дата, от" value={fromDate}
                        onChange={(newValue) => setFromDate(newValue)}/>
                    <DatePicker
                        sx={{margin: "10px auto 5px auto"}}
                        label="Дата, до" value={toDate}
                        onChange={(newValue) => setToDate(newValue)}/>
                    <Typography sx={{margin: "5px auto 0 auto"}} color={"text.secondary"}>Выберите стоимость</Typography>
                    <TextField label={"Рублей, до"} type={"number"} variant={"outlined"} sx={{ margin: "10px auto 15px auto"}}/>
                </Box>
            </LocalizationProvider>

            <Paper sx={{ width:"55vw", margin: "30px auto", padding: "0 0 10px 0", bgcolor: "primary.light" }}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <CalendarTodayIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}}/>
                        <Typography sx={{margin: "4px 0 0 0"}} display="inline" variant="h6">Избранные мероприятия</Typography>
                    </Box>
                </Box>

                <FavoriteEvents id={props.currentUserId} />

            </Paper>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/posts"}>
                        <MenuItem>Публикации</MenuItem>
                    </Link>
                    <MenuItem selected>Мероприятия</MenuItem>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/programs"}>
                        <MenuItem>Услуги</MenuItem>
                    </Link>
                </MenuList>
            </Box>
        </Box>
        </ThemeProvider>
    )
}