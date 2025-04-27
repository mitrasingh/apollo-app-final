import { auth, db } from "../utils/firebase-config";
import { SignInProps } from "../models/SignInProps";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const login = async (data: SignInProps) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			data.email,
			data.password
		);
		// const docRef = doc(db, "users", auth.currentUser.uid);
		// const docSnap = await getDoc(docRef);
		// const userData = docSnap.data();
		/* docRef, docSnap -> userData will be sent to Redux state allowing me to reuse 
			 data throughout app without making repetitive api calls */
		return console.log(`User name ${auth.currentUser?.displayName}`);
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
		return console.log(
			`User name ${auth.currentUser?.displayName} is logged in!`
		);
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export { login, logOut, guestLogin };
