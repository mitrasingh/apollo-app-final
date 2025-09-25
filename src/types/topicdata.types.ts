import { Timestamp } from "firebase/firestore";
export interface TopicData {
	title: string;
	description: string;
	firstName: string;
	lastName: string;
	userId: string;
	topicId: string;
	datePosted: Timestamp;
	isDocEdited: boolean;
}
