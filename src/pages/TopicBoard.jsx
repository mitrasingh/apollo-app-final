import { Container } from "react-bootstrap";
// import { useState } from "react";
// import { Button } from "react-bootstrap";
// import { collection, getDocs, query } from "firebase/firestore";
// import { db } from "../utils/firebase-config";
// import Spinner from 'react-bootstrap/Spinner';
// import { TopicCard } from "../components/TopicCard";
import TopicCards from "../components/TopicCards";
import ErrorFallback from "../components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary"
// import { CreateTopicForm } from "../components/CreateTopicForm";
import styles from "./TopicBoard.module.css";

export const TopicBoard = () => {
	// Current state of data fetched from getTopics function
	// const [topicArray, setTopicArray] = useState([]);

	// Triggers the display component of CreateTopicForm.jsx when user invokes an action
	// const [isCreateTopic, setIsCreateTopic] = useState(false);

	// Triggers refresh topic list when user posts a new topic via CreateTopicForm.jsx
	// const [isTopicsRefreshed, setIsTopicsRefreshed] = useState(false);

	// State for displaying loader component
	// const [isLoading, setIsLoading] = useState(true);

	// Function that fetches data from database by querying "topics" collection
	// useEffect(() => {
	// 	const fetchTopics = async () => {
	// 		try {
	// 			const dbRef = collection(db, "topics")
	// 			const topicsData = await getDocs(query(dbRef))
	// 			const topicsMap = topicsData.docs.map((doc) => ({ ...doc.data(), topicId: doc.id }))
	// 			setTopicArray(topicsMap);
	// 		} catch (error) {
	// 			console.log(error);
	// 		} finally {
	// 			setTimeout(() => {
	// 				setIsLoading(false);
	// 			}, 100)
	// 		}
	// 	};
	// 	fetchTopics();
	// }, [isTopicsRefreshed]);

	// onClick function for displaying component CreateTopicForm.jsx
	// const handleCreateTopic = () => {
	// 	!isCreateTopic ? setIsCreateTopic(true) : setIsCreateTopic(false);
	// };

	return (
		<Container className={styles.customContainer}>
			{/* {isLoading ?
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
				:
				<> */}
			<p className="fs-2 fw-bold d-flex justify-content-center text-light">Topic Board</p>
			{/* <Button
				className={`d-flex align-items-center justify-content-center fs-6 fw-bold text-light ms-3 mb-2 ${styles.customBtn}`}
				variant="primary"
				onClick={handleCreateTopic}
			>
				{!isCreateTopic ? "+ Create Topic" : "- Close"}
			</Button> */}

			{/* {isCreateTopic ? (
				<CreateTopicForm
					setIsCreateTopic={setIsCreateTopic}
					setIsTopicsRefreshed={setIsTopicsRefreshed}
				/>
			) : null} */}
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
			>
				<TopicCards />
			</ErrorBoundary>
			{/* {topicArray.map((topic) => {
						return <TopicCard topic={topic} key={topic.topicId} />;
					})} */}
			{/* </> */}
			{/* } */}
		</Container>
	);
};

export default TopicBoard;