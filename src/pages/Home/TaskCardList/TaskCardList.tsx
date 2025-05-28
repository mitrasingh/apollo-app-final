import { useEffect, useState } from "react";
import {
	collection,
	getDocs,
	query,
	getCountFromServer,
	limit,
	startAfter,
	orderBy,
	where,
	OrderByDirection,
	QueryDocumentSnapshot,
	DocumentData,
} from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { Button, Stack, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { TaskData } from "../../../types/taskdata.types";
import TaskCard from "../TaskCard/TaskCard";

interface TaskCardListProps {
	queryFilter: [string, string];
	isQuerySorted: boolean;
	isTasksSearched: boolean;
	userInput: string;
}

const TaskCardList = ({
	queryFilter,
	isQuerySorted,
	isTasksSearched,
	userInput,
}: TaskCardListProps) => {
	// State holds fetched tasks
	const [tasksList, setTasksList] = useState<TaskData[]>([]);

	// State for the number of tasks in collection
	const [tasksCount, setTasksCount] = useState<number>(0);

	// State for the last task / document returned by the query
	const [lastTask, setLastTask] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);

	// Boolean state for displaying the Load More Button
	const [isLoadMoreShown, setIsLoadMoreShown] = useState(false);

	// Boolean state for loading additional topics
	const [isLoading, setIsLoading] = useState(false);

	// Boolean state for loading initial fetch of topics (uses spinner component)
	const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

	// Catches error and returns error boundary component (error component in parent (Home.jsx)
	const { showBoundary } = useErrorBoundary();

	// Fetch tasks and set state
	const fetchTasks = async () => {
		setIsLoadingSpinner(true);
		try {
			// If search field is triggered, fetches all filtered tasks by userInput and assigns to state
			if (isTasksSearched) {
				const dbRef = collection(db, "tasks");
				const fetchTasks = await getDocs(query(dbRef));
				const tasksMap: TaskData[] = fetchTasks.docs.map((doc) => ({
					...(doc.data() as Omit<TaskData, "taskId">),
					taskId: doc.id,
				}));
				const filterUserInput = [
					...tasksMap.filter((task) =>
						task.taskName.toLowerCase().includes(userInput.toLowerCase())
					),
				];
				setTasksList(filterUserInput);
			} else {
				// Logic for the firebase method used depending on state of isQuerySorted
				const dbRef = collection(db, "tasks");
				const sortedTasksCount = query(
					dbRef,
					orderBy(queryFilter[0], queryFilter[1] as OrderByDirection)
				);
				const sortedTasksGet = query(
					dbRef,
					orderBy(queryFilter[0], queryFilter[1] as OrderByDirection),
					limit(5)
				);
				const filteredTasksCount = query(
					dbRef,
					where(queryFilter[0], "==", queryFilter[1])
				);
				const filteredTasksGet = query(
					dbRef,
					where(queryFilter[0], "==", queryFilter[1]),
					limit(5)
				);
				const isSortedTasksToCount = isQuerySorted
					? sortedTasksCount
					: filteredTasksCount;
				const isSortedTasksToGet = isQuerySorted
					? sortedTasksGet
					: filteredTasksGet;

				// Retrieves document count from tasks collection and stores into state
				const snapshot = await getCountFromServer(isSortedTasksToCount);
				setTasksCount(snapshot.data().count);

				if (tasksCount > 0) {
					// Retrieves documents
					const data = await getDocs(isSortedTasksToGet);

					// Declared variable for mapping through retrieved docs
					const tasksMap: TaskData[] = data.docs.map((doc) => ({
						...(doc.data() as Omit<TaskData, "taskId">),
						taskId: doc.id,
					}));

					// Declared variable for accessing the last document returned by query
					const lastTaskDoc = data.docs[data.docs.length - 1];

					setTasksList(tasksMap);
					setLastTask(lastTaskDoc);
				}

				// If collection count exceeds 5, isLoadMoreShown (the displaying of load more comments button) will be true
				if (tasksCount > 5) {
					setIsLoadMoreShown(true);
				}

				// If collection count is 5 or less than 5, isLoadMoreShown will be false (no other comments are needed to load)
				if (tasksCount == 5 || tasksCount < 5) {
					setIsLoadMoreShown(false);
				}
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			showBoundary(error);
		} finally {
			setIsLoadingSpinner(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, [tasksCount, queryFilter, isTasksSearched]);

	// Fetches more data/tasks from lastTask state
	const handleLoadMore = async () => {
		setIsLoading(true);

		// Logic for which method is being used depending on state of isQuerySorted
		const dbRef = collection(db, "tasks");
		const sortedTasksToQuery = query(
			dbRef,
			orderBy(queryFilter[0], queryFilter[1] as OrderByDirection),
			startAfter(lastTask),
			limit(5)
		);

		const filteredTasksToQuery = query(
			dbRef,
			where(queryFilter[0], "==", queryFilter[1]),
			startAfter(lastTask),
			limit(5)
		);

		const isSortedTasksToQuery = isQuerySorted
			? sortedTasksToQuery
			: filteredTasksToQuery;

		try {
			// Retrieves documents
			const data = await getDocs(isSortedTasksToQuery);

			// Declared variable for if document equal 0 (no additional documents/tasks)
			const isDataEmpty = data.size === 0;
			if (!isDataEmpty) {
				const tasks = data.docs.map((doc) => ({
					...(doc.data() as Omit<TaskData, "taskId">),
					taskId: doc.id,
				})); // Declared variable for mapping through retrieved docs
				const lastTaskDoc = data.docs[data.docs.length - 1]; // Declared variable for accessing the last task returned by query

				// Stores state
				setTasksList((topicsList) => [...topicsList, ...tasks]);
				setLastTask(lastTaskDoc);
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, could not load more tasks!", {
				hideProgressBar: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// When triggered function scrolls user back to top of page
	const handleScrollToTop = () => {
		window.scrollTo(0, 0);
	};

	return (
		<Container className="pb-4">
			{isLoadingSpinner && (
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
			)}
			{tasksList.map((task) => {
				return (
					<TaskCard fetchTasks={fetchTasks} task={task} key={task.taskId} />
				);
			})}
			{tasksList.length == 0 && (
				<h4 className="text-light text-center fs-6 mt-4">No tasks found</h4>
			)}
			{isLoading && (
				<h4 className="text-light text-center fs-6 mt-4">Loading tasks...</h4>
			)}

			{!isTasksSearched
				? !isLoading &&
				  isLoadMoreShown &&
				  tasksList.length > 0 && (
						<Stack
							direction="horizontal"
							gap={2}
							className="d-flex justify-content-center"
						>
							<Button
								className="fw-bold text-light fs-6 text-center mt-4 d-flex justify-content-center"
								variant="primary"
								size="sm"
								onClick={
									tasksList.length === tasksCount
										? handleScrollToTop
										: handleLoadMore
								}
							>
								{tasksList.length === tasksCount
									? `Back to the top`
									: `Load More Tasks`}
							</Button>
						</Stack>
				  )
				: tasksList.length > 0 && (
						<h4 className="text-light text-center fs-6 mt-4">End of results</h4>
				  )}
		</Container>
	);
};

export default TaskCardList;
