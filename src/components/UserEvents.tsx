import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import getUsersEvents from "@/firebase/getUsersEvents";
import EventCard from "@/components/EventCard";

interface Props {
    id: string,
    currentUserId: string,
}

export default function UserEvents(props: Props) {
    let eventIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            eventIds = await getUsersEvents(props.id);
            eventIds.map((postId: string) => {
                posts.push(
                    <Grid item xs={12} sm={6} xl={4}>
                        <EventCard id={postId} currentUserId={props.currentUserId}/>
                    </Grid>
                );
                // @ts-ignore
                setP(posts);
            })}
        getPosts();
    }, [])

    return (
        <Grid container spacing={1} >
            {p}
        </Grid>
    );
}