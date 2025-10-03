import { Timestamp } from "firebase/firestore";

export interface CommentData {
	userId: string;
	userPhoto: string;
	firstName: string;
	lastName: string;
	userComment: string;
	datePosted: Timestamp;
	topicId: string;
	commentId: string;
	isDocEdited: boolean;
}
