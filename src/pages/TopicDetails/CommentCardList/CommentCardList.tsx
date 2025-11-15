import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, limit, startAfter, getCountFromServer } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { Button, Container, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import CommentCard from "../CommentCard/CommentCard";

type CommentCardListProps = {
	isCommentsRefreshed: boolean;
	setIsCommentsRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentCardList = ({ isCommentsRefreshed, setIsCommentsRefreshed }: CommentCardListProps) => {
	// useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
	// This shared id also specifies the unique document to query within the "topics" collection of the database
	const { id } = useParams();

	const [commentsList, setCommentsList] = useState<any[]>([]); // State for fetched data from querying database
	const [commentsCount, setCommentsCount] = useState<number>(0); // State for the comment collection count
	const [lastComment, setLastComment] = useState<any | null>(null); // State for the last comment/document from query

	const [isCommentsEmpty, setIsCommentsEmpty] = useState<boolean>(false); // Boolean state for if comment collection is empty (topic has no comments)
	const [isLoadMoreShown, setIsLoadMoreShown] = useState<boolean>(false); // Boolean state displaying the Load More Button
	const [isLoading, setIsLoading] = useState<boolean>(false); // Boolean state for loading data display

	// Fetches initial comment data
	useEffect(() => {
		const fetchComments = async () => {
			try {
				setIsLoading(true);

				// Fetches data from the entire comments collection for this topic
				const commentsCollection = query(
					collection(db, "comments"),
					where("topicId", "==", id),
					orderBy("datePosted", "desc")
				);
				const snapshot = await getCountFromServer(commentsCollection); // Retrieves document count from commentsCollection
				setCommentsCount(snapshot.data().count); // Stores the amount of comments into state variable

				// If collection count is 0, isCommentsEmpty will be true
				if (commentsCount == 0) {
					setIsCommentsEmpty(true);
				}

				if (commentsCount > 0) {
					setIsCommentsEmpty(false);
					// Query specific comments within collection and display the first four comments
					const commentsToQuery = query(
						collection(db, "comments"),
						where("topicId", "==", id),
						orderBy("datePosted", "desc"),
						limit(4)
					);
					const data = await getDocs(commentsToQuery); // Retrieves documents from commentsToQuery
					const comments = data.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })); // Declared variable for mapping through retrieved docs
					const lastCommentDoc = data.docs[data.docs.length - 1]; // Declared variable for accessing the last document returned by query

					// Set states with variables via query data
					setCommentsList(comments);
					setLastComment(lastCommentDoc);
				}

				// If collection count exceed 4, isLoadMoreShown (the displaying of load more comments button) will be true
				if (commentsCount > 4) {
					setIsLoadMoreShown(true);
				}

				// If collection count is 4, isLoadMoreShown will be false (no other comments are needed to load)
				if (commentsCount == 4) {
					setIsLoadMoreShown(false);
				}
			} catch (error: any) {
				console.log(`Error: ${error.message}`);
				toast.error("Sorry, comments are not loading!", {
					hideProgressBar: true,
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchComments();
	}, [isCommentsRefreshed, commentsCount]);

	// Fetches additional comments via trigger of Load More Comments button
	const handleLoadMore = async () => {
		setIsLoading(true);
		try {
			// Query additional comments starting after the state of lastComment
			const commentsToQuery = query(
				collection(db, "comments"),
				where("topicId", "==", id),
				orderBy("datePosted", "desc"),
				startAfter(lastComment),
				limit(4)
			);
			const data = await getDocs(commentsToQuery); // Retrieves documents from commentsToQuery

			const isDataEmpty = data.size === 0; // Declared variable for if document equal 0 (no additional documents/comments)
			if (!isDataEmpty) {
				const comments = data.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })); // Declared variable for mapping through retrieved docs
				const lastCommentDoc = data.docs[data.docs.length - 1]; // Declared variable for accessing the last document returned by query

				// Set states with variables via query data
				setCommentsList((commentList) => [...commentList, ...comments]);
				setLastComment(lastCommentDoc);
			} else {
				// If data is empty (no additional documents/comments) set boolean value isCommentsEmpty to true
				setIsCommentsEmpty(true);
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, could not load more comments!", {
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

	// If true, UI will be returned (shown when post has no comments)
	if (isCommentsEmpty) {
		return <h4 className="text-light text-center fs-6 mt-4">Be the first to comment!</h4>;
	}

	return (
		<Container className="pt-3 pb-4">
			{commentsList.map((comment) => {
				return (
					<CommentCard key={comment.commentId} comment={comment} setIsCommentsRefreshed={setIsCommentsRefreshed} />
				);
			})}
			{isLoading && <h4 className="text-light text-center fs-6 mt-4">Loading comments...</h4>}
			{!isLoading && !isCommentsEmpty && isLoadMoreShown && (
				<Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
					<Button
						className="fw-bold text-light fs-6 text-center mt-4 d-flex justify-content-center"
						variant="primary"
						size="sm"
						onClick={commentsList.length === commentsCount ? handleScrollToTop : handleLoadMore}
					>
						{commentsList.length === commentsCount ? `Back to the top` : `Load More Comments`}
					</Button>
				</Stack>
			)}
		</Container>
	);
};

export default CommentCardList;
