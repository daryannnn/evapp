import UserEventsSurface from "@/components/UserEventsSurface";
import {getAuth, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";

const auth = getAuth(firebase_app);

export default function UsersEvents() {
    /*signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");
    if (auth.currentUser != null) {
        return (
            <>
                <UserEventsSurface id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserName={"Тренажерный зал"}/>
            </>
        )
    } else {
        return (
            <div></div>
        )
    }*/
    return (
        <UserEventsSurface id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserName={"Тренажерный зал"}/>
    )

}