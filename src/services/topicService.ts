import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { TopicData } from "../types/topicdata.types";
import { getCountFromServer } from "firebase/firestore";

// Fetch the total count of topics
export const fetchTopicsCount = async (): Promise<number> => {
	const dbRef = collection(db, "topics");
	const countSnapshot = await getCountFromServer(query(dbRef));
	return countSnapshot.data().count;
};

// Fetch the first batch of topics
export const fetchInitialTopics = async (
	limitCount: number = 6
): Promise<{
	topics: TopicData[];
	lastDoc: any;
}> => {
	const dbRef = collection(db, "topics");
	const topicsQuery = query(dbRef, orderBy("datePosted", "desc"), limit(limitCount));
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

// Fetch more topics for pagination
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
