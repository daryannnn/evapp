import EventCard from "@/components/EventCard";
import {getAuth, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import UserEventsSurface from "@/components/UserEventsSurface";

const auth = getAuth(firebase_app);

export default function Home() {
    signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");
    console.log(auth.currentUser?.uid);
  return (
    <>
        <UserEventsSurface id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserName={"Тренажерный зал"}/>
      <EventCard id={"WMoxxNPUAcBh2EXSeJbY"} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>
    </>
  )
}
