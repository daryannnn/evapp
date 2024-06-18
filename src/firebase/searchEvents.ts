import {collection, doc, documentId, getDoc, getDocs, getFirestore, orderBy, query, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {Dayjs} from "dayjs";

const db = getFirestore(firebase_app)

export default async function searchEvents(name: string, interest: string[], fromDate: Dayjs | null, toDate: Dayjs | null, price: number | null) {
    let eventsIds: Array<string> = [];

    const querySnapshotUsers = await getDocs(query(collection(db, "Events")));
    querySnapshotUsers.forEach((doc) => {
        eventsIds.push(doc.id);
    });

    if (fromDate) {
        let fromIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Events"), where("dateFrom", ">=", fromDate.toDate())));
        querySnapshot.forEach((doc) => fromIds.push(doc.id))
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!fromIds.includes(userId)) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (toDate) {
        let toIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Events"), where("dateFrom", "<=", toDate.toDate())));
        querySnapshot.forEach((doc) => toIds.push(doc.id))
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!toIds.includes(userId)) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (price) {
        let priceIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Events"), where("price", "<=", Number(price))));
        querySnapshot.forEach((doc) => priceIds.push(doc.id))
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!priceIds.includes(userId)) {
                delete eventsIds[index]
                //eventsIds.splice(index, 1);
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (name.length > 0) {
        await Promise.all(eventsIds.map(async (eventId, index) => {
            const docRef = doc(db, "Events", eventId);
            const docSnap = await getDoc(docRef);
            if (!((docSnap.get("title").toLowerCase()).match(new RegExp(name.toLowerCase())))) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (interest.length > 0) {
        let interestIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Events")));
        querySnapshot.forEach((doc) => {
            const interestsMap: Map<string, boolean> = new Map(Object.entries(doc.get("categories")))
            interestsMap.forEach((value, key) => {
                if (value && interest.includes(key)) {
                    interestIds.push(doc.id)
                }
            })
        })
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!interestIds.includes(userId)) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    return eventsIds;
}