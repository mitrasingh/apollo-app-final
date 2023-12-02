import { useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackTasks from "../components/ErrorFallbackTasks";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import RefreshButton from "../components/RefreshButton";
import TaskCards from "../components/TaskCards";
import styles from "./Home.module.css";

export const Home = () => {
	// Initial state for task data from database
	const [taskArray, setTaskArray] = useState([]);

	// Current task array depending on what filter is applied
	const [taskArrayFilter, setTaskArrayFilter] = useState([]);

	// Boolean state decides whether refresh tasks button changes display text to "clear filter"
	const [isClearFilterDisplayed, setIsClearFilterDisplayed] = useState(false);

	// User input state for SearchBar
	const [userInput, setUserInput] = useState("");

	// Refresh task state (used for refresh tasks button) - resets data and clears filters
	const refreshTasksHandle = () => {
		setTaskArrayFilter(taskArray);
		setIsClearFilterDisplayed(false);
		setUserInput("");
	};

	// Options for filter fuctionality 
	const filterNewestHandle = () => {
		const sortNew = [...taskArray].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
		setTaskArrayFilter(sortNew);
		setIsClearFilterDisplayed(true);
	};

	const filterOldestHandle = () => {
		const sortOld = [...taskArray].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
		setTaskArrayFilter(sortOld);
		setIsClearFilterDisplayed(true);
	};

	const filterPriorityHandle = (priority) => {
		const filterPriority = [...taskArray.filter((task) => task.priorityLevel === priority)]
		setTaskArrayFilter(filterPriority)
		setIsClearFilterDisplayed(true);
	};

	const filterStatusHandle = (status) => {
		const filterStatus = [...taskArray.filter((task) => task.statusProject === status)];
		setTaskArrayFilter(filterStatus);
		setIsClearFilterDisplayed(true);
	};

	const filterSearchHandle = (event) => {
		event.preventDefault(); // function is used within a form so preventDefault method needed
		const filterUserInput = [...taskArray.filter((task) => task.taskName.toLowerCase().includes(userInput.toLowerCase()))];
		setTaskArrayFilter(filterUserInput);
		setIsClearFilterDisplayed(true);
	};

	return (
		<Container className={styles.customContainer}>
			<SearchBar
				userInput={userInput}
				setUserInput={setUserInput}
				filterSearchHandle={filterSearchHandle}
				refreshTasksHandle={refreshTasksHandle}
			/>

			<Stack direction="horizontal" gap={2} className="ms-3 mt-4">
				<Filter
					filterNewestHandle={filterNewestHandle}
					filterOldestHandle={filterOldestHandle}
					filterPriorityHandle={filterPriorityHandle}
					filterStatusHandle={filterStatusHandle}
				/>
				<RefreshButton
					refreshTasksHandle={refreshTasksHandle}
					filterSearchHandle={filterSearchHandle}
					isClearFilterDisplayed={isClearFilterDisplayed}
				/>
			</Stack>

			<ErrorBoundary FallbackComponent={ErrorFallbackTasks}>
				<TaskCards
					setTaskArray={setTaskArray}
					setTaskArrayFilter={setTaskArrayFilter}
					taskArrayFilter={taskArrayFilter}
					refreshTasksHandle={refreshTasksHandle}
				/>
				{taskArrayFilter.length === 0 && (
					<p className="mt-4 d-flex justify-content-center text-light fs-5">No tasks found</p>
				)}
			</ErrorBoundary>
		</Container>
	);
};

