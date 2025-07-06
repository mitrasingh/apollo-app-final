import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ErrorFallback } from "../../types/errorfallback.types";
import styles from "./ErrorFallback.module.css";

export const ErrorFallbackTopics = ({ resetErrorBoundary }: ErrorFallback) => {
	return (
		<Container className={styles.customContainer}>
			<Row>
				<Col className="d-flex justify-content-center mt-4">
					<div className="text-light fs-4 fw-bold text-center">
						Ground control, topics not loading!
					</div>
				</Col>
			</Row>
			<Row>
				<Col className="d-flex justify-content-center">
					<Button
						className="ms-2 mt-2 fs-6 text-light fw-bold mt-3 mb-4"
						variant="primary"
						size="sm"
						type="submit"
						onClick={resetErrorBoundary}
					>
						Retry
					</Button>
				</Col>
			</Row>
			<Row>
				<Col className="d-flex justify-content-center mt-4 fs-6">
					<p className="text-center text-light">
						Head to&nbsp;
						<Link className="fw-bold" to="/">
							Home
						</Link>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

export default ErrorFallbackTopics;
