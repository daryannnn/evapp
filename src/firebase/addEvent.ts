import {
    addDoc, arrayUnion,
    collection,
    doc, GeoPoint,
    getCountFromServer,
    getFirestore,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {number} from "prop-types";
import {getStorage, ref, uploadBytes} from "@firebase/storage";

const db = getFirestore(firebase_app)
const storage = getStorage(firebase_app);

export const addEvent = async (title: string,
                               organizerId: string,
                              organizerName: string,
                              organizerType: string,
                               organizerProfilePhotoUrl: string,
                              description: string,
                               position: GeoPoint,
                              positionName: string,
                              dateFrom: Timestamp,
                               price: number,
                               categories: { [k: string]: boolean; },
                               image: File | null,
                               dateTo?: Timestamp,

) => {
    try {
        let newEvent;
        if (dateTo != undefined) {
            newEvent = await addDoc(collection(db, "Events"), {
                title,
                organizerId,
                organizerName,
                organizerType,
                description,
                dateFrom,
                price,
                dateTo,
                categories,
                position,
                positionName,
                dateCreated: Timestamp.fromDate(new Date()),
                likesCount: 0,
                organizerProfilePhotoUrl,
                imagesUrls: [],
            })
        } else {
            newEvent = await addDoc(collection(db, "Events"), {
                title,
                organizerId,
                organizerName,
                organizerType,
                description,
                dateFrom,
                price,
                categories,
                position,
                positionName,
                dateCreated: Timestamp.fromDate(new Date()),
                likesCount: 0,
                organizerProfilePhotoUrl,
                imagesUrls: [],
            })
        }

        if (image != null) {
            const storageRef = ref(storage, `images/events/` + newEvent.id + '/' + image.name);
            await uploadBytes(storageRef, image);
            await updateDoc(doc(db, "Events", newEvent.id), {
                imagesUrls: arrayUnion(`images/events/` + newEvent.id + '/' + image.name)
            });
        }

        const q = query(collection(db, "Events"), where("organizerId", "==", organizerId));
        const count = await getCountFromServer(q);
        await updateDoc(doc(getFirestore(firebase_app), "Users", organizerId), {
            eventsCount: count.data().count,
        });

    } catch (err) {
        console.error(err)
    }
}