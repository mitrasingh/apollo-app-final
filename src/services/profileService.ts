import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";

export const profileService = () => {
	// Firebase storage access
	const storage = getStorage();
	const storageRef = ref(storage);

	//Function for previewing photo
	const previewProfilePhoto = async (file: Blob) => {
		try {
			if (!auth.currentUser) {
				throw new Error("User not authenticated.");
			} else {
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
	//function for actually uploading the photo
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
					userPhoto: data,
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

	return { previewProfilePhoto, submitProfilePhoto };
};
