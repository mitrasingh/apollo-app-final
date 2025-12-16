import { useState, useEffect } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";

export const useUserPhoto = (userId: string) => {
	const [creatorPhoto, setCreatorPhoto] = useState<string>();

	useEffect(() => {
		const fetchUserPhoto = async () => {
			try {
				const storage = getStorage();
				const storageRef = ref(storage, `user-photo/${userId}`);
				const creatorPhotoURL = await getDownloadURL(storageRef);
				setCreatorPhoto(creatorPhotoURL);
			} catch (error: any) {
				console.error(`Error fetching user photo: ${error.message}`);
			}
		};

		fetchUserPhoto();
	}, [userId]);

	return creatorPhoto;
};
