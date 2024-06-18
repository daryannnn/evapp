import {YMaps, Map as MMap, Placemark} from "@pbe/react-yandex-maps";
import getCoordinates from "@/firebase/getCoordinates";
import React, {useEffect} from "react";
import {
    Autocomplete,
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputAdornment,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Select, SelectChangeEvent, TextField, ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import EventCard from "@/components/EventCard";
import {theme} from "@/utils/theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import getCoordinatesCat from "@/firebase/getCoordinatesCat";
import {useForcedRerendering} from "@mui/base/utils/useForcedRerendering";

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

const API_KEY = "591f4c84-c98b-4836-ae26-8f2297c7b425";

interface Props {
    user: string;
}

export default function EventsMap(props: Props){
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

    //const [coords, setCoords] = React.useState<number[][]>();
    const [coords, setCoords] = React.useState<Map<string, number[]>>(new Map());
    useEffect(() => {
        async function getCoords() {
            const coords = await getCoordinates();
            setCoords(coords);
        }
        /*async function getCatCoords() {
            await getCoordinatesCat(interest).then((ids) => {
                console.log(ids);
                setCoords(ids);
            });
        }*/
        if (interest.length <= 0) {
            getCoords().then(() => {
                console.log(coords);
            });
        } /*else {
            getCatCoords().then(() => {
                console.log("categories events")
            });
        }*/
        /*getCoords().then(() => {
            console.log(coords);
        });*/
    }, [interest]);
    const handleForm = async () => {
        console.log("h")
        await getCoordinatesCat(interest).then((ids) => {
            console.log(ids);
            setCoords(ids);
        });
    };

    const [open, setOpen] = React.useState(false);
    const [event, setEvent] = React.useState("");
    const handleClickOpen = (coord: any) => {
        setOpen(true);
        setEvent(coord);
    };

    const handleClose = () => {
        setOpen(false);
        //setEvent("")
    };

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{padding: "10px", margin: "30px 0px",width: "15vw", minWidth: "150px"}}>
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
                        value={price}
                        label={"Рублей, до"}
                        type={"number"}
                        variant={"outlined"}
                        sx={{ margin: "10px auto 15px auto"}}
                    />
                </Box>
            </LocalizationProvider>

            <Box>
                <Box sx={{
                    margin: "30px 10px 20px 10px",
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

                    <Button variant="contained" sx={{margin: "10px"}} onClick={handleForm}>
                        <SearchOutlinedIcon />
                    </Button>

                </Box>

                <Box sx={{margin: "30px 0 0 0"}}>
                    <YMaps
                        query={{
                            apikey: API_KEY,
                            lang: "ru_RU",
                            load: "package.full",
                        }}
                    >
                        <MMap
                            defaultState={{ center: [55.030202, 82.920429], zoom: 11 }}
                            width={"60vw"}
                            height={"70vh"}
                        >
                            {
                                (coords) ?
                                [...coords].map((coords) => {
                                    return (
                                        <Placemark
                                            key={coords[0]}
                                            geometry={coords[1]}
                                            onClick={() => {
                                                handleClickOpen(coords[0])
                                            }}
                                        />
                                    )
                                }) : <div></div>
                                /*coords?.map((coords, index) => {
                                    return (
                                        <Placemark
                                            key={index}
                                            geometry={coords}
                                            onClick={() => {
                                                alert("Вы нажали метку " + (coords));
                                            }}
                                        />
                                    )
                                })*/
                            }
                        </MMap>
                    </YMaps>
                </Box>
            </Box>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/map/organizations"}>
                        <MenuItem>Организации</MenuItem>
                    </Link>
                    <MenuItem selected>Мероприятия</MenuItem>
                </MenuList>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
            >

                <EventCard id={event} currentUserId={props.user} />

            </Dialog>

        </Box>
        </ThemeProvider>
    )
}