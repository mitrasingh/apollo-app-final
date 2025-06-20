import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { UserProfile } from "../types/userdata.types";
import { updateEmail, updateProfile } from "firebase/auth";

export const profileService = () => {
	// Firebase storage access
	const storage = getStorage();
	const storageRef = ref(storage);

	// Function for previewing photo
	const previewProfilePhoto = async (file: Blob) => {
		try {
			if (!auth.currentUser) {
				throw new Error("User not authenticated.");
			} else {
				console.log(auth.currentUser);
				const imageRef = ref(
					storageRef,
					`user-photo/temp-${auth.currentUser.uid}`
				);
				await uploadBytes(imageRef, file);
				const getURL = await getDownloadURL(imageRef);
				return getURL;
			}
		} catch (error: any) {
			throw error;
		}
	};

	// Function for uploading the photo to DB and setting photo to user data object
	// Function also returns data object
	const submitProfilePhoto = async (file: Blob) => {
		try {
			if (!file) {
				throw new Error("Photo is required!");
			}
			if (!auth.currentUser) {
				throw new Error("User not authenticated.");
			}
			const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
			await uploadBytes(imageRef, file);
			const userPhotoURL = await getDownloadURL(
				ref(storageRef, `user-photo/${auth.currentUser.uid}`)
			);
			const docRef = doc(db, "users", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (userPhotoURL && docSnap) {
				const data = docSnap.data();
				await updateDoc(docRef, {
					userPhoto: userPhotoURL,
				});
				return {
					userId: auth.currentUser.uid,
					userPhoto: userPhotoURL,
					firstName: auth.currentUser.displayName,
					lastName: data?.lastname,
					title: data?.title,
					email: auth.currentUser.email,
				};
			} else {
				throw new Error("User data not found.");
			}
		} catch (error: any) {
			throw error;
		}
	};

	const updateUserProfileInfo = async (userId: string, data: UserProfile) => {
		try {
			if (!auth.currentUser) {
				throw new Error("User not authenticated.");
			}
			if (data.firstname !== auth.currentUser.displayName) {
				await updateProfile(auth.currentUser, {
					displayName: data.firstname,
				});
			}
			if (data.email !== auth.currentUser.email) {
				await updateEmail(auth.currentUser, data.email);
			}
			await updateDoc(doc(db, "users", userId), {
				firstname: data.firstname,
				lastname: data.lastname,
				title: data.title,
				email: data.email,
			});
		} catch (error: any) {
			throw error;
		}
	};

	return { previewProfilePhoto, submitProfilePhoto, updateUserProfileInfo };
};
