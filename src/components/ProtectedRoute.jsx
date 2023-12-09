import { Outlet, useLocation, Navigate } from "react-router-dom";
import { auth, db } from "../utils/firebase-config";
import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { loginUser, logoutUser } from "../features/user/userSlice";
import { Navigation } from "../components/Navigation";

export const ProtectedRoute = () => {

  // Hook from the react-router-dom to get the current location of a route 
  const location = useLocation();

  // Redux management 
  const dispatch = useDispatch(); // Redux function which dispatches actions to Redux store


  // Reference to firebase storage
  const storage = getStorage();
  const storageRef = ref(storage);

  // State variable which verifies the authentication of a user through firebase
  const [isLoggedIn, setIsLoggedIn] = useState(auth);


  // Listens for changes in authentication associated with the user
  useEffect(() => {
    getAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        signOut(auth);
        dispatch(logoutUser());
        setIsLoggedIn(false);
      }
      try {
        if (user) {
          setIsLoggedIn(auth);
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
        console.log(`Error: ${error.message}`);
      }
    });
  }, [])

  // Components shown if user is authenticated/not authenticated
  return isLoggedIn ? (
    <>
      <Navigation />
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />  // Redirects user to signin page from current location 

  );
};