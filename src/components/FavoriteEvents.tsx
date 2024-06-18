import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import EventCard from "@/components/EventCard";
import getFavoriteEvents from "@/firebase/getFavoriteEvents";

interface Props {
    id: string,
}

export default function FavoriteEvents(props: Props) {
    let eventIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            eventIds = await getFavoriteEvents(props.id);
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
        <Grid container spacing={1} >
            {p}
        </Grid>
    );
}