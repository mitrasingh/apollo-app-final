import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { loginUser, logoutUser } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import type { UserSignIn, UserEmail } from "../types/userdata.types";
import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export const authService = () => {
	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	const login = async (data: UserSignIn) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			if (auth.currentUser) {
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				const userData = docSnap.data();
				dispatch(
					loginUser({
						userId: auth.currentUser.uid,
						userPhoto: userData?.userPhoto,
						firstName: auth.currentUser.displayName,
						lastName: userData?.lastname,
						title: userData?.title,
						email: auth.currentUser.email,
					})
				);
				toast.success(
					`Hello ${auth.currentUser?.displayName}, you are logged in!`,
					{
						hideProgressBar: true,
					}
				);
			}

			console.log(`User name ${auth.currentUser?.displayName}`);
			navigate("/home");
		} catch (error: any) {
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

	const retrievePassword = async (
		data: UserEmail,
		setModalAlertMessage: React.Dispatch<React.SetStateAction<string>>
	): Promise<void> => {
		try {
			const inputEmailData = data.email;
			await sendPasswordResetEmail(auth, inputEmailData);
			setModalAlertMessage("Email has been sent!");
		} catch (error: any) {
			if (error.message === "Firebase: Error (auth/user-not-found).") {
				setModalAlertMessage("Email not found.");
			}
			console.log(`Error: ${error.message}`);
		}
	};

	return { login, logOut, guestLogin, retrievePassword };
};
