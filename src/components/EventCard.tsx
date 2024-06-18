import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {blue, yellow} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, Button, Dialog, DialogContent, Divider, Grid} from "@mui/material";
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {useEffect} from "react";
import getEventData from "@/firebase/getEventData";
import {onSnapshot, query} from "@firebase/firestore";
import {
    doc,
    getFirestore,
    updateDoc,
    increment,
    collection,
    where,
    setDoc,
    deleteDoc,
    getDoc, GeoPoint
} from "firebase/firestore";
import Link from "next/link";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

interface Props {
    id: string,
    currentUserId: string,
}

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

const API_KEY = "591f4c84-c98b-4836-ae26-8f2297c7b425";

export default function EventCard(props: Props) {
    //const currentUser = auth.currentUser;

    const [organizerId, setOrganizerId] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [price, setPrice] = React.useState(null);
    const [likesCount, setLikesCount] = React.useState(null);
    const [title, setTitle] = React.useState(null);
    const [dateFrom, setDateFrom] = React.useState(null);
    const [timeFrom, setTimeFrom] = React.useState(null);
    const [dateTo, setDateTo] = React.useState(null);
    const [timeTo, setTimeTo] = React.useState(null);
    const [interestsMap, setInterestsMap] = React.useState<Map<string, boolean>>(new Map());
    const [interest, setInterest] = React.useState<string[]>([]);
    const [imagesUrls, setImagesUrls] = React.useState<string[]>([]);
    const [position, setPosition] = React.useState<GeoPoint>();
    const [positionName, setPositionName] = React.useState("");
    const [organizerProfilePhotoUrl, setOrganizerProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getEvent() {
            const post = await getEventData(props.id);
            // @ts-ignore
            setOrganizerId(post.result.organizerId);
            // @ts-ignore
            setDescription(post.result.description);
            // @ts-ignore
            setDateFrom(post.result.dateFrom.toDate().toLocaleDateString());
            // @ts-ignore
            setTimeFrom(post.result.dateFrom.toDate().toLocaleTimeString());
            // @ts-ignore
            if (post.result.dateTo != null) {
                // @ts-ignore
                setDateTo(post.result.dateTo.toDate().toLocaleDateString());
                // @ts-ignore
                setTimeTo(post.result.dateTo.toDate().toLocaleTimeString());
            }
            // @ts-ignore
            setLikesCount(post.result.likesCount);
            // @ts-ignore
            setPrice(post.result.price);
            // @ts-ignore
            setTitle(post.result.title);
            // @ts-ignore
            setInterestsMap(new Map(Object.entries(post.result.categories)));
            // @ts-ignore
            setImagesUrls(post.result.imagesUrls);
            // @ts-ignore
            setPosition(post.result.position);
            // @ts-ignore
            setPositionName(post.result.positionName);
            // @ts-ignore
            setOrganizerProfilePhotoUrl(post.result.organizerProfilePhotoUrl);
        }
        getEvent();
    }, [props])

    /*const [address, setAddress] = React.useState<string>();
    useEffect(() => {
        (async () => {
            try {
                if (position) {
                    const coords: string = position.longitude + "," + position.latitude;
                    /*const res = await fetch(
                        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${coords}&results=1`
                    );
                    const res = await fetch(
                        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${coords}`
                    );
                    const data = await res.json();
                    const collection = data.response.GeoObjectCollection.featureMember.map(
                        (item: { GeoObject: any; }) => item.GeoObject
                    );
                    //console.log(collection);
                    /*const responseDesc = data.response.GeoObjectCollection.featureMember[0].GeoObject.description;
                    console.log(responseDesc);
                    const responseName = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                    console.log(responseName);
                    const responseText = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
                    console.log(responseText);
                    //setAddress(responseName + responseDesc);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [position]);*/

    const storage = getStorage(firebase_app);
    const [images, setImages] = React.useState<string[]>([]);
    useEffect(() => {
        if (imagesUrls.length > 0) {
            imagesUrls.map(url => {
                const reference = ref(storage, url);
                getDownloadURL(reference).then((url) => {
                    setImages(old => [...old, url])
                });
            })
        } else {
            setImages([])
        }
    }, [imagesUrls]);

    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (organizerProfilePhotoUrl.length > 0) {
            const reference = ref(storage, organizerProfilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        } else {
            setAvatar("")
        }
    }, [organizerProfilePhotoUrl]);

    useEffect(() => {
        setInterest([])
        if (interestsMap) {
            interestsMap.forEach((mapValue, key) => {
                if (mapValue) {
                    setInterest(old => [...old, key]);
                }
            })
        }
    }, [interestsMap]);

    const [liked, setLiked] = React.useState(false);
    function handleLiked() {
        updateDoc(doc(getFirestore(firebase_app), "Events", props.id), {
            likesCount: increment(1),
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Events", props.id, "Event UserIds Liked", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setLikesCount(likesCount+1)
    }
    function handleDisliked() {
        updateDoc(doc(getFirestore(firebase_app), "Events", props.id), {
            likesCount: increment(-1),
        });
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Events", props.id, "Event UserIds Liked", props.currentUserId));
        // @ts-ignore
        setLikesCount(likesCount-1)
    }

    const qLikes = query(collection(getFirestore(firebase_app), "Events", props.id, "Event UserIds Liked"), where("userId", "==", props.currentUserId));
    const isLiked = onSnapshot(qLikes, (querySnapshot) => {
        setLiked(!querySnapshot.empty);
    });

    const [favorite, setFavorite] = React.useState(false);
    function handleFavorite() {
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Events", props.id, "Event UserIds Favs", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User EventIds Favs", props.id), {
            eventId: props.id,
        });
    }
    function handleUnfavorite() {
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Events", props.id, "Event UserIds Favs", props.currentUserId));
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User EventIds Favs", props.id));
    }

    const qFavs = query(collection(getFirestore(firebase_app), "Events", props.id, "Event UserIds Favs"), where("userId", "==", props.currentUserId));
    const isFavs = onSnapshot(qFavs, (querySnapshot) => {
        setFavorite(!querySnapshot.empty);
    });

    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState("");

    const handleClickOpen = (image: string) => {
        setImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Card sx={{ maxWidth: 300, margin: "5px auto" }}>
            {
                (images.length > 0) ? (
                    <CardMedia
                        component="img"
                        height="175"
                        image={images[0]}
                        alt="image"
                        onClick={() => handleClickOpen(images[0])}
                    />
                ) : (
                    <Avatar sx={{ height: '175px', width: '300px', color: "primary.light" }} variant="square" >
                        <InsertPhotoIcon sx={{ fontSize: 160 }} />
                    </Avatar>
                )
            }
            <CardHeader
                avatar={
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${organizerId}`}>
                        {
                            (avatar.length > 0) ? (
                                <Avatar variant="rounded" src={avatar}>
                                    <AccountBoxIcon />
                                </Avatar>
                            ) : (
                                <Avatar sx={{ bgcolor: "primary.main" }} variant="rounded">
                                    <AccountBoxIcon />
                                </Avatar>
                            )
                        }
                    </Link>
                }
                title={
                    <Typography >{title}</Typography>
                }
                subheader={
                    <Box>
                        <Typography variant={"body2"} color={"text.secondary"}>{dateFrom} {timeFrom}</Typography>
                        <div>
                            {
                                (dateTo != null) ? (
                                    <div>
                                        <Typography variant={"body2"} color={"text.secondary"} display={"inline"}>-</Typography>
                                        <Typography variant={"body2"} color={"text.secondary"}>{dateTo} {timeTo}</Typography>
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                        <Typography variant={"body2"} color={"text.secondary"}>{positionName}</Typography>
                        <Box display={"flex"} justifyContent={"start"}>
                            <CurrencyRubleIcon sx={{height: "20px"}}/>
                            <Typography variant={"body2"} color={"text.secondary"}>{price}</Typography>
                        </Box>
                    </Box>
                }
            />
            <Divider />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <Divider />
            <CardActions >
                <div>
                    {
                        liked ? (
                            <IconButton onClick={handleDisliked} aria-label="like" sx={{ color: "red" }}>
                                <FavoriteIcon />
                                {likesCount}
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleLiked} aria-label="like">
                                <FavoriteIcon />
                                {likesCount}
                            </IconButton>
                        )
                    }
                </div>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{alignItems: "center"}}>
                <Grid container>
                    {
                        interest.map((i) => (
                                <Grid item key={i} xs="auto" >
                                    <Box sx={{ margin: "0 5px", padding: "2px 5px", borderRadius: 2, bgcolor: "primary.light" }}>
                                        {
                                            <div>{interests.find(val => val.value === i)?.rus}</div>
                                        }
                                    </Box>
                                </Grid>
                        ))
                    }
                </Grid>
                </Box>
                <Box sx={{ flexGrow: 1 }}/>
                <div>
                    {
                        favorite ? (
                            <IconButton onClick={handleUnfavorite} aria-label="like" sx={{ color: "yellow" }}>
                                <StarIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleFavorite} aria-label="like">
                                <StarIcon />
                            </IconButton>
                        )
                    }
                </div>
            </CardActions>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "80vw",  // Set your width here
                        },
                    },
                }}
            >
                <DialogContent sx={{justifyContent: "center"}}>
                    <img
                        src={image}
                        alt="image"
                        loading="lazy"
                        style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
}