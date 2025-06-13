import { Timestamp } from "firebase/firestore";

export interface TaskData {
	taskId: string;
	descriptionTask: string;
	dueDate: string;
	priorityLevel: string;
	statusProject: string;
	taskName: string;
	userId: string;
}

export type TaskEditData = Omit<TaskData, "userId" | "taskId">;
