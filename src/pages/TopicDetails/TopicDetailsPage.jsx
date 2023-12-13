import { useState } from "react";
import { Container } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import TopicPost from "../../components/TopicPost";
import CommentPostForm from "../../components/CommentPostForm";
import Comments from "../../components/Comments";
import ErrorFallbackTopicPost from "../../components/ErrorFallbackTopicPost";
import styles from "./TopicDetailsPage.module.css";

const TopicDetailsPage = () => {

	// State value of true will trigger fetchComments function in Comments component
	const [isCommentsRefreshed, setIsCommentsRefreshed] = useState(false);

	// State value of true will trigger fetchTopicData function in TopicPost component
	const [isTopicRefreshed, setIsTopicRefreshed] = useState(false);

	return (
		<Container className={`p-4 ${styles.customContainer}`}>
			<ErrorBoundary FallbackComponent={ErrorFallbackTopicPost}>
				<TopicPost isTopicRefreshed={isTopicRefreshed} setIsTopicRefreshed={setIsTopicRefreshed} isCommentsRefreshed={isCommentsRefreshed} />
				<CommentPostForm setIsCommentsRefreshed={setIsCommentsRefreshed} />
				<Comments isCommentsRefreshed={isCommentsRefreshed} setIsCommentsRefreshed={setIsCommentsRefreshed} />
			</ErrorBoundary>
		</Container >
	);
};

export default TopicDetailsPage;