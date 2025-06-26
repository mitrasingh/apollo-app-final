import { useEffect, useState, useCallback } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { Button, Stack, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { TaskData } from "../../../types/taskdata.types";
import TaskCard from "../TaskCard/TaskCard";
import {
	fetchAllTasks,
	fetchTasksWithQuery,
	fetchMoreTasksWithQuery,
	getTasksCount,
} from "../../../services/taskService";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

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
	const [tasksList, setTasksList] = useState<TaskData[]>([]);
	const [tasksCount, setTasksCount] = useState<number>(0);
	const [lastTask, setLastTask] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [isLoadMoreShown, setIsLoadMoreShown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

	const { showBoundary } = useErrorBoundary();

	// Fetch tasks (initial or search)
	const fetchTasks = useCallback(async () => {
		setIsLoadingSpinner(true);
		try {
			if (isTasksSearched) {
				const allTasks = await fetchAllTasks();
				const filtered = allTasks.filter((task) =>
					task.taskName.toLowerCase().includes(userInput.toLowerCase())
				);
				setTasksList(filtered);
				setIsLoadMoreShown(false);
				setTasksCount(filtered.length);
				setLastTask(null);
			} else {
				const count = await getTasksCount(queryFilter, isQuerySorted);
				setTasksCount(count);

				const { tasks, lastTask } = await fetchTasksWithQuery(
					queryFilter,
					isQuerySorted,
					5
				);
				setTasksList(tasks);
				setLastTask(lastTask);
				setIsLoadMoreShown(count > 5);
			}
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			showBoundary(error);
		} finally {
			setIsLoadingSpinner(false);
		}
	}, [isTasksSearched, userInput, queryFilter, isQuerySorted, showBoundary]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	// Load more tasks (pagination)
	const handleLoadMore = async () => {
		if (!lastTask) return;
		setIsLoading(true);
		try {
			const { tasks: moreTasks, lastTask: newLastTask } =
				await fetchMoreTasksWithQuery(queryFilter, isQuerySorted, lastTask, 5);
			if (moreTasks.length) {
				setTasksList((prev) => [...prev, ...moreTasks]);
				setLastTask(newLastTask);
			}
			if (tasksList.length + moreTasks.length >= tasksCount) {
				setIsLoadMoreShown(false);
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

	// Scroll to top
	const handleScrollToTop = () => window.scrollTo(0, 0);

	return (
		<Container className="pb-4">
			{isLoadingSpinner && (
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
			)}
			{tasksList.map((task) => (
				<TaskCard fetchTasks={fetchTasks} task={task} key={task.taskId} />
			))}
			{tasksList.length === 0 && (
				<h4 className="text-light text-center fs-6 mt-4">No tasks found</h4>
			)}
			{isLoading && (
				<h4 className="text-light text-center fs-6 mt-4">Loading tasks...</h4>
			)}
			{!isTasksSearched &&
				!isLoading &&
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
				)}
			{isTasksSearched && tasksList.length > 0 && (
				<h4 className="text-light text-center fs-6 mt-4">End of results</h4>
			)}
		</Container>
	);
};

export default TaskCardList;
