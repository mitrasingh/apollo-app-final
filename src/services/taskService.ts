import {
	collection,
	getDocs,
	query,
	orderBy,
	where,
	limit,
	startAfter,
	getCountFromServer,
	OrderByDirection,
	QueryDocumentSnapshot,
	DocumentData,
	updateDoc,
	doc,
	addDoc,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { TaskCreateData, TaskData } from "../types/taskdata.types";
import { convertToTimestamp } from "../utils/date-config";
import { TaskEditData } from "../types/taskdata.types";

export const taskService = () => {
	// Fetch all tasks (for search)
	const fetchAllTasks = async (): Promise<TaskData[]> => {
		try {
			const dbRef = collection(db, "tasks");
			const snapshot = await getDocs(query(dbRef));
			return snapshot.docs.map((doc) => ({
				...(doc.data() as Omit<TaskData, "taskId">),
				taskId: doc.id,
			}));
		} catch (error) {
			throw error;
		}
	};

	// Fetch tasks with sorting or filtering (first page)
	const fetchTasksWithQuery = async (
		queryFilter: [string, string],
		isQuerySorted: boolean,
		limitCount = 5
	): Promise<{
		tasks: TaskData[];
		lastTask: QueryDocumentSnapshot<DocumentData> | null;
	}> => {
		try {
			const dbRef = collection(db, "tasks");
			let q;

			if (isQuerySorted) {
				q = query(
					dbRef,
					orderBy(queryFilter[0], queryFilter[1] as OrderByDirection),
					limit(limitCount)
				);
			} else {
				q = query(
					dbRef,
					where(queryFilter[0], "==", queryFilter[1]),
					limit(limitCount)
				);
			}

			const snapshot = await getDocs(q);
			const tasks = snapshot.docs.map((doc) => ({
				...(doc.data() as Omit<TaskData, "taskId">),
				taskId: doc.id,
			}));
			const lastTask =
				snapshot.docs.length > 0
					? snapshot.docs[snapshot.docs.length - 1]
					: null;
			return { tasks, lastTask };
		} catch (error) {
			throw error;
		}
	};

	// Fetch more tasks (pagination) with sorting or filtering
	const fetchMoreTasksWithQuery = async (
		queryFilter: [string, string],
		isQuerySorted: boolean,
		lastTask: QueryDocumentSnapshot<DocumentData>,
		limitCount = 5
	): Promise<{
		tasks: TaskData[];
		lastTask: QueryDocumentSnapshot<DocumentData> | null;
	}> => {
		try {
			const dbRef = collection(db, "tasks");
			let q;

			if (isQuerySorted) {
				q = query(
					dbRef,
					orderBy(queryFilter[0], queryFilter[1] as OrderByDirection),
					startAfter(lastTask),
					limit(limitCount)
				);
			} else {
				q = query(
					dbRef,
					where(queryFilter[0], "==", queryFilter[1]),
					startAfter(lastTask),
					limit(limitCount)
				);
			}

			const snapshot = await getDocs(q);
			const tasks = snapshot.docs.map((doc) => ({
				...(doc.data() as Omit<TaskData, "taskId">),
				taskId: doc.id,
			}));
			const newLastTask =
				snapshot.docs.length > 0
					? snapshot.docs[snapshot.docs.length - 1]
					: null;
			return { tasks, lastTask: newLastTask };
		} catch (error) {
			throw error;
		}
	};

	// Get total count for tasks (for pagination)
	const getTasksCount = async (
		queryFilter: [string, string],
		isQuerySorted: boolean
	): Promise<number> => {
		try {
			const dbRef = collection(db, "tasks");
			let q;

			if (isQuerySorted) {
				q = query(
					dbRef,
					orderBy(queryFilter[0], queryFilter[1] as OrderByDirection)
				);
			} else {
				q = query(dbRef, where(queryFilter[0], "==", queryFilter[1]));
			}

			const snapshot = await getCountFromServer(q);
			return snapshot.data().count;
		} catch (error) {
			throw error;
		}
	};

	// Updates existing task in Firestore with new input data
	const updateTask = async (taskId: string, data: TaskEditData) => {
		try {
			const timestamp = convertToTimestamp(data.dueDate);
			await updateDoc(doc(db, "tasks", taskId), {
				taskName: data.taskName,
				descriptionTask: data.descriptionTask,
				statusProject: data.statusProject,
				priorityLevel: data.priorityLevel,
				dueDate: timestamp,
			});
		} catch (error) {
			throw error;
		}
	};

	const createTask = async (userId: string, data: TaskCreateData) => {
		try {
			const timestamp = convertToTimestamp(data.dueDate);
			const dbRef = collection(db, "tasks");
			const taskData = {
				taskName: data.taskName,
				descriptionTask: data.descriptionTask,
				statusProject: data.statusProject,
				priorityLevel: data.priorityLevel,
				dueDate: timestamp,
				userId: userId,
			};
			await addDoc(dbRef, taskData);
		} catch (error: any) {
			throw error;
		}
	};

	return {
		fetchAllTasks,
		fetchTasksWithQuery,
		fetchMoreTasksWithQuery,
		getTasksCount,
		updateTask,
		createTask,
	};
};
