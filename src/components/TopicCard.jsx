import { Card, Col, Container, Row, Image, Stack } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { db } from "../utils/firebase-config";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./TopicCard.module.css";

export const TopicCard = (props) => {
	// receiving prop data from Shoutboard.jsx
	const { topic } = props;

	// retrieving photo url of user and saving it in a state
	const [creatorPhoto, setCreatorPhoto] = useState("");

	// displays numbers of comments (how many documents within "comments" collection)
	const [numOfComments, setNumOfComments] = useState("");

	// firebase storage method and reference (used for fetching user photo url based off of userId prop)
	const storage = getStorage();
	const storageRef = ref(storage);

	// function fetches users (userId) photo url address
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
				console.log(error);
			}
		};
		fetchUserPhoto();
	}, []);

	useEffect(() => {
		const getNumOfComments = async () => {
			try {
				// const coll = collection(db,"comments")
				const commentsToQuery = query(
					collection(db, "comments"),
					where("topicId", "==", topic.topicId)
				);
				const snapshot = await getCountFromServer(commentsToQuery);
				setNumOfComments(snapshot.data().count);
			} catch (error) {
				console.log(error);
			}
		};
		getNumOfComments();
	}, [numOfComments]);

	// Conversion of firestore timestamp to dayjs fromNow method
	dayjs.extend(relativeTime);
	const convertTimeStamp = topic.datePosted.toDate();
	const dateRelativeTime = dayjs(convertTimeStamp).fromNow();

	return (
		<Container className="mt-3">
			<Card className={styles.customCard}>
				<Card.Body className="fs-6">
					<Row>
						<Col xs={1}>
							<Image
								className={styles.customImage}
								height="35px"
								width="35px"
								src={creatorPhoto}
								roundedCircle
							/>
						</Col>

						<Col className="ms-1" xs={4}>
							<Stack direction="vertical">
								<Link to={topic.topicId.toString()} className="fw-bold fs-5">
									{topic.title.length > 20
										? `${topic.title.substring(0, 20)}...`
										: topic.title
									}
								</Link>
								<p>by {topic.firstName} {topic.lastName}</p>
							</Stack>
						</Col>

						<Col className="mt-2">
							posted {dateRelativeTime}
						</Col>

						<Col className="mt-2 d-flex justify-content-center">
							<Stack direction="horizontal" gap={2}>
								<Image
									className="mb-3"
									src="public/img/comments.svg"
									width="18"
									height="18"
									alt="comments icon"
								/>
								<p>{numOfComments} {numOfComments === 1 ? "Reply" : "Replies"}</p>
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
		description: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		userId: PropTypes.string.isRequired,
		topicId: PropTypes.string.isRequired,
		datePosted: PropTypes.object.isRequired
	})
};


