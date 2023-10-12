import { Outlet, useLocation, Navigate } from "react-router-dom";
import { auth, db } from "../utils/firebase-config";
import { Navigation } from "../components/Navigation";
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { loginUser } from "../features/user/userSlice";

export const ProtectedRoute = () => {

  const location = useLocation();

  const dispatch = useDispatch()
  const storage = getStorage()
  const storageRef = ref(storage)

  // Loads user information to Redux user state
  useEffect(() => {
    getAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        signOut(auth);
      }
      try {
        if (user) {
          const userCustomPhotoRef = `user-photo/${user.uid}`;
          const photoRefCondition = userCustomPhotoRef ? userCustomPhotoRef : "user-photo/temporaryphoto.jpeg";
          const userPhotoURL = await getDownloadURL(ref(storageRef, photoRefCondition));
          const docRef = doc(db, "users", user.uid)
          const docSnap = await getDoc(docRef)
          const data = docSnap.data()
          dispatch(loginUser({
            userId: user.uid,
            userPhoto: userPhotoURL,
            firstName: user.displayName,
            lastName: data.lastname,
            title: data.title,
            email: user.email
          }))
        }
      } catch (error) {
        console.log(error)
      }
    }
    )
  }, [])

  return auth.currentUser ? (
    <>
      <Navigation />
      <Outlet />
    </>
  ) : (
    // Keep the previous navigation stack
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};