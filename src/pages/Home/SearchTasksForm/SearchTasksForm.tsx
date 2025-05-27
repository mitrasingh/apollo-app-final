import {
	Col,
	Container,
	Form,
	FormControl,
	InputGroup,
	Row,
	Button,
} from "react-bootstrap";

interface SearchTasksFormProps {
	userInput: string;
	setUserInput: (value: string) => void;
	filterSearchHandle: (
		event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLImageElement>
	) => void;
	refreshTasksHandle: () => void;
}

// Prop from Home.jsx
const SearchTasksForm = ({
	userInput,
	setUserInput,
	filterSearchHandle,
	refreshTasksHandle,
}: SearchTasksFormProps) => {
	// Function sets value from user input within form field
	const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(e.target.value);
	};

	// Function resets tasks when user backspaces/deletes all values from form field
	const handleKeyDownReset = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 8 && userInput.length === 1) return refreshTasksHandle();
		if (e.keyCode === 46 && userInput.length === 1) return refreshTasksHandle();
	};

	return (
		<Container className="mt-4 mb-3">
			<Row className="justify-content-center">
				<Col lg={6} md={6} sm={8}>
					<Form onSubmit={filterSearchHandle} className="d-flex ms-2">
						<InputGroup>
							<Button>
								<img
									src="/search_new.svg"
									width="20"
									height="20"
									alt="Search bar button"
									onClick={filterSearchHandle}
								/>
							</Button>
							<FormControl
								className="me-2 fs-6 shadow-none"
								type="text"
								name="tasksearch"
								autoComplete="tasksearch"
								placeholder="Search by task name..."
								value={userInput}
								onKeyDown={handleKeyDownReset}
								onChange={handleUserInput}
							/>
						</InputGroup>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default SearchTasksForm;
