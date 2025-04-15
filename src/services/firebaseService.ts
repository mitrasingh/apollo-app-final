import {
	browserSessionPersistence,
	setPersistence,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/user/userSlice";
import { SignInProps } from "../models/SignInProps";

// Redux function which will dispatch actions needed for user state changes
const dispatch = useDispatch();

// Instance created from firebase authentication
const userAuth = auth;

// React router function allows user to navigate to specified route
const navigate = useNavigate();

export const firebaseSignIn = async (data: SignInProps) => {
	try {
		if (!userAuth.currentUser) {
			console.log("No user found");
		} else {
			// Sets parameters for user to be logged out if window/tab is closed
			await setPersistence(userAuth, browserSessionPersistence);
			await signInWithEmailAndPassword(userAuth, data.email, data.password);
			const docRef = doc(db, "users", userAuth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			const userData = docSnap.data();
			// Assigns default values to Redux user state
			dispatch(
				loginUser({
					userId: userAuth.currentUser.uid,
					userPhoto: userData?.userPhoto,
					firstName: userAuth.currentUser.displayName,
					lastName: userData?.lastname,
					title: userData?.title,
					email: userAuth.currentUser.email,
				})
			);
			toast.success(
				`Hell ${userAuth.currentUser.displayName}, you are logged in!`,
				{
					hideProgressBar: true,
				}
			);
			navigate("/home");
		}
	} catch (error) {
		if (error.message.includes("user-not-found")) {
			toast.error("User not found!");
		} else if (error.message.includes("wrong-password")) {
			toast.error("Password is incorrect!");
		} else {
			toast.error("Sorry, we are having some technical issues!");
		}
		console.log(`Error: ${error.message}`);
	}
};
