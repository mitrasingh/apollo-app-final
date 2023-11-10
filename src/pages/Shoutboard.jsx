import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import TopicCard from "../components/TopicCard";
import CreateTopicForm from "../components/CreateTopicForm";
import SyncLoader from 'react-spinners';
import styles from "./Shoutboard.module.css";

export const Shoutboard = () => {
	// Current state of data fetched from getTopics function
	const [topicArray, setTopicArray] = useState([]);

	// Triggers the display component of CreateTopicForm.jsx when user invokes an action
	const [isCreateTopic, setIsCreateTopic] = useState(false);

	// Triggers refresh topic list when user posts a new topic via CreateTopicForm.jsx
	const [isTopicsRefreshed, setIsTopicsRefreshed] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const spinnerStyle = {
		height: "90vh",
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}

	// Function that fetches data from database by querying "topics" collection
	useEffect(() => {
		const fetchTopics = async () => {
			try {
				setIsLoading(true);
				const dbRef = collection(db, "topics")
				const topicsData = await getDocs(query(dbRef))
				const topicsMap = topicsData.docs.map((doc) => ({ ...doc.data(), topicId: doc.id }))
				setTopicArray(topicsMap);
			} catch (error) {
				console.log(error);
			} finally {
				setTimeout(() => {
					setIsLoading(false);
				}, 500)
			}
		};
		fetchTopics();
	}, [isTopicsRefreshed]);

	// onClick function for displaying component CreateTopicForm.jsx
	const handleCreateTopic = () => {
		!isCreateTopic ? setIsCreateTopic(true) : setIsCreateTopic(false);
	};

	return (
		<>
			{isLoading ?
				<SyncLoader size={10} color="#ffa500" cssOverride={spinnerStyle} />
				:
				<Container className={styles.customContainer}>
					<p className="fs-2 fw-bold d-flex justify-content-center text-light">Shout Board</p>
					<Button
						className={`d-flex align-items-center justify-content-center fs-6 fw-bold text-light ms-3 mb-2 ${styles.customBtn}`}
						variant="primary"
						onClick={handleCreateTopic}
					>
						{!isCreateTopic ? "+ Create Topic" : "- Close"}
					</Button>

					{isCreateTopic ? (
						<CreateTopicForm
							setIsCreateTopic={setIsCreateTopic}
							setIsTopicsRefreshed={setIsTopicsRefreshed}
						/>
					) : null}

					{topicArray.map((topic) => {
						return <TopicCard topic={topic} key={topic.topicId} />;
					})}
				</Container>
			}
		</>
	);
};
