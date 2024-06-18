import {collection, GeoPoint, getDocs, getFirestore, orderBy, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";

const db = getFirestore(firebase_app)

interface Place {
    coords: number[][],
    name: string,
    id: string,
}

export default async function getCoordinatesCat(interest: string[]) {
    // @ts-ignore
    const q = query(collection(db, "Events"));
    let coordinatesGeoPoint: Array<GeoPoint> = [];
    let coordinates: Array<number[]> = [];
    let coordsId: Map<string, number[]> = new Map<string, number[]>();
    let i = 0;
    let places: Array<Place> = [];
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        if (interest.length > 0) {
            let interestIds: Array<string> = [];
            // @ts-ignore
            const querySnapshot = await getDocs(query(collection(db, "Events")));
            querySnapshot.forEach((doc) => {
                const interestsMap: Map<string, boolean> = new Map(Object.entries(doc.get("categories")))
                interestsMap.forEach((value, key) => {
                    if (value && interest.includes(key)) {
                        interestIds.push(doc.id)
                    }
                })
            })
            if (interestIds.includes(doc.id)) {
                // @ts-ignore
                coordsId.set(doc.id, [doc.data().position.latitude, doc.data().position.longitude])
            }
            /*await Promise.all(eventsIds.map(async (userId, index) => {
                if (!interestIds.includes(userId)) {
                    delete eventsIds[index]
                }
            }))
            eventsIds = eventsIds.filter(function( element ) {
                return element !== undefined;
            });*/
        } else {
            // @ts-ignore
            coordsId.set(doc.id, [doc.data().position.latitude, doc.data().position.longitude])
        }
        // @ts-ignore
        coordinatesGeoPoint.push(doc.data().position)
        // @ts-ignore
        //coordsId.set(doc.id, [doc.data().position.latitude, doc.data().position.longitude])
    });

    coordinatesGeoPoint.forEach((point) => {
        coordinates[i] = [point.latitude, point.longitude]
        i++;
    })

    //return coordinates;
    return coordsId;
}