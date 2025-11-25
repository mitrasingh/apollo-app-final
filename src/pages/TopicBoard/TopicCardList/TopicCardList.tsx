import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { Button, Stack, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import TopicCard from "../TopicCard/TopicCard";
import { fetchInitialTopics, fetchMoreTopics } from "../../../services/topicService";

interface TopicCardListProps {
	isTopicsRefreshed: boolean;
}

export const TopicCardList = ({ isTopicsRefreshed }: TopicCardListProps) => {
	const [topicsList, setTopicsList] = useState<any[]>([]); // State for fetched data from querying database
	const [topicsCount, setTopicsCount] = useState<number>(0); // State for the topics collection count
	const [lastTopic, setLastTopic] = useState<any | null>(null); // State for the last topic/document from query

	const [isTopicsEmpty, setIsTopicsEmpty] = useState<boolean>(false); // Boolean state for if topic collection is empty
	const [isLoadMoreShown, setIsLoadMoreShown] = useState<boolean>(false); // Boolean state for displaying the Load More Button

	const [isLoading, setIsLoading] = useState<boolean>(false); // Boolean state for loading additional topics
	const [isLoadingSpinner, setIsLoadingSpinner] = useState<boolean>(false); // Boolean state for loading initial fetch of topics (uses spinner component)

	// Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
	const { showBoundary } = useErrorBoundary();

	useEffect(() => {
		const loadTopics = async () => {
			try {
				setIsLoadingSpinner(true);

				// Fetch topics using the service function
				const { topics, lastDoc } = await fetchInitialTopics();

				// Handle empty topics case
				if (topics.length === 0) {
					setIsTopicsEmpty(true);
					setTopicsList([]);
					return;
				}

				// Update state with fetched topics
				setTopicsList(topics);
				setLastTopic(lastDoc);
				setIsTopicsEmpty(false);
				setIsLoadMoreShown(topics.length > 6); // Show "Load More" if there are more than 6 topics
			} catch (error: any) {
				console.error("Error fetching topics:", error.message);
				showBoundary(error);
			} finally {
				setIsLoadingSpinner(false);
			}
		};

		loadTopics();
	}, [isTopicsRefreshed, showBoundary]);

	const handleLoadMore = async () => {
		setIsLoading(true);
		try {
			const { topics, lastDoc } = await fetchMoreTopics(lastTopic);

			if (topics.length === 0) {
				setIsTopicsEmpty(true);
				return;
			}

			setTopicsList((prev) => [...prev, ...topics]);
			setLastTopic(lastDoc);
		} catch (error: any) {
			console.error("Error loading more topics:", error.message);
			toast.error("Sorry, could not load more topics!", {
				hideProgressBar: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// When triggered function scrolls user back to top of page
	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	};

	// If true, UI will be returned (shown when page has no topics)
	if (isTopicsEmpty) {
		return <h4 className="text-light text-center fs-6 mt-4">Be the first to post a topic!</h4>;
	}

	return (
		<>
			<Container className="pb-4">
				{isLoadingSpinner && (
					<div className="d-flex justify-content-center align-items-center vh-100">
						<Spinner animation="border" variant="warning" />
					</div>
				)}

				{topicsList.map((topic) => {
					return <TopicCard topic={topic} key={topic.topicId} />;
				})}

				{isLoading && <h4 className="text-light text-center fs-6 mt-4">Loading topics...</h4>}

				{!isLoading && !isTopicsEmpty && isLoadMoreShown && (
					<Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
						<Button
							className="fw-bold text-light fs-6 text-center mt-4 d-flex justify-content-center"
							variant="primary"
							size="sm"
							onClick={topicsList.length === topicsCount ? handleScrollToTop : handleLoadMore}
						>
							{topicsList.length === topicsCount ? `Back to the top` : `Load More Topics`}
						</Button>
					</Stack>
				)}
			</Container>
		</>
	);
};

export default TopicCardList;
