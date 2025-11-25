import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { TopicData } from "../types/topicdata.types";
import { db } from "../utils/firebase-config";

// Fetch all topics
// export const fetchAllTopics = async (): Promise<TopicData[]> => {
// 	const dbRef = collection(db, "topics");
// 	const snapshot = await getDocs(query(dbRef));
// 	return snapshot.docs.map((doc) => ({
// 		...(doc.data() as Omit<TopicData, "topicId">),
// 		topicId: doc.id,
// 	}));
// };

export const fetchInitialTopics = async (): Promise<{
	topics: TopicData[];
	lastDoc: any;
}> => {
	const dbRef = collection(db, "topics");
	const topicsQuery = query(dbRef, orderBy("datePosted", "desc"), limit(6));
	const snapshot = await getDocs(topicsQuery);

	const topics = snapshot.docs.map((doc) => ({
		...(doc.data() as Omit<TopicData, "topicId">),
		topicId: doc.id,
	}));

	return {
		topics,
		lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
	};
};

export const fetchMoreTopics = async (
	lastDoc: any,
	limitCount: number = 6
): Promise<{
	topics: TopicData[];
	lastDoc: any;
}> => {
	const dbRef = collection(db, "topics");
	const topicsQuery = query(dbRef, orderBy("datePosted", "desc"), startAfter(lastDoc), limit(limitCount));
	const snapshot = await getDocs(topicsQuery);

	const topics = snapshot.docs.map((doc) => ({
		...(doc.data() as Omit<TopicData, "topicId">),
		topicId: doc.id,
	}));

	return {
		topics,
		lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
	};
};
