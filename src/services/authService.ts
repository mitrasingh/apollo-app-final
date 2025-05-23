import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { loginUser, logoutUser } from "../store/user/userSlice";
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
import { useNavigate, Link } from "react-router-dom";
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
					firstName: auth.currentUser.displayName,
					lastName: userData?.lastname,
					title: userData?.title,
					email: auth.currentUser.email,
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
			const guestCredential = await signInWithEmailAndPassword(
				auth,
				"guest@apollo.com",
				"guest123"
			);
			toast.success("Welcome to Apollo!", {
				hideProgressBar: true,
			});
			navigate("/home");
		} catch (error: any) {
			toast.error("Sorry, we are having some technical issues!");
			console.log(`Error: ${error.message}`);
		}
	};

	const retrievePassword = async (data: UserEmail) => {
		try {
			const inputEmailData = data.email;
			await sendPasswordResetEmail(auth, inputEmailData);
			return "Email has been sent!";
		} catch (error: any) {
			if (error.message === "Firebase: Error (auth/user-not-found).") {
				return "Email not found.";
			}
			console.log(`Error: ${error.message}`);
			return "An unexpected error occured.";
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
				if (docSnap.exists()) {
					dispatch(
						loginUser({
							userId: auth.currentUser.uid,
							userPhoto: userTempPhotoURL,
							firstName: data.firstname,
							lastName: data.lastname,
							title: data.title,
							email: auth.currentUser.email,
						})
					);
				}
			}
			toast.success("Your profile has been created");
			navigate("/photoupload");
		} catch (error: any) {
			if (error.message.includes("email-already-in-use")) {
				toast.error("This email is already registered!", {
					hideProgressBar: true,
				});
			} else {
				toast.error("Sorry, we are having some technical issues!", {
					hideProgressBar: true,
				});
			}
			console.log(`Error: ${error.message}`);
		}
	};

	return { login, logOut, guestLogin, retrievePassword, signupUser };
};
