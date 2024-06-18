import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function getFavoriteEvents(id: string) {
    let eventIds: Array<string> = [];
    const docRef = collection(db, "Users", id, "User EventIds Favs");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
        eventIds.push(doc.get("eventId"))
    });

    return eventIds;
}