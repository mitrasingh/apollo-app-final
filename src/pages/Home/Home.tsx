import { useCallback, useState } from "react";
import { Row, Col, Container, Stack } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackTasks from "../../components/ErrorFallback/ErrorFallbackTasks";
import SearchTasksForm from "./SearchTasksForm/SearchTasksForm";
import FilterTasksButton from "./FilterTasksButton/FilterTasksButton";
import RefreshTasksButton from "./RefreshTasksButton/RefreshTasksButton";
import TaskCardList from "./TaskCardList/TaskCardList";
import styles from "./Home.module.css";

type QueryFilter = [string, string];

const defaultQueryFilter: QueryFilter = ["dueDate", "asc"];

const Home = () => {
	// State array which sets parameters (for firebase query)
	const [queryFilter, setQueryFilter] =
		useState<QueryFilter>(defaultQueryFilter);

	// Boolean state which sets whether firebase query orderyby method is being used (orderby method sorts tasks)
	const [isQuerySorted, setIsQuerySorted] = useState(true);

	// Boolean state which sets whether firebase query where method is being used (where method filters tasks)
	const [isTasksSearched, setIsTasksSearched] = useState(false);

	// Boolean state decides whether refresh tasks button changes display text to "clear filter"
	const [isClearFilterDisplayed, setIsClearFilterDisplayed] = useState(false);

	// User input state from search task form
	const [userInput, setUserInput] = useState("");

	const applyFilter = (
		type: "dueDate" | "priorityLevel" | "statusProject",
		value: string
	) => {
		setQueryFilter([type, value]);
		setIsQuerySorted(type === "dueDate");
		setIsClearFilterDisplayed(true);
	};

	// Refresh task state (used for refresh tasks button) - resets form data and clears filters
	const refreshTasksHandle = () => {
		setQueryFilter(defaultQueryFilter);
		setIsQuerySorted(true);
		setIsClearFilterDisplayed(false);
		setIsTasksSearched(false);
		setUserInput("");
	};

	// Options for filter fuctionality
	const handleDueDateFilter = (order: "asc" | "desc") =>
		applyFilter("dueDate", order);

	const handlePriorityFilter = (priorityType: string) =>
		applyFilter("priorityLevel", priorityType);

	const handleStatusFilter = (statusType: string) =>
		applyFilter("statusProject", statusType);

	const handleSearchInput = useCallback((value: string) => {
		setUserInput(value);
		if (value === "") {
			// Reset tasks/filter state here
			setQueryFilter(defaultQueryFilter);
			setIsQuerySorted(true);
			setIsClearFilterDisplayed(false);
			setIsTasksSearched(false);
		} else {
			setIsTasksSearched(true);
			setIsClearFilterDisplayed(true);
		}
	}, []);

	return (
		<Container className={styles.customContainer}>
			<p className="fs-2 fw-bold d-flex justify-content-center text-light">
				Task Board
			</p>
			<Row>
				<Col>
					<SearchTasksForm
						userInput={userInput}
						onInputChange={handleSearchInput}
					/>
				</Col>
			</Row>
			<Row>
				<Col lg={{ span: 8, offset: 2 }}>
					<Stack direction="horizontal" gap={2} className="ms-4 mt-4">
						<FilterTasksButton
							filterLaterHandle={() => handleDueDateFilter("desc")}
							filterSoonHandle={() => handleDueDateFilter("asc")}
							filterPriorityHandle={handlePriorityFilter}
							filterStatusHandle={handleStatusFilter}
						/>
						<RefreshTasksButton
							refreshTasksHandle={refreshTasksHandle}
							isClearFilterDisplayed={isClearFilterDisplayed}
						/>
					</Stack>
					<ErrorBoundary FallbackComponent={ErrorFallbackTasks}>
						<TaskCardList
							userInput={userInput}
							isTasksSearched={isTasksSearched}
							queryFilter={queryFilter}
							isQuerySorted={isQuerySorted}
						/>
					</ErrorBoundary>
				</Col>
			</Row>
		</Container>
	);
};

export default Home;
