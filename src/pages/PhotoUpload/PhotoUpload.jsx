import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/user/userSlice";
import { Container, Form, Card, Button, Row, Col, Stack, Image } from "react-bootstrap";
import { toast } from 'react-toastify';
import styles from "./PhotoUpload.module.css";

const PhotoUpload = () => {

	// State variable for users local data of chosen file
	const [userChosenFile, setUserChosenFile] = useState("");

	// The state of the chosen files URL 
	// (after being uploaded as a temporary image to database) allowing user to preview image 
	const [userPhoto, setUserPhoto] = useState("");

	// Authentication from firebase
	const auth = getAuth();

	// Redux management 
	const userState = useSelector((state) => state.user); // Access to Redux initial user state properties
	const dispatch = useDispatch(); // Redux function which dispatches actions to Redux store

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Firebase storage for access
	const storage = getStorage();
	const storageRef = ref(storage);

	// Loads temporary (generic) image from database storage
	useEffect(() => {
		const loadUserImage = async () => {
			const userPhoto = userState.userPhoto;
			setUserPhoto(userPhoto);
		};
		loadUserImage();
	}, []);

	// Upload temporary image and set photo state for display preview
	const handlePreviewPhoto = async (e) => {
		e.preventDefault();
		try {
			const imageRef = ref(storageRef, `user-photo/temp-${auth.currentUser.uid}`);
			await uploadBytes(imageRef, userChosenFile);
			const getURL = await getDownloadURL(imageRef);
			setUserPhoto(getURL);
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error("Please try another photo!", {
				hideProgressBar: true
			});
		}
	};

	// Confirm photo preview and make final by assigning photo to current user id
	const handleAcceptPhoto = async (e) => {
		e.preventDefault();
		try {
			if (!userChosenFile) { // If user triggers this function and has selected/previewed their image
				toast.error("Photo is required!", {
					hideProgressBar: true
				})
			} else {
				const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
				await uploadBytes(imageRef, userChosenFile);
				const userPhotoURL = await getDownloadURL(ref(storageRef, `user-photo/${auth.currentUser.uid}`));
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (auth && userPhotoURL && docSnap) {
					const data = docSnap.data();
					await updateDoc(docRef, {
						userPhoto: userPhotoURL,
					});
					dispatch(
						loginUser({
							userId: auth.currentUser.uid,
							userPhoto: userPhotoURL,
							firstName: auth.currentUser.displayName,
							lastName: data.lastname,
							title: data.title,
							email: auth.currentUser.email,
						}));
				}
				toast.success(`Welcome ${auth.currentUser.displayName} to Apollo!`)
				navigate("/home");
			}
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, we are having some technical issues!", {
				hideProgressBar: true
			})
		}
	};

	return (
		<Container className={styles.formContainer}>
			<h6 className="text-center">Welcome to</h6>
			<Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
				<Image
					src="/rocket_white.svg"
					width="50"
					height="50"
					alt="apollo logo"
				/>
				<h1 className="fw-bold">Apollo</h1>
			</Stack>
			<Form>
				<Card className={`mt-4 p-4 ${styles.customCard}`}>
					<Row>
						<h4 className="fw-bold text-center">
							User Photo Upload
						</h4>
						<h4 className="fs-6 text-center">
							Photo is required
						</h4>
					</Row>

					<Row>
						<Col className="mt-3 d-flex justify-content-center">
							<Image
								className="object-fit-cover"
								width="80px"
								height="80px"
								src={userPhoto}
								roundedCircle
							/>
						</Col>
					</Row>

					<Row className="mt-1 text-center">
						<Form.Group>
							<Form.Label className="mt-1 mb-3">
								Current photo for {userState.firstName} {userState.lastName}
							</Form.Label>
							<Form.Control
								className="fs-5"
								type="file"
								size="sm"
								onChange={(event) => setUserChosenFile(event.target.files[0])}
							/>
						</Form.Group>
					</Row>

					<Button
						className={`fw-bold mt-4 text-light fs-5 ${userChosenFile == 0 ? "disabled" : ""}`}
						variant="secondary"
						size="sm"
						type="submit"
						onClick={handlePreviewPhoto}
					>
						Preview Photo
					</Button>

					<Button
						className="fw-bold mt-3 text-light fs-5"
						variant="primary"
						size="sm"
						onClick={handleAcceptPhoto}
					>
						Accept and Continue
					</Button>
				</Card>
			</Form>
		</Container>
	);
};

export default PhotoUpload;
