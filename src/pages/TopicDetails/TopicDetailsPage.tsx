import { useState } from "react";
import { Container } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import TopicPost from "./TopicPost/TopicPost";
import CommentPostForm from "./CommentPostForm/CommentPostForm";
import CommentCardList from "./CommentCardList/CommentCardList";
import ErrorFallbackTopicPost from "../../components/ErrorFallback/ErrorFallbackTopicPost";
import styles from "./TopicDetailsPage.module.css";

const TopicDetailsPage = () => {
	const { id } = useParams();

	// Triggers fetchComments in CommentCardList and CommentPostForm
	const [isCommentsRefreshed, setIsCommentsRefreshed] = useState<boolean>(false);

	// Triggers fetchTopicData in TopicPost
	const [isTopicRefreshed, setIsTopicRefreshed] = useState<boolean>(false);

	return (
		<Container className={`p-4 ${styles.customContainer}`}>
			{/* ErrorBoundary catches errors in child components */}
			<ErrorBoundary FallbackComponent={ErrorFallbackTopicPost}>
				{/* Topic details and refresh logic */}
				<TopicPost
					id={id}
					isTopicRefreshed={isTopicRefreshed}
					setIsTopicRefreshed={setIsTopicRefreshed}
					isCommentsRefreshed={isCommentsRefreshed}
				/>
				{/* Form to post new comments */}
				<CommentPostForm setIsCommentsRefreshed={setIsCommentsRefreshed} />
				{/* List of comments for the topic */}
				<CommentCardList isCommentsRefreshed={isCommentsRefreshed} setIsCommentsRefreshed={setIsCommentsRefreshed} />
			</ErrorBoundary>
		</Container>
	);
};

export default TopicDetailsPage;
