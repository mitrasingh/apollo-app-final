import { Timestamp } from "firebase/firestore";
export interface TopicData {
	title: string;
	description: string;
	firstName: string;
	lastName: string;
	userId: string;
	datePosted: Timestamp;
	topicId: string;
	isDocEdited: boolean;
}

export type TopicDetailData = Omit<TopicData, "topicId">;
