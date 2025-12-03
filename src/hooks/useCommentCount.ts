import { useState, useEffect } from "react";
import { db } from "../../src/utils/firebase-config";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

export const useCommentCount = (topicId: string) => {
	const [numOfComments, setNumOfComments] = useState<number>(0);

	useEffect(() => {
		const fetchCommentCount = async () => {
			try {
				const commentsQuery = query(collection(db, "comments"), where("topicId", "==", topicId));
				const snapshot = await getCountFromServer(commentsQuery);
				setNumOfComments(snapshot.data().count);
			} catch (error: any) {
				console.error(`Error fetching comment count: ${error.message}`);
			}
		};

		fetchCommentCount();
	}, [topicId]);

	return numOfComments;
};
