import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { auth } from "../utils/firebase-config";
import { toast } from "react-toastify";

export const profileService = () => {
	// Firebase storage access
	const storage = getStorage();
	const storageRef = ref(storage);

	//Function for previewing photo
	const previewProfilePhoto = async (data: Blob) => {
		try {
			if (auth.currentUser) {
				const imageRef = ref(
					storageRef,
					`user-photo/temp-${auth.currentUser.uid}`
				);
				await uploadBytes(imageRef, data);
				const getURL = await getDownloadURL(imageRef);
				return getURL;
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Please try another photo!", {
				hideProgressBar: true,
			});
		}
	};
	//function for actually uploading the photo
	const submitProfilePhoto = async () => {};

	return { previewProfilePhoto, submitProfilePhoto };
};
