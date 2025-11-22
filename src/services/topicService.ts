import { collection, getDocs, query } from "firebase/firestore";
import { TopicData } from "../types/topicdata.types";
import { db } from "../utils/firebase-config";

// Fetch all topics
export const fetchAllTopics = async (): Promise<TopicData[]> => {
	const dbRef = collection(db, "topics");
	const snapshot = await getDocs(query(dbRef));
	return snapshot.docs.map((doc) => ({
		...(doc.data() as Omit<TopicData, "topicId">),
		topicId: doc.id,
	}));
};
