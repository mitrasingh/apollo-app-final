import { auth, db } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { loginUser } from "./../store/user/userSlice";
import { SignInProps } from "../models/SignInProps";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export const useAuth = () => {
	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	const login = async (data: SignInProps) => {
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
				// toast.success(
				// 	`Hello ${auth.currentUser?.displayName}, you are logged in!`,
				// 	{
				// 		hideProgressBar: true,
				// 	}
				// );
			}

			console.log(`User name ${auth.currentUser?.displayName}`);
			navigate("/home");
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const logOut = async () => {
		try {
			await signOut(auth);
			return console.log(`User logged out ${auth.currentUser?.displayName}`);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const guestLogin = async () => {
		try {
			const guestCredential = await signInWithEmailAndPassword(
				auth,
				"guest@apollo.com",
				"guest123"
			);
			console.log(`User name ${auth.currentUser?.displayName} is logged in!`);
			navigate("/home");
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	return { login, logOut, guestLogin };
};
