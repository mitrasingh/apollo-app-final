import { useState } from "react";
import { Container } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import { useParams } from "react-router-dom";
import TopicPost from "./TopicPost/TopicPost";
import CommentPostForm from "./CommentPostForm/CommentPostForm";
import CommentCardList from "./CommentCardList/CommentCardList";
import ErrorFallbackTopicPost from "../../components/ErrorFallback/ErrorFallbackTopicPost";
import styles from "./TopicDetailsPage.module.css";

const TopicDetailsPage = () => {
	const { id } = useParams();

	// State value of true will trigger fetchComments function in Comments component
	const [isCommentsRefreshed, setIsCommentsRefreshed] = useState(false);

	// State value of true will trigger fetchTopicData function in TopicPost component
	const [isTopicRefreshed, setIsTopicRefreshed] = useState(false);

	return (
		<Container className={`p-4 ${styles.customContainer}`}>
			<ErrorBoundary FallbackComponent={ErrorFallbackTopicPost}>
				<TopicPost id={id} isTopicRefreshed={isTopicRefreshed} setIsTopicRefreshed={setIsTopicRefreshed} isCommentsRefreshed={isCommentsRefreshed} />
				<CommentPostForm setIsCommentsRefreshed={setIsCommentsRefreshed} />
				<CommentCardList isCommentsRefreshed={isCommentsRefreshed} setIsCommentsRefreshed={setIsCommentsRefreshed} />
			</ErrorBoundary>
		</Container >
	);
};

export default TopicDetailsPage;