import { Container } from "react-bootstrap";
import CreateTaskForm from "./CreateTaskForm/CreateTaskForm";
import styles from "./CreateTaskPage.module.css";

const CreateTaskPage = () => {
	return (
		<Container className={`text-light fs-6 px-4 ${styles.formContainer}`}>
			<CreateTaskForm />
		</Container>
	)
};

export default CreateTaskPage;
