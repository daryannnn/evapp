import {collection, getDocs, getFirestore, orderBy, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";

const db = getFirestore(firebase_app)

export default async function getUsersEvents(id: string) {
    // @ts-ignore
    const q = query(collection(db, "Events"), where("organizerId", "==", id), orderBy("dateCreated", "desc"));
    let eventIds: Array<string> = [];
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        eventIds.push(doc.id)
    });

    return eventIds;
}