import React, {useEffect} from "react";
import {
    Autocomplete,
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Select, TextField, ThemeProvider,
    Typography
} from "@mui/material";
import EventCard from "@/components/EventCard";
import getFollowedEvents from "@/firebase/getFollowedEvents";
import Link from "next/link";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
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
    id: string,
}

export default function UserEventsFeed(props: Props) {
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

    const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
    const [toDate, setToDate] = React.useState<Dayjs | null>(null);
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState<any>(null);

    let eventIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            eventIds = await getFollowedEvents(props.id);
            eventIds.map((postId: string) => {
                posts.push(
                    <Grid item xs={12} sm={6} xl={4}>
                        <EventCard id={postId} currentUserId={props.id}/>
                    </Grid>
                );
                // @ts-ignore
                setP(posts);
            })}
        getPosts();
    }, [])

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between", margin: "10px auto"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{padding: "10px", margin: "20px 0px",width: "15vw", minWidth: "200px"}}>
                    <Typography color={"text.secondary"}>Выберите спорт</Typography>
                    <FormControl fullWidth sx={{margin: "10px auto 15px auto"}}>
                        <InputLabel id="interests">Виды спорта</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={interest}
                            //onChange={(e) => handleInterest(e)}
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
                        //onChange={(newValue) => setFromDate(newValue)}
                    />
                    <DatePicker
                        sx={{margin: "10px auto 5px auto"}}
                        label="Дата, до" value={toDate}
                        //onChange={(newValue) => setToDate(newValue)}
                    />
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

            <Grid sx={{margin: "10px auto"}} container spacing={1} >
                {p}
            </Grid>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/"}>
                        <MenuItem>Новости</MenuItem>
                    </Link>
                    <MenuItem selected>Мероприятия</MenuItem>
                </MenuList>
            </Box>
        </Box>
        </ThemeProvider>
    );
}