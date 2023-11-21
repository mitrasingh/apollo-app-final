import { Container } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackTopics from "../components/ErrorFallbackTopics";
import TopicCards from "../components/TopicCards";
import CreateTopicForm from "../components/CreateTopicForm";
import styles from "./TopicBoard.module.css";

export const TopicBoard = () => {
	// Invokes the display of CreateTopicForm.jsx component
	const [isCreateTopic, setIsCreateTopic] = useState(false);

	// Refreshes topic list when user posts a new topic via CreateTopicForm.jsx
	const [isTopicsRefreshed, setIsTopicsRefreshed] = useState(false);

	// Displays component CreateTopicForm.jsx w
	const handleCreateTopic = () => {
		!isCreateTopic ? setIsCreateTopic(true) : setIsCreateTopic(false);
	};

	return (
		<Container className={styles.customContainer}>
			<p className="fs-2 fw-bold d-flex justify-content-center text-light">Topic Board</p>
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

			<ErrorBoundary FallbackComponent={ErrorFallbackTopics}>
				<TopicCards isTopicsRefreshed={isTopicsRefreshed} />
			</ErrorBoundary>
		</Container>
	);
};

export default TopicBoard;