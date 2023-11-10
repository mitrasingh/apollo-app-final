import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, Timestamp, getCountFromServer, deleteDoc, where, getDocs, orderBy } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { db } from "../utils/firebase-config";
import { useSelector } from "react-redux";
import { Container, Card, Row, Col, Image, Stack, Form, Button, Dropdown, CloseButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TopicIdContext } from ".././utils/TopicIdContext";
import { useForm } from "react-hook-form";
import { EditTopic } from "../components/EditTopic";
import { Like } from "../components/Like";
import { CommentCard } from "../components/CommentCard";
import { DeleteModal } from "../components/DeleteModal";
import { SyncLoader } from 'react-spinners';
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./TopicDetails.module.css";

export const TopicDetails = () => {

	// useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
	// This shared id also specifies the specific document to query within the "topics" collection of the database
	const { id } = useParams();

	// Stores document data fetched from database via fetchTopicData function
	const [topic, setTopic] = useState([]);

	// Stores fetched data from database "comments" sub-collection of document id via fetchComments function
	const [commentsArray, setCommentsArray] = useState([]);
	const sortComments = commentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Display edit fields for the topic description when set to true
	const [isEditTopicDisplayed, setIsEditTopicDisplayed] = useState(false);

	// Triggers refresh of all comments
	const [isCommentsRefreshed, setIsCommentsRefreshed] = useState(false);

	// Triggers refresh of fetchTopicData function
	const [isTopicRefreshed, setIsTopicRefreshed] = useState(false);

	//  Confirms user submitted change to topic when set to true
	const [isTopicEdited, setIsTopicEdited] = useState(false)

	// Stores user photo URL fetched from firebase storage via fetchTopicData function
	const [userPhoto, setUserPhoto] = useState("");

	// Displays numbers of replies (or how many documents within "comments" subcollection)
	const [numOfComments, setNumOfComments] = useState("");

	// Stores the formatted date
	const [displayTimeStamp, setDisplayTimeStamp] = useState("");

	// Firebase storage method and reference (used for fetching user photo url based off of userId prop)
	const storage = getStorage();
	const storageRef = ref(storage);

	// Redux state properties of current user (sets default properties when posting a comment)
	const currentUser = useSelector((state) => state.user);

	const [isLoading, setIsLoading] = useState(false);
	const spinnerStyle = {
		height: "90vh",
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}

	const navigate = useNavigate();

	// React hook form
	const form = useForm();
	const { register, handleSubmit, reset, formState } = form;
	const { errors, isSubmitSuccessful } = formState;

	// Fetch data of specific document id (via useParams()) from "topics" collection in firestore database
	useEffect(() => {
		const fetchTopicData = async () => {
			try {
				setIsLoading(true);
				const docRef = doc(db, "topics", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					const userPhotoURL = await getDownloadURL(
						ref(storageRef, `user-photo/${data.userId}`)
					);
					setUserPhoto(userPhotoURL);
					setTopic(data);

					// Conversion of firestore timestamp to dayjs fromNow method
					dayjs.extend(relativeTime);
					const convertTimeStamp = data.datePosted.toDate();
					const dateRelativeTime = dayjs(convertTimeStamp).fromNow();
					setDisplayTimeStamp(dateRelativeTime);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setTimeout(() => {
					setIsLoading(false);
				}, 500)
			}
		};
		fetchTopicData();
	}, [isTopicRefreshed]);

	// Maps out the "comments" collection
	useEffect(() => {
		const fetchComments = async () => {
			try {
				const commentsToQuery = query(
					collection(db, "comments"),
					where("topicId", "==", id),
					orderBy("datePosted", "desc")
				);
				const data = await getDocs(commentsToQuery);
				setCommentsArray(
					data.docs.map((doc) => ({ ...doc.data(), commentId: doc.id }))
				);
			} catch (error) {
				console.log(error);
			}
		};
		fetchComments();
	}, [isCommentsRefreshed]);


	// Adds a document to "comments" subcollection within firestore database ("topics"/specific ID/"comments"/ADDED DOCUMENT)
	const handlePostCommentButton = async (data) => {
		const myDate = new Date();
		const postTimeStamp = Timestamp.fromDate(myDate);
		try {
			await addDoc(collection(db, "comments"), {
				userId: currentUser.userId,
				userPhoto: currentUser.userPhoto,
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				userComment: data.postcomment,
				datePosted: postTimeStamp,
				topicId: id,
			});
			setIsCommentsRefreshed((current) => !current);
		} catch (error) {
			console.log(error);
		}
	};

	// Resets form field values
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	// Returns the total number of documents within the "comments" subcollection
	useEffect(() => {
		const getNumOfComments = async () => {
			try {
				const commentsToQuery = query(
					collection(db, "comments"),
					where("topicId", "==", id)
				);
				const snapshot = await getCountFromServer(commentsToQuery);
				setNumOfComments(snapshot.data().count);
			} catch (error) {
				console.log(error);
			}
		};
		getNumOfComments();
	}, [isCommentsRefreshed]);

	// Deletes the entire topic including it's comments
	const [isVisible, setIsVisible] = useState(false);
	const handleShow = () => setIsVisible(true);
	const handleDeleteTopic = async () => {
		const documentRef = doc(db, "topics", id);
		try {
			await deleteDoc(documentRef);
			navigate("/shoutboard");
			setIsVisible(false);
		} catch (error) {
			console.log(error);
		}
	};

	// Navigates user back to the shoutboard page
	const handleCloseTopic = () => {
		navigate("/shoutboard");
	};

	return (
		<>
			{isLoading ?
				<SyncLoader size={10} color="#ffa500" cssOverride={spinnerStyle} />
				:
				<Container className={`p-4 ${styles.customContainer}`}>
					<Card className="text-light">
						<Card.Header className="fs-6">
							<Row>
								<Col xs={10}>
									<Stack direction="horizontal" gap={2}>
										<Image
											height="30px"
											width="30px"
											src={userPhoto}
											roundedCircle
										/>
										<Stack direction="vertical">
											<Card.Text className="my-0">Posted by:</Card.Text>
											<Card.Text>{topic.firstName} {topic.lastName}</Card.Text>
										</Stack>
									</Stack>
								</Col>
								<Col xs={2} className="d-flex justify-content-end">
									<Stack direction="horizontal" gap={2}>
										{topic.userId === currentUser.userId ? (
											<>
												<Dropdown>
													<Dropdown.Toggle
														className="d-flex align-items-center text-light"
														split
														variant="primary"
														id="dropdown-split-basic"
													></Dropdown.Toggle>

													<Dropdown.Menu>
														<Dropdown.Item onClick={() => setIsEditTopicDisplayed(true)}>
															Edit
														</Dropdown.Item>
														<Dropdown.Item onClick={handleShow}>
															Delete
														</Dropdown.Item>
														{isVisible ? (
															<DeleteModal
																handleDelete={handleDeleteTopic}
																setIsVisible={setIsVisible}
																isVisible={isVisible}
																type={"topic"}
															/>
														) : null}
													</Dropdown.Menu>
												</Dropdown>
											</>
										) : null}
										<CloseButton onClick={handleCloseTopic} />
									</Stack>
								</Col>
							</Row>
						</Card.Header>

						<Card.Body>
							<h5 className="fs-3 fw-bold">{topic.title}</h5>
							<p className="fs-6">
								{isTopicEdited ? `Updated post` : `Posted`} {displayTimeStamp}  |  {numOfComments}
								{numOfComments === 1 ? " Reply" : " Replies"}
							</p>

							{isEditTopicDisplayed ? (
								<EditTopic
									setIsEditTopicDisplayed={setIsEditTopicDisplayed}
									description={topic.description}
									id={id}
									setIsTopicRefreshed={setIsTopicRefreshed}
									setIsTopicEdited={setIsTopicEdited}
								/>
							) : (
								<p className="mt-4 fs-5">
									{topic.description}
								</p>
							)}
						</Card.Body>
						<Card.Body className="py-0">
							<Like docId={id} />
						</Card.Body>
					</Card>

					<Form
						className="mt-3 text-light"
						onSubmit={handleSubmit(handlePostCommentButton)}
						noValidate
					>
						<Form.Group>
							<Form.Label className="fs-6">
								comment as {currentUser.firstName} {currentUser.lastName}
							</Form.Label>
							<Form.Control
								className="fs-5"
								maxLength={2000}
								rows={5}
								type="text"
								as="textarea"
								placeholder="What are your thoughts?"
								{...register("postcomment", {
									required: {
										value: true,
										message: "Post cannot be empty!",
									},
								})}
							/>
							<p className="mt-2 fs-6">{errors.postcomment?.message}</p>
						</Form.Group>
						<Row>
							<Col className="d-flex justify-content-end">
								<Button
									className={`d-flex align-items-center fs-6 fw-bold text-light ${styles.customBtn}`}
									variant="primary"
									size="sm"
									type="submit"
								>
									Post
								</Button>
							</Col>
						</Row>
					</Form>
					{sortComments.map((sortedComment) => {
						return (
							<TopicIdContext.Provider value={{ id, setIsCommentsRefreshed }} key={sortedComment.commentId}>
								<CommentCard comment={sortedComment} />
							</TopicIdContext.Provider>
						);
					})}
				</Container >
			}
		</>
	);
};
