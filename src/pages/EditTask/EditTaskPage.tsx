import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import EditTaskForm from "./EditTaskForm/EditTaskForm";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackProfile from "../../components/ErrorFallback/ErrorFallbackProfile";
import styles from "./EditTaskPage.module.css";

const EditTaskPage = () => {
	const location = useLocation();
	const { task, creatorName, creatorPhoto } = location.state;

	return (
		<Container className={`text-light fs-6 px-4 ${styles.formContainer}`}>
			<p className="fs-2 mb-4 fw-bold d-flex justify-content-center text-light">
				Edit Your Task
			</p>
			<ErrorBoundary FallbackComponent={ErrorFallbackProfile}>
				<EditTaskForm
					task={task}
					creatorName={creatorName}
					creatorPhoto={creatorPhoto}
				/>
			</ErrorBoundary>
		</Container>
	);
};

export default EditTaskPage;
