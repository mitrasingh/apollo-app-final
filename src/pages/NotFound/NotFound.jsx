import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
    return (
        <Container className={styles.customContainer}>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Image
                        src="public/img/rocket_white.svg"
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        alt="apollo logo"
                    />
                    <h1 className="fw-bold text-light mt-2">Apollo</h1>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center mt-4">
                    <div className="text-light fs-3 fw-bold">Page not found!</div>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center mt-4 fs-6">
                    <p className="text-center text-light">
                        Head back to&nbsp;
                        <Link
                            className="fw-bold"
                            to="/"
                        >
                            Home
                        </Link>
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound;
