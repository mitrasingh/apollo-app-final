import { useState, useEffect } from "react";
import { Card, Row, Col, Image, Stack, Dropdown, CloseButton } from "react-bootstrap";
import { doc, getDoc, collection, query, getCountFromServer, where, deleteDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../../../utils/firebase-config";
import { toast } from "react-toastify";
import { useErrorBoundary } from "react-error-boundary";
import { convertToRelativeTime } from "../../../utils/date-config";
import EditTopicPost from "../EditTopicPost/EditTopicPost";
import DeleteModal from "../../../components/Modals/DeleteModal";
import Like from "../../../components/Like/Like";
import Spinner from "react-bootstrap/Spinner";
import { RootState } from "../../../store/store";
import { TopicDetailData } from "../../../types/topicdata.types";

type TopicPostProps = {
	id: string;
	isTopicRefreshed: boolean;
	setIsTopicRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
	isCommentsRefreshed: boolean;
};

const TopicPost = ({ id, isTopicRefreshed, setIsTopicRefreshed, isCommentsRefreshed }: TopicPostProps) => {
	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Stores document data fetched from database via fetchTopicData function
	const [topic, setTopic] = useState<TopicDetailData | null>(null);
	// Displays numbers of replies (or how many documents within "comments" subcollection)
	const [numOfComments, setNumOfComments] = useState<number>(0);
	console.log(topic);
	// Stores the formatted date
	const [displayTimeStamp, setDisplayTimeStamp] = useState<string>("");

	// Stores user photo URL fetched from firebase storage via fetchTopicData function
	const [userPhoto, setUserPhoto] = useState<string>("");

	// Confirms database document has property of isDocEdited as true
	const [isTopicEdited, setIsTopicEdited] = useState<boolean>(false);

	// Display edit fields for the topic description when set to true
	const [isEditTopicDisplayed, setIsEditTopicDisplayed] = useState<boolean>(false);

	// Catches error and returns to error boundary component (error component in parent (TopicDetailsPage component)
	const { showBoundary } = useErrorBoundary();

	// Firebase storage method and reference (used for fetching user photo url based off of userId prop)
	const storage = getStorage();
	const storageRef = ref(storage);

	// Redux state properties of current user (sets default properties when posting a comment)
	const currentUser = useSelector((state: RootState) => state.user);

	// State for displaying loader component
	const [isLoading, setIsLoading] = useState(true);

	// Fetch data of specific document id (via useParams()) from "topics" collection in firestore database
	useEffect(() => {
		const fetchTopicData = async () => {
			try {
				const docRef = doc(db, "topics", id);
				const docSnap = await getDoc(docRef);

				if (!docSnap.exists()) {
					// If user randomly types in a different URL extension, directs user to error component
					navigate("/error");
				}

				if (docSnap.exists()) {
					const data = docSnap.data();
					const userPhotoURL = await getDownloadURL(ref(storageRef, `user-photo/${data.userId}`));
					data.isDocEdited ? setIsTopicEdited(true) : setIsTopicEdited(false);
					setUserPhoto(userPhotoURL);
					setTopic(data as TopicDetailData);

					// Conversion of firestore timestamp to relative time
					const dateRelativeTime = convertToRelativeTime(data.datePosted);
					setDisplayTimeStamp(dateRelativeTime);
				}

				// Returns the total number of documents within the "comments" subcollection
				const commentsToQuery = query(collection(db, "comments"), where("topicId", "==", id));
				const snapshot = await getCountFromServer(commentsToQuery);
				setNumOfComments(snapshot.data().count);
			} catch (error: any) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTopicData();
	}, [isTopicRefreshed, isCommentsRefreshed]);

	// Deletes the entire topic including it's comments
	const [isVisible, setIsVisible] = useState(false);
	const handleShow = () => setIsVisible(true);
	const handleDeleteTopic = async () => {
		const documentRef = doc(db, "topics", id);
		try {
			await deleteDoc(documentRef);
			navigate("/topicboard");
			setIsVisible(false);
			toast.success("Topic has been deleted!");
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Could not delete topic!");
		}
	};

	// Navigates user back to the shoutboard page
	const handleCloseTopic = () => {
		navigate("/topicboard");
	};

	return (
		<>
			{isLoading ? (
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
			) : (
				<Card className="text-light">
					<Card.Header className="fs-6">
						<Row>
							<Col xs={10}>
								<Stack direction="horizontal" gap={2}>
									<Image className="object-fit-cover" height="30px" width="30px" src={userPhoto} roundedCircle />
									<Stack direction="vertical">
										<Card.Text className="my-0">Posted by:</Card.Text>
										<Card.Text>
											{topic?.firstName} {topic?.lastName}
										</Card.Text>
									</Stack>
								</Stack>
							</Col>
							<Col xs={2} className="d-flex justify-content-end">
								<Stack direction="horizontal" gap={2}>
									{topic?.userId === currentUser.userId ? (
										<>
											<Dropdown>
												<Dropdown.Toggle
													className="d-flex align-items-center text-light"
													split
													variant="primary"
													id="dropdown-split-basic"
												></Dropdown.Toggle>

												<Dropdown.Menu>
													<Dropdown.Item onClick={() => setIsEditTopicDisplayed(true)}>Edit</Dropdown.Item>
													<Dropdown.Item onClick={handleShow}>Delete</Dropdown.Item>
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
						<h5 className="fs-3 fw-bold">{topic?.title}</h5>
						<p className="fs-6">
							{isTopicEdited ? `Post edited` : `Posted`} {displayTimeStamp} | {numOfComments}
							{numOfComments === 1 ? " Reply" : " Replies"}
						</p>

						{isEditTopicDisplayed ? (
							<EditTopicPost
								setIsEditTopicDisplayed={setIsEditTopicDisplayed}
								description={topic?.description}
								id={id}
								setIsTopicRefreshed={setIsTopicRefreshed}
								setIsTopicEdited={setIsTopicEdited}
							/>
						) : (
							<p className="mt-4 fs-5">{topic?.description}</p>
						)}
					</Card.Body>
					<Card.Body className="py-0">
						<Like docId={id} />
					</Card.Body>
				</Card>
			)}
		</>
	);
};

export default TopicPost;
