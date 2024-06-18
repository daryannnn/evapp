import {
    Autocomplete,
    Box, Button,
    FormControl, Grid, InputAdornment,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Select, SelectChangeEvent, TextField, ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import React, {lazy, useEffect} from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import searchEvents from "@/firebase/searchEvents";
import EventCard from "@/components/EventCard";
import {theme} from "@/utils/theme";

const interests = [
    { rus: 'Бег', value: 'Running' },
    { rus: 'Аэробика', value: 'Aerobics' },
    { rus: 'Тренажерный зал', value: 'Gym' },
    { rus: 'Теннис', value: 'Tennis' },
    { rus: 'Боевые искусства', value: 'Martial arts' },
    { rus: 'Ходьба', value: 'Walking' },
    { rus: 'Велоспорт', value: 'Cycling' },
    { rus: 'Танцы', value: 'Dancing' },
    { rus: 'Фитнес', value: 'Fitness' },
    { rus: 'Плавание', value: 'Swimming' },
    { rus: 'Йога', value: 'Yoga' },
    { rus: 'Бодибилдинг', value: 'Body-building' },
    { rus: 'Футбол', value: 'Soccer' },
    { rus: 'Хоккей', value: 'Hockey' },
    { rus: 'Волейбол', value: 'Volleyball' },
    { rus: 'Баскетбол', value: 'Basketball' },
    { rus: 'Легкая атлетика', value: 'Athletics' },
    { rus: 'Тяжелая атлетика', value: 'Weightlifting' },
    { rus: 'Лыжный спорт', value: 'Skiing' },
    { rus: 'Бокс', value: 'Box' },
    { rus: 'Фигурное катание', value: 'Figure skating' },
    { rus: 'Гимнастика', value: 'Gymnastics' },
    { rus: 'Шахматы', value: 'Chess' },
    { rus: 'Настольный теннис', value: 'Table tennis' },
];

const cities = [
    { label: 'Москва'},
    { label: 'Санкт-Петербург'},
    { label: 'Новосибирск'},
];

interface Props {
    currentUserId: string,
}

export default function SearchEvents(props: Props) {
    interests.sort((a, b) => a.rus.localeCompare(b.rus))

    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [interest, setInterest] = React.useState<string[]>([]);
    useEffect(() => {
        if (interestsMap && interest.length == 0) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setInterest(old => [...old, key]);
                }
            })
        }
    }, [interestsMap]);
    const handleInterest = (event: SelectChangeEvent<typeof interest>) => {
        const {
            target: { value },
        } = event;
        setInterest(
            typeof value === 'string' ? value.split(',') : value,
        );
        const newMap = new Map<string, boolean>();
        if (interestsMap) {
            interestsMap.forEach((mapValue, key) => {
                newMap.set(key, false)
                if (value.includes(key)) {
                    newMap.set(key, true);
                }
            })
        }
        setInterestsMap(newMap);
    };

    const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
    const [toDate, setToDate] = React.useState<Dayjs | null>(null);
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState<any>(null);

    const [eventIds, setEventIds] = React.useState<string[]>([]);
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await searchEvents(name, interest, fromDate, toDate, price).then((ids) => {
            console.log(ids);
            setEventIds(ids);
        });
    };

    return (
        <ThemeProvider theme={theme}>
        <form onSubmit={handleForm}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{padding: "10px", margin: "30px 0px",width: "15vw", minWidth: "200px"}}>
                        <Typography color={"text.secondary"}>Выберите спорт</Typography>
                        <FormControl fullWidth sx={{margin: "10px auto 15px auto"}}>
                            <InputLabel id="interests">Виды спорта</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={interest}
                                onChange={(e) => handleInterest(e)}
                                input={<OutlinedInput label="Интересы" />}
                            >
                                {interests.map(({rus, value}, index) => (
                                    <MenuItem
                                        key={index}
                                        value={value}
                                    >
                                        {rus}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography color={"text.secondary"}>Выберите город</Typography>
                        <Autocomplete
                            disabled
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
                        <TextField
                            onChange={(newValue) => setPrice(newValue.target.value)}
                            label={"Рублей, до"}
                            type={"number"}
                            variant={"outlined"}
                            sx={{ margin: "10px auto 15px auto"}}
                        />
                    </Box>
                </LocalizationProvider>

                <Box>
                    <Box sx={{
                        margin: "30px auto",
                        width: "50vw",
                    }}>
                        <TextField
                            onChange={(newValue) => setName(newValue.target.value)}
                            id="input-with-icon-textfield"
                            placeholder="Поиск..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            sx={{
                                width: "40vw"
                            }}
                        />

                        <Button variant="contained" type={"submit"} sx={{margin: "10px"}}><SearchOutlinedIcon /></Button>
                    </Box>

                    <div>
                        {
                            eventIds.length > 0 && <Grid container spacing={1}>{eventIds.map((id) => (
                                <Grid item key={id} xs={12} md={6} xl={4}>
                                    <EventCard  id={id} currentUserId={props.currentUserId} />
                                </Grid>
                            ))}</Grid>
                        }
                    </div>
                </Box>

                <Box sx={{display: "flex", justifyContent: "end"}}>
                    <MenuList sx={{margin: "30px", width: "15vw"}}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/organizations"}>
                            <MenuItem>Организации</MenuItem>
                        </Link>
                        <MenuItem selected>Мероприятия</MenuItem>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/sportsmen"}>
                            <MenuItem>Спортсмены</MenuItem>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/programs"}>
                            <MenuItem>Услуги</MenuItem>
                        </Link>
                    </MenuList>
                </Box>

            </Box>
        </form>
        </ThemeProvider>
    )
}