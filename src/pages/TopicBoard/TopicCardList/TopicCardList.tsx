import { useEffect, useState } from "react";
import {
	collection,
	getDocs,
	query,
	orderBy,
	getCountFromServer,
	limit,
	startAfter,
} from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { Button, Stack, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import TopicCard from "../TopicCard/TopicCard";

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

	// Function that fetches data from database by querying "topics" collection
	useEffect(() => {
		const fetchTopics = async () => {
			try {
				setIsLoadingSpinner(true);

				// Fetches data from the entire comments collection for this topic
				const dbRef = collection(db, "topics");
				const topicsCollection = query(dbRef);
				const snapshot = await getCountFromServer(topicsCollection); // Retrieves document count from topicsCollection
				setTopicsCount(snapshot.data().count); // Stores the amount of topics into state variable

				// If collection count is 0, isTopicsEmpty will be true
				if (topicsCount == 0) {
					setIsTopicsEmpty(true);
				}

				if (topicsCount > 0) {
					// Query specific topics within collection and display the first six topics
					const dbRef = collection(db, "topics");
					const topicsToQuery = query(
						dbRef,
						orderBy("datePosted", "desc"),
						limit(6)
					);
					const data = await getDocs(topicsToQuery); // Retrieves documents from topicsToQuery
					const topicsMap = data.docs.map((doc) => ({
						// Declared variable for mapping through retrieved docs
						...doc.data(),
						topicId: doc.id,
					}));
					const lastTopicDoc = data.docs[data.docs.length - 1]; // Declared variable for accessing the last document returned by query

					// Set states with variables via query data
					setTopicsList(topicsMap);
					setLastTopic(lastTopicDoc);
				}

				// If collection count exceeds 6, isLoadMoreShown (the displaying of load more comments button) will be true
				if (topicsCount > 6) {
					setIsLoadMoreShown(true);
				}

				// If collection count is 6, isLoadMoreShown will be false (no other comments are needed to load)
				if (topicsCount == 6) {
					setIsLoadMoreShown(false);
				}
			} catch (error: any) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			} finally {
				setIsLoadingSpinner(false);
			}
		};
		fetchTopics();
	}, [isTopicsRefreshed, topicsCount]);

	const handleLoadMore = async () => {
		setIsLoading(true);
		try {
			// Query additional topics starting after the state of lastTopic
			const dbRef = collection(db, "topics");
			const topicsToQuery = query(
				dbRef,
				orderBy("datePosted", "desc"),
				startAfter(lastTopic),
				limit(6)
			);
			const data = await getDocs(topicsToQuery); // Retrieves documents from topicsToQuery
			const isDataEmpty = data.size === 0; // Declared variable for if document equal 0 (no additional documents/topics)
			if (!isDataEmpty) {
				const topics = data.docs.map((doc) => ({
					...doc.data(),
					topicId: doc.id,
				})); // Declared variable for mapping through retrieved docs
				const lastTopicDoc = data.docs[data.docs.length - 1]; // Declared variable for accessing the last topic returned by query

				// Set states with variables via query data
				setTopicsList((topicsList) => [...topicsList, ...topics]);
				setLastTopic(lastTopicDoc);
			} else {
				// If data is empty (no additional documents/comments) set boolean value isTopicsEmpty to true
				setIsTopicsEmpty(true);
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
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
		return (
			<h4 className="text-light text-center fs-6 mt-4">
				Be the first to post a topic!
			</h4>
		);
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

				{isLoading && (
					<h4 className="text-light text-center fs-6 mt-4">
						Loading topics...
					</h4>
				)}

				{!isLoading && !isTopicsEmpty && isLoadMoreShown && (
					<Stack
						direction="horizontal"
						gap={2}
						className="d-flex justify-content-center"
					>
						<Button
							className="fw-bold text-light fs-6 text-center mt-4 d-flex justify-content-center"
							variant="primary"
							size="sm"
							onClick={
								topicsList.length === topicsCount
									? handleScrollToTop
									: handleLoadMore
							}
						>
							{topicsList.length === topicsCount
								? `Back to the top`
								: `Load More Topics`}
						</Button>
					</Stack>
				)}
			</Container>
		</>
	);
};

export default TopicCardList;
