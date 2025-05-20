import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/user/userSlice";

import { toast } from "react-toastify";

export const profileService = () => {
	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Firebase storage access
	const storage = getStorage();
	const storageRef = ref(storage);

	// Redux management
	const userState = useSelector((state: RootState) => state.user); // Access to Redux initial user state properties
	const dispatch = useDispatch(); // Redux function which dispatches actions to Redux store

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
	const submitProfilePhoto = async (chosenFile: Blob) => {
		try {
			if (!chosenFile) {
				toast.error("Photo is required!", {
					hideProgressBar: true,
				});
			} else if (auth.currentUser) {
				const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
				await uploadBytes(imageRef, chosenFile);
				const userPhotoURL = await getDownloadURL(
					ref(storageRef, `user-photo/${auth.currentUser.uid}`)
				);
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (auth && userPhotoURL && docSnap) {
					const data = docSnap.data();
					await updateDoc(docRef, {
						userPhoto: data,
					});
					dispatch(
						loginUser({
							userId: auth.currentUser.uid,
							userPhoto: userPhotoURL,
							firstName: auth.currentUser.displayName,
							lastName: data?.lastname,
							title: data?.title,
							email: auth.currentUser.email,
						})
					);
				}
				toast.success(`Welcome ${auth.currentUser.displayName} to Apollo!`);
				navigate("/home");
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, we are having some technical issues!", {
				hideProgressBar: true,
			});
		}
	};

	return { previewProfilePhoto, submitProfilePhoto };
};
