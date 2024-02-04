import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Stack } from "react-bootstrap";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { db } from "../../../utils/firebase-config";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useErrorBoundary } from "react-error-boundary";
import useDateConverter from "../../../hooks/useDateConverter";
import PropTypes from "prop-types";
import styles from "./TopicCard.module.css";

export const TopicCard = (props) => {
	// Receiving prop data from TopicCards.jsx
	const { topic } = props;

	// Retrieving photo url of user and saving it in a state
	const [creatorPhoto, setCreatorPhoto] = useState("");

	// Displays numbers of comments (how many documents within "comments" collection in database)
	const [numOfComments, setNumOfComments] = useState("");

	// Custom hook converts firestore timestamp into relative time from current time
	const { convertToRelativeTime } = useDateConverter();
	const dateRelativeTime = convertToRelativeTime(topic.datePosted);

	// Catches error and returns error boundary component (error component invoked in TopicBoard.jsx)
	const { showBoundary } = useErrorBoundary();

	// Firebase storage method and reference (used for fetching user photo url based off of userId prop)
	const storage = getStorage();
	const storageRef = ref(storage);

	// Function fetches users (userId) photo url address
	useEffect(() => {
		const fetchUserPhoto = async () => {
			try {
				const creatorPhotoURL = await getDownloadURL(
					ref(storageRef, `user-photo/${topic.userId}`)
				);
				if (creatorPhotoURL) {
					setCreatorPhoto(creatorPhotoURL);
				}
			} catch (error) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			}
		};
		fetchUserPhoto();
	}, []);

	// Function fetches number of comments for specific topic
	useEffect(() => {
		const getNumOfComments = async () => {
			try {
				const commentsToQuery = query(
					collection(db, "comments"),
					where("topicId", "==", topic.topicId)
				);
				const snapshot = await getCountFromServer(commentsToQuery);
				setNumOfComments(snapshot.data().count);
			} catch (error) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			}
		};
		getNumOfComments();
	}, [numOfComments]);

	return (
		<Container className="mt-3">
			<Card className={styles.customCard}>
				<Card.Header>
					<Row>
						<Col>
							<Link to={topic.topicId.toString()}>
								<Card.Text className="fw-bold fs-5 text-truncate">{topic.title}</Card.Text>
							</Link>
						</Col>
					</Row>
				</Card.Header>

				<Card.Body className="fs-6">
					<Row>
						<Col xs={5}>
							<Stack direction="horizontal" gap={2}>
								<Image
									className="object-fit-cover"
									height="35px"
									width="35px"
									src={creatorPhoto}
									roundedCircle
								/>
								<Stack direction="vertical">
									<Card.Text className="my-0">by:</Card.Text>
									<Card.Text className="my-0 fw-bold">{topic.firstName} {topic.lastName}</Card.Text>
								</Stack>
							</Stack>
						</Col>

						<Col xs={4} className={styles.mobileHidden}>
							<Card.Text className="my-0">{topic.isDocEdited ? `Post edited` : `Posted`}</Card.Text>
							<Card.Text className="my-0">{dateRelativeTime}</Card.Text>
						</Col>

						<Col xs={3}>
							<Stack direction="horizontal" gap={2} className="mt-1">
								<Image
									src="/comments.svg"
									width="18"
									height="18"
									alt="comments icon"
								/>
								<Card.Text>{numOfComments} {numOfComments === 1 ? "Reply" : "Replies"}</Card.Text>
							</Stack>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Container>
	);
};

TopicCard.propTypes = {
	topic: PropTypes.shape({
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		userId: PropTypes.string.isRequired,
		topicId: PropTypes.string.isRequired,
		datePosted: PropTypes.object.isRequired,
		isDocEdited: PropTypes.bool.isRequired
	})
};

export default TopicCard;


