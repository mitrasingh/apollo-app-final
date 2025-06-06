import { memo } from "react";
import { Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";

type Props = {
	userInput: string;
	onInputChange: (value: string) => void;
};

// Prop from Home.jsx
const SearchTasksForm = memo(({ userInput, onInputChange }: Props) => {
	return (
		<Container className="mt-4 mb-3">
			<Row className="justify-content-center">
				<Col lg={6} md={6} sm={8}>
					<InputGroup className="d-flex ms-2">
						<FormControl
							className="me-2 fs-6 shadow-none"
							type="text"
							name="tasksearch"
							autoComplete="tasksearch"
							placeholder="Search by task name..."
							value={userInput}
							onChange={(e) => onInputChange(e.target.value)}
						/>
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
});

export default SearchTasksForm;
