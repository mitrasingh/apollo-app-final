import { Container } from "react-bootstrap";
import CreateTaskForm from "./CreateTaskForm/CreateTaskForm";
import styles from "./CreateTaskPage.module.css";

const CreateTaskPage = () => {
	return (
		<Container className={`text-light fs-6 px-4 ${styles.formContainer}`}>
			<p className="fs-2 mb-4 fw-bold d-flex justify-content-center text-light">Create Task</p>
			<CreateTaskForm />
		</Container>
	)
};

export default CreateTaskPage;
