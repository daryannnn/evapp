import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    TextField, ThemeProvider
} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import React, {useEffect} from "react";
import dayjs, {Dayjs} from "dayjs";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/de';
import {doc, GeoPoint, getDoc, getFirestore, Timestamp} from "firebase/firestore";
import {addEvent} from "@/firebase/addEvent";
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import UserEvents from "@/components/UserEvents";
import Link from "next/link";
import {YMaps} from "@pbe/react-yandex-maps";
import {theme} from "@/utils/theme";

const categories = [
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

const API_KEY = "591f4c84-c98b-4836-ae26-8f2297c7b425";

interface Props {
    id: string,
    currentUserId: string,
    currentUserName: string,
}

export default function UserEventsSurface(props: Props) {
    categories.sort((a, b) => a.rus.localeCompare(b.rus))
    //const currentUser = auth.currentUser;

    const [own, setOwn] = React.useState(props.id == props.currentUserId);
    /*useEffect(() => {
        (props.id == currentUser?.uid) ? setOwn(true) : setOwn(false)
    }, [currentUser]);*/

    const [interest, setInterest] = React.useState<string[]>([]);
    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map([
        [ 'Running', false ],
        [ 'Aerobics', false ],
        [ 'Gym', false ],
        [ 'Tennis', false ],
        [ 'Martial arts', false ],
        [ 'Walking', false ],
        [ 'Cycling', false ],
        [ 'Dancing', false ],
        [ 'Fitness', false ],
        [ 'Swimming', false ],
        [ 'Yoga', false ],
        [ 'Body-building', false ],
        [ 'Soccer', false ],
        [ 'Hockey', false ],
        [ 'Volleyball', false ],
        [ 'Basketball', false ],
        [ 'Athletics', false ],
        [ 'Weightlifting', false ],
        [ 'Skiing', false ],
        [ 'Box', false ],
        [ 'Figure skating', false ],
        [ 'Gymnastics', false ],
        [ 'Chess', false ],
        [ 'Table tennis', false ],
    ]));
    const handleCategory = (event: SelectChangeEvent<typeof interest>) => {
        const {
            target: { value },
        } = event;
        setInterest(
            typeof value === 'string' ? value.split(',') : value,
        );
        const newMap = new Map<string, boolean>();
        interestsMap.forEach((mapValue, key) => {
            newMap.set(key, false)
            if (value.includes(key)) {
                newMap.set(key, true);
            }
        })
        setInterestsMap(newMap);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImage(null);
        setInterest([]);
        setValue("");
        setPrice(0);
    };

    const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(dayjs());
    const [dateTo, setDateTo] = React.useState<Dayjs | null>(null);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState<any>(0);
    const [type, setType] = React.useState();
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.currentUserId);
            const docSnap = await getDoc(docRef);
            setType(docSnap.get("userType"))
        }
        getType();
    }, [props]);

    const [rusType, setRusType] = React.useState("");
    const [name, setName] = React.useState();
    const [organizerProfilePhotoUrl, setOrganizerProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            (docSnap.get("userType") == "organization") ? (setRusType("организации")) : (setRusType("пользователя"))
        }
        async function getName() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            setName(docSnap.get("name"));
            setOrganizerProfilePhotoUrl(docSnap.get("profilePhotoUrl"))
        }
        getType();
        getName();
    }, [props]);

    const [image, setImage] = React.useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0])
        }
    };

    const [value, setValue] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [newCoords, setNewCoords] = React.useState([]);
    useEffect(() => {
        (async () => {
            try {
                if (value) {
                    const res = await fetch(
                        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${value}`
                    );
                    const data = await res.json();
                    const collection = data.response.GeoObjectCollection.featureMember.map(
                        (item: { GeoObject: any; }) => item.GeoObject
                    );
                    setOptions(() => collection);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [value]);

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        // @ts-ignore
        if (dateTo == null) {
            // @ts-ignore
            await addEvent(title, props.currentUserId, props.currentUserName, type, organizerProfilePhotoUrl, description, new GeoPoint(newCoords[0], newCoords[1]), value, Timestamp.fromDate(dateFrom.toDate() as Date), Number(price), Object.fromEntries(interestsMap), image)
            setDateFrom(dayjs());
        } else {
            // @ts-ignore
            await addEvent(title, props.currentUserId, props.currentUserName, type, organizerProfilePhotoUrl, description, new GeoPoint(newCoords[0], newCoords[1]), value, Timestamp.fromDate(dateFrom.toDate() as Date), Number(price), Object.fromEntries(interestsMap), image, Timestamp.fromDate(dateTo.toDate() as Date));
            setDateFrom(dayjs());
            setDateTo(null);
        }
        handleClose();
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper sx={{ maxWidth: 800, margin: "10px auto", padding: "0 0 10px 0", bgcolor: "primary.light" }}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <CalendarTodayIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}} />
                        <Typography  display="inline" variant="h6">Мероприятия&nbsp;</Typography>
                        <Typography  display="inline" variant="h6">{rusType}&nbsp;</Typography>
                        <Link style={{ textDecoration: 'none' }} href={`/profile/${props.id}`}>
                            <Typography  display="inline" variant="h6">{name}</Typography>
                        </Link>
                    </Box>
                    <div>
                        {
                            own ? (
                                <Button onClick={handleClickOpen} variant="contained" sx={{bgcolor: "#2E7D32"}}>
                                    <AddIcon sx={{color: "white"}}/>
                                    <Typography sx={{color: "white"}} variant="button">мероприятие</Typography>
                                </Button>) : (
                                <div>
                                </div>
                            )
                        }
                    </div>
                </Box>
                <YMaps
                    query={{
                        apikey: API_KEY,
                        lang: "ru_RU",
                        load: "package.full",
                    }}
                >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Новое мероприятие</DialogTitle>
                        <form onSubmit={handleForm}>
                            <DialogContent>
                                <TextField
                                    label="Название"
                                    variant="outlined"
                                    fullWidth
                                    margin={"normal"}
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <TextField
                                    label="Описание"
                                    variant="outlined"
                                    fullWidth
                                    margin={"normal"}
                                    multiline
                                    required
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                                <Autocomplete
                                    sx={{margin: "15px auto 10px auto"}}
                                    freeSolo
                                    filterOptions={(x) => x}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === "string") {
                                            setValue(() => newValue);
                                            const obg = options.find(
                                                (item: any) =>
                                                    newValue.includes(item.name) &&
                                                    newValue.includes(item.description)
                                            );
                                            // @ts-ignore
                                            const coords = obg.Point.pos
                                                .split(" ")
                                                .map((item: any) => Number(item))
                                                .reverse();
                                            setNewCoords(() => coords);
                                        } else {
                                            console.log(newValue);
                                        }
                                    }}
                                    onInputChange={(e) => {
                                        if (e) {
                                            // @ts-ignore
                                            setValue(e.target.value);
                                        }
                                    }}
                                    options={options.map((item: any) => `${item.name}, ${item.description}`)}
                                    //options={options.map((item: any) => `${item.metaDataProperty.GeocoderMetaData.text}`)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Адрес *" />
                                    )}
                                />

                                <DateTimePicker
                                    sx={{margin: "10px auto 5px auto"}}
                                    label="Дата начала мероприятия *"
                                    value={dateFrom}
                                    format="L HH:mm"
                                    onChange={(newValue) => setDateFrom(newValue)}
                                />
                                <DateTimePicker
                                    sx={{margin: "10px auto 5px auto"}}
                                    label="Дата конца мероприятия"
                                    value={dateTo}
                                    format="L HH:mm"
                                    onChange={(newValue) => setDateTo(newValue)}
                                />
                                <TextField
                                    inputProps={{ type: 'number'}}
                                    label="Стоимость, рублей"
                                    variant="outlined"
                                    margin={"normal"}
                                    defaultValue={0}
                                    required
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <FormControl fullWidth sx={{margin: "15px auto"}}>
                                    <InputLabel id="demo-multiple-name-label">Категории *</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        required
                                        value={interest}
                                        onChange={handleCategory}
                                        input={<OutlinedInput label="Категории" />}
                                    >
                                        {categories.map(({rus, value}, index) => (
                                            <MenuItem
                                                key={index}
                                                value={value}
                                            >
                                                {rus}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{margin: "10px 0 0 0"}}
                                >
                                    Добавить фото
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        multiple={false}
                                    />
                                </Button>
                                {
                                    image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            loading="lazy"
                                            style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                                        />
                                    ) : (
                                        <div></div>
                                    )
                                }
                            </DialogContent>
                            <DialogActions>
                                <Button sx={{color: "primary.dark"}} onClick={handleClose}>Отмена</Button>
                                {
                                    (title && description && newCoords && dateFrom && interest) ? (
                                        <Button sx={{color: "primary.dark"}} type="submit">Добавить</Button>
                                    ) : (
                                        <Button sx={{color: "primary.dark"}} disabled={true} type="submit">Добавить</Button>
                                    )
                                }
                            </DialogActions>
                        </form>
                    </Dialog>
                </LocalizationProvider>
                </YMaps>

                <UserEvents id={props.id} currentUserId={props.currentUserId}/>

            </Paper>
        </ThemeProvider>
    );
}