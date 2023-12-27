import { Outlet, useLocation, Navigate } from "react-router-dom";
import { auth } from "../../utils/firebase-config";
import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { db } from "../../utils/firebase-config";
import { logoutUser } from "../../store/user/userSlice";
import { loginUser } from "../../store/user/userSlice";
import { doc, getDoc } from "firebase/firestore";
import Navigation from "../Navigation/Navigation";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const ProtectedRoute = () => {

  // Hook from the react-router-dom to get the current location of a route 
  const location = useLocation();

  // Redux management 
  const dispatch = useDispatch(); // Redux function which dispatches actions to Redux store

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
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          const userData = docSnap.data();
          // Assigns default values to Redux user state
          dispatch(
            loginUser({
              userId: auth.currentUser.uid,
              userPhoto: userData.userPhoto,
              firstName: userData.firstname,
              lastName: userData.lastname,
              title: userData.title,
              email: userData.email,
            })
          );
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
      <ScrollToTop />
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />  // Redirects user to signin page from current location 
  );
};

export default ProtectedRoute;