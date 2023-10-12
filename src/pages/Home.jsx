import { TaskCard } from "../components/TaskCard";
import { SearchBar } from "../components/SearchBar";
import { Filter } from "../components/Filter";
import { RefreshButton } from "../components/RefreshButton";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { Row, Col, Container } from "react-bootstrap";
import { SyncLoader } from 'react-spinners';

export const Home = () => {
	// Initial state for task data from database
	const [taskArray, setTaskArray] = useState([]);
	const [taskArrayFilter, setTaskArrayFilter] = useState([]);
	const [isClearFilterDisplayed, setIsClearFilterDisplayed] = useState(false);

	// User input for SearchBar
	const [userInput, setUserInput] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const spinnerStyle = {
		height: "90vh",
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}

	// Fetch data and map each task into state variables
	const fetchTasks = async () => {
		try {
			setIsLoading(true);
			const dbRef = collection(db, "tasks");
			const fetchTasks = await getDocs(query(dbRef));
			const tasksMap = fetchTasks.docs.map((doc) => ({
				...doc.data(),
				taskId: doc.id,
			}));
			setTaskArray(tasksMap);
			setTaskArrayFilter(tasksMap);
		} catch (error) {
			console.log(error);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 1000)
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	// Refresh task state by fetching data, clears filters, clears user search value
	const refreshTasksHandle = () => {
		fetchTasks();
		setIsClearFilterDisplayed(false);
	};

	// Receive user input from SearchBar component
	const userInputSearchBar = (formInput) => {
		setUserInput(formInput);
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

	const filterSearchHandle = () => {
		const filterUserInput = [...taskArray.filter((task) => task.taskName.toLowerCase().includes(userInput.toLowerCase()))];
		setTaskArrayFilter(filterUserInput);
		setIsClearFilterDisplayed(true);
	};

	return (
		<>
			{isLoading ?
				<SyncLoader size={10} cssOverride={spinnerStyle} />
				:
				<Container className="mt-4">
					<SearchBar
						userInputSearchBar={userInputSearchBar}
						filterSearchHandle={filterSearchHandle}
					/>
					<Row>
						<Col xs lg="1">
							<Filter
								filterNewestHandle={filterNewestHandle}
								filterOldestHandle={filterOldestHandle}
								filterPriorityHandle={filterPriorityHandle}
								filterStatusHandle={filterStatusHandle}
							/>
						</Col>
						<Col xs lg="2" className="mt-1 px-3">
							<RefreshButton
								refreshTasksHandle={refreshTasksHandle}
								filterSearchHandle={filterSearchHandle}
								isClearFilterDisplayed={isClearFilterDisplayed}
							/>
						</Col>
					</Row>

					{taskArrayFilter.length === 0 && (
						<p className="mt-4 d-flex justify-content-center">No tasks found</p>
					)}

					{taskArrayFilter.map((task) => {
						return (
							<TaskCard
								refreshTasksHandle={refreshTasksHandle}
								task={task}
								key={task.taskId}
							/>
						);
					})}
				</Container>
			}
		</>
	);
};
