import {getFirestore, doc, getDoc, where, collection, getDocs, orderBy} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";
import React from "react";

const db = getFirestore(firebase_app)

export default async function getFollowedEvents(id: string) {
    let eventIds: Array<string> = [];
    let authorId: Array<string> = []
    const docRef = collection(db, "Users", id, "Followings Ids");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) =>{
        authorId.push(doc.get("userId"))
    });
    for (const id1 of authorId) {
        // @ts-ignore
        const q = query(collection(db, "Events"), where("organizerId", "==", id1), orderBy("dateCreated", "desc"));
        // @ts-ignore
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            eventIds.push(doc.id)
        });
    }

    return eventIds;
}