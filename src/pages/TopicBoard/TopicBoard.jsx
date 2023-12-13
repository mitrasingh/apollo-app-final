import { Container } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackTopics from "../../components/Error Fallback/ErrorFallbackTopics";
import TopicCardList from "./TopicCardList/TopicCardList";
import CreateTopicForm from "./CreateTopicForm/CreateTopicForm";
import styles from "./TopicBoard.module.css";

const TopicBoard = () => {
	// Boolean state of displaying CreateTopicForm.jsx component
	const [isCreateTopic, setIsCreateTopic] = useState(false);

	// Refreshes topic list when user posts a new topic via CreateTopicForm.jsx
	const [isTopicsRefreshed, setIsTopicsRefreshed] = useState(false);

	// Function sets the state of whether CreateTopicForm component will be displayed
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
				<TopicCardList isTopicsRefreshed={isTopicsRefreshed} />
			</ErrorBoundary>
		</Container>
	);
};

export default TopicBoard;