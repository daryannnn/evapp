import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)
export default async function getEventData(id: string) {
    let docRef = doc(db, "Events", id);

    let result = null;
    let error = null;

    try {
        result = (await getDoc(docRef)).data();
    } catch (e) {
        error = e;
    }

    return { result, error };
}