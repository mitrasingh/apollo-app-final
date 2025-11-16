import { collection, getDocs, query } from "firebase/firestore";
import { TopicData } from "../types/topicdata.types";
import { db } from "../utils/firebase-config";

// Fetch all topics
export const fetchAllTopics = async (): Promise<TopicData[]> => {
	try {
		const dbRef = collection(db, "tasks");
		const snapshot = await getDocs(query(dbRef));
		return snapshot.docs.map((doc) => ({
			...(doc.data() as Omit<TopicData, "taskId">),
			taskId: doc.id,
		}));
	} catch (error) {
		throw error;
	}
};
