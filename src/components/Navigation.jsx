import { Container, Nav, Navbar, Image, Stack, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase-config";
import { logoutUser } from "../features/user/userSlice";
import { signOut } from "firebase/auth";
import styles from "./Navigation.module.css";

export const Navigation = () => {
    // Fetching user values from Redux
    const user = useSelector((state) => state.user);

    // Adding a timestamp to avoid cache settings, allowing photo to display most up-to-date version
    const userImage = `${user.userPhoto}?timestamp=${Date.now()}`;

    // Logs user out and redirects to sign in page
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logoutUser());
        signOut(auth);
        navigate("/signin");
    };

    return (
        <Navbar collapseOnSelect fixed="top" bg="info" variant="dark" expand="lg" className={`px-5 d-flex flex-row ${styles.customNav}`}>
            <Container className={styles.customContainer}>
                <Navbar.Brand className="fw-bold fs-3">
                    <Image
                        className="pr-2"
                        as={Link}
                        to="/"
                        src="public/img/rocket_white.svg"
                        width="40"
                        height="40"
                        alt="apollo logo"
                    />{" "}
                    Apollo
                </Navbar.Brand>
                <Form className="order-lg-last">
                    <Stack direction="horizontal">
                        <Link to="/profile">
                            <Image
                                className={styles.customImage}
                                height="35px"
                                width="35px"
                                src={userImage}
                                roundedCircle
                            />
                        </Link>
                    </Stack>
                </Form>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-center">
                    <Nav className="mx-auto">
                        <Nav.Link eventKey="1" as={Link} to="/" className="me-1">Home</Nav.Link>
                        <Nav.Link eventKey="2" as={Link} to="/createtask">Create Task</Nav.Link>
                        <Nav.Link eventKey="3" as={Link} to="/shoutboard" >Shout Board</Nav.Link>
                        <Nav.Link eventKey="4" onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

