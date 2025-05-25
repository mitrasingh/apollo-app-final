import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { logoutUser } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import type { UserSignIn, UserEmail, UserData } from "../types/userdata.types";
import {
	browserSessionPersistence,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	setPersistence,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

export const authService = () => {
	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Firebase storage for access
	const storage = getStorage();
	const storageRef = ref(storage);

	const login = async (data: UserSignIn) => {
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);
			if (auth.currentUser) {
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				const userData = docSnap.data();
				return {
					userId: auth.currentUser.uid,
					userPhoto: userData?.userPhoto,
					firstName: userData?.firstname,
					lastName: userData?.lastname,
					title: userData?.title,
					email: userData?.email,
				};
			}
		} catch (error: any) {
			throw error;
		}
	};

	const logOut = async () => {
		try {
			await signOut(auth);
			dispatch(logoutUser());
			navigate("/");
			toast.info("You have been logged out!", {
				hideProgressBar: true,
			});
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
		}
	};

	const guestLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, "guest@apollo.com", "guest123");
		} catch (error: any) {
			throw error;
		}
	};

	const retrievePassword = async (data: UserEmail) => {
		try {
			const inputEmailData = data.email;
			await sendPasswordResetEmail(auth, inputEmailData);
		} catch (error: any) {
			throw error;
		}
	};

	const signupUser = async (data: UserData) => {
		try {
			await setPersistence(auth, browserSessionPersistence);
			await createUserWithEmailAndPassword(auth, data.email, data.password);
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, {
					displayName: data.firstname,
				});
				const photoRef = ref(storageRef, `user-photo/temporaryphoto.jpeg`);
				const userTempPhotoURL = await getDownloadURL(photoRef);
				const docRef = doc(db, "users", auth.currentUser.uid);
				await setDoc(docRef, {
					userId: auth.currentUser.uid,
					userPhoto: userTempPhotoURL,
					firstname: data.firstname,
					lastname: data.lastname,
					title: data.title,
					email: auth.currentUser.email,
				});
				const docSnap = await getDoc(docRef);
				const userData = docSnap.data();
				return {
					userId: auth.currentUser.uid,
					userPhoto: userTempPhotoURL,
					firstName: userData?.firstname,
					lastName: userData?.lastname,
					title: userData?.title,
					email: userData?.email,
				};
			}
		} catch (error: any) {
			throw error;
		}
	};

	return { login, logOut, guestLogin, retrievePassword, signupUser };
};
