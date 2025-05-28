import { Timestamp } from "firebase/firestore";

export interface TaskData {
	taskId: string;
	descriptionTask: string;
	dueDate: Timestamp;
	priorityLevel: string;
	statusProject: string;
	taskName: string;
	userId: string;
}
