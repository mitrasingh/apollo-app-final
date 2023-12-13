import { useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackTasks from "../../components/ErrorFallbackTasks";
import SearchTasksForm from "./SearchTasksForm/SearchTasksForm";
import FilterTasksButton from "./FilterTasksButton/FilterTasksButton";
import RefreshTasksButton from "./RefreshTasksButton/RefreshTasksButton";
import TaskCards from "./TaskCards/TaskCards";
import styles from "./Home.module.css";

const Home = () => {
	// Initial state for task data from database
	const [taskArray, setTaskArray] = useState([]);

	// Current task array depending on what filter is applied
	const [taskArrayFilter, setTaskArrayFilter] = useState([]);

	// Boolean state decides whether refresh tasks button changes display text to "clear filter"
	const [isClearFilterDisplayed, setIsClearFilterDisplayed] = useState(false);

	// User input state for SearchTasks
	const [userInput, setUserInput] = useState("");

	// Refresh task state (used for refresh tasks button) - resets data and clears filters
	const refreshTasksHandle = () => {
		setTaskArrayFilter(taskArray);
		setIsClearFilterDisplayed(false);
		setUserInput("");
	};

	// Options for filter fuctionality 
	const filterLaterHandle = () => {
		const sortLater = [...taskArray].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
		setTaskArrayFilter(sortLater);
		setIsClearFilterDisplayed(true);
	};

	const filterSoonHandle = () => {
		const sortSoon = [...taskArray].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
		setTaskArrayFilter(sortSoon);
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
			<SearchTasksForm
				userInput={userInput}
				setUserInput={setUserInput}
				filterSearchHandle={filterSearchHandle}
				refreshTasksHandle={refreshTasksHandle}
			/>

			<Stack direction="horizontal" gap={2} className="ms-3 mt-4">
				<FilterTasksButton
					filterLaterHandle={filterLaterHandle}
					filterSoonHandle={filterSoonHandle}
					filterPriorityHandle={filterPriorityHandle}
					filterStatusHandle={filterStatusHandle}
				/>
				<RefreshTasksButton
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

export default Home;

