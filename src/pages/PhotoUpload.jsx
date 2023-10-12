import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { Container, Form, Card, Button, Alert, Row, Col, Stack, Image } from "react-bootstrap";

export const PhotoUpload = () => {
	const [userPhoto, setUserPhoto] = useState(null); // Users' chosen file to upload
	const [photoURL, setPhotoURL] = useState(""); // Allows user to see how photo is displayed before upload
	const [isAlert, isSetAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	const auth = getAuth();
	const userState = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const storage = getStorage();
	const storageRef = ref(storage);

	useEffect(() => {
		const loadUserImage = async () => {
			const userTempPhotoURL = await getDownloadURL(ref(storageRef, "user-photo/temporaryphoto.jpeg"));
			setPhotoURL(userTempPhotoURL);
		};
		loadUserImage();
	}, []);

	// Upload temporary image and set photo state for display preview
	const handlePreviewPhoto = async (e) => {
		e.preventDefault();
		try {
			const imageRef = ref(storageRef, "user-photo/temp.jpeg");
			await uploadBytes(imageRef, userPhoto);
			const getURL = await getDownloadURL(imageRef);
			setPhotoURL(getURL);
		} catch (error) {
			isSetAlert(true);
			setAlertMessage(error.code);
			console.log(error.code);
		}
	};

	// Confirm photo preview and make final by assigning photo to current user id
	const handleAcceptPhoto = async (event) => {
		event.preventDefault();
		try {
			if (!userPhoto) {
				setAlertMessage("Photo upload is required.");
				isSetAlert((current) => !current);
			} else {
				const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
				await uploadBytes(imageRef, userPhoto);
				const userPhotoURL = await getDownloadURL(ref(storageRef, `user-photo/${auth.currentUser.uid}`));
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (auth && userPhotoURL && docSnap) {
					const data = docSnap.data();
					dispatch(
						loginUser({
							userId: auth.currentUser.uid,
							userPhoto: userPhotoURL,
							firstName: auth.currentUser.displayName,
							lastName: data.lastname,
							title: data.title,
							email: auth.currentUser.email,
						})
					);
				}
				navigate("/");
			}
		} catch (error) {
			isSetAlert((current) => !current);
			setAlertMessage(error.code);
			console.log(error.code);
		}
	};

	return (
		<>
			{isAlert ? (
				<Alert variant="danger" onClose={() => isSetAlert(false)} dismissible>
					<Alert.Heading>There is an error!</Alert.Heading>
					<p>Reason: {alertMessage}</p>
				</Alert>
			) : null}

			<Container
				style={{ maxWidth: "400px" }}
				className="mt-4 text-center d-flex justify-content-center"
			>
				<Form>
					<Card className="px-4 py-4">
						<Row>
							<h4 style={{ fontSize: "14px" }} className="fw-bold">
								User Photo Upload
							</h4>
						</Row>

						<Row className="mb-2 mt-2">
							<Col>
								<Stack direction="vertical">
									<Image
										style={{
											height: "80px",
											width: "80px",
											objectFit: "cover",
											borderRadius: "50%",
										}}
										src={photoURL}
										roundedCircle
									/>
								</Stack>
							</Col>
						</Row>

						<Row className="mb-3">
							<Form.Group>
								<Form.Label style={{ fontSize: "10px" }} className="mb-4">
									Current photo for {userState.firstName} {userState.lastName}
								</Form.Label>
								<Form.Control
									type="file"
									size="sm"
									onChange={(event) => setUserPhoto(event.target.files[0])}
								/>
							</Form.Group>
						</Row>

						<Row className="justify-content-center">
							<Button
								style={{
									fontSize: "10px",
									maxHeight: "30px",
									maxWidth: "130px",
								}}
								variant="secondary"
								size="sm"
								type="submit"
								onClick={handlePreviewPhoto}
							>
								Preview Photo
							</Button>
						</Row>

						<Row className="justify-content-center">
							<Button
								style={{
									fontSize: "10px",
									maxHeight: "30px",
									maxWidth: "130px",
								}}
								variant="primary"
								className="mt-2"
								size="sm"
								onClick={handleAcceptPhoto}
							>
								Accept and Continue
							</Button>
						</Row>
					</Card>
				</Form>
			</Container>
		</>
	);
};
