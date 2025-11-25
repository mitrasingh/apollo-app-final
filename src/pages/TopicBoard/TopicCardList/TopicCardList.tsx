import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { Button, Stack, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import TopicCard from "../TopicCard/TopicCard";
import { fetchInitialTopics, fetchMoreTopics, fetchTopicsCount } from "../../../services/topicService";
interface TopicCardListProps {
	isTopicsRefreshed: boolean;
}

export const TopicCardList = ({ isTopicsRefreshed }: TopicCardListProps) => {
	const [topicsList, setTopicsList] = useState<any[]>([]);
	const [topicsCount, setTopicsCount] = useState<number>(0);
	const [lastTopic, setLastTopic] = useState<any | null>(null);

	const [isTopicsEmpty, setIsTopicsEmpty] = useState<boolean>(false);
	const [isLoadMoreShown, setIsLoadMoreShown] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingSpinner, setIsLoadingSpinner] = useState<boolean>(false);

	const { showBoundary } = useErrorBoundary();

	useEffect(() => {
		const loadTopics = async () => {
			try {
				setIsLoadingSpinner(true);

				// Fetch topics count
				const totalTopicsCount = await fetchTopicsCount();
				setTopicsCount(totalTopicsCount);

				// Fetch initial topics
				const { topics, lastDoc } = await fetchInitialTopics();

				if (topics.length === 0) {
					setIsTopicsEmpty(true);
					setTopicsList([]);
					return;
				}

				setTopicsList(topics);
				setLastTopic(lastDoc);
				setIsTopicsEmpty(false);
				setIsLoadMoreShown(topics.length < totalTopicsCount);
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
			setIsLoadMoreShown(topicsList.length + topics.length < topicsCount);
		} catch (error: any) {
			console.error("Error loading more topics:", error.message);
			toast.error("Sorry, could not load more topics!", {
				hideProgressBar: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	};

	if (isTopicsEmpty) {
		return <h4 className="text-light text-center fs-6 mt-4">Be the first to post a topic!</h4>;
	}

	return (
		<Container className="pb-4">
			{isLoadingSpinner && (
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
			)}

			{topicsList.map((topic) => (
				<TopicCard topic={topic} key={topic.topicId} />
			))}

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
	);
};

export default TopicCardList;
