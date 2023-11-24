import { useState } from "react";
import { Container } from "react-bootstrap";
import TopicPost from "../components/TopicPost";
import CommentPostForm from "../components/CommentPostForm";
import Comments from "../components/Comments";
import styles from "./TopicDetailsPage.module.css";

export const TopicDetailsPage = () => {

	// Triggers refresh of all comments
	const [isCommentsRefreshed, setIsCommentsRefreshed] = useState(false);

	// Triggers refresh of fetchTopicData function
	const [isTopicRefreshed, setIsTopicRefreshed] = useState(false);

	return (
		<Container className={`p-4 ${styles.customContainer}`}>
			<TopicPost isTopicRefreshed={isTopicRefreshed} setIsTopicRefreshed={setIsTopicRefreshed} isCommentsRefreshed={isCommentsRefreshed} />
			<CommentPostForm setIsCommentsRefreshed={setIsCommentsRefreshed} />
			<Comments isCommentsRefreshed={isCommentsRefreshed} setIsCommentsRefreshed={setIsCommentsRefreshed} />
		</Container >
	);
};

export default TopicDetailsPage;