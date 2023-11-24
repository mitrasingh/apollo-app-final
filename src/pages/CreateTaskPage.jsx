import { Container } from "react-bootstrap";
import CreateTask from "../components/CreateTask";
import styles from "./CreateTaskPage.module.css";

const CreateTaskPage = () => {
	return (
		<Container className={`text-light fs-6 px-4 ${styles.formContainer}`}>
			<CreateTask />
		</Container>
	)
};

export default CreateTaskPage;
