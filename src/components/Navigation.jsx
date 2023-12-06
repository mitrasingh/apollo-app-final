import { Container, Nav, Navbar, Image, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase-config";
import { logoutUser } from "../features/user/userSlice";
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import LogoutModal from "./LogoutModal";
import styles from "./Navigation.module.css";

export const Navigation = () => {
    // Fetching user values from Redux
    const user = useSelector((state) => state.user);

    // Adding a timestamp to avoid cache settings, allowing photo to display most up-to-date version
    const userImage = `${user.userPhoto}?timestamp=${Date.now()}`;

    // Logs user out and redirects to sign in page
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logoutUser());
            navigate("/signin");
            toast.info('You have been logged out!')
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    // Details modal functionality
    const [isLogoutModalVisible, setLogOutModalVisible] = useState(false);
    const handleVisible = () => setLogOutModalVisible(true);

    return (
        <Navbar collapseOnSelect fixed="top" bg="info" variant="dark" expand="lg" className={`px-5 d-flex flex-row ${styles.customNav}`}>
            <Container className={styles.customContainer}>
                <Navbar.Brand className="fw-bold fs-3">
                    <Image
                        as={Link}
                        to="/"
                        src="public/img/rocket_white.svg"
                        width="30"
                        height="30"
                        alt="apollo logo"
                    />{" "}
                    Apollo
                </Navbar.Brand>
                <Form className="order-lg-last">
                    <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={
                            <Tooltip className="fs-6">
                                Edit your profile
                            </Tooltip>
                        }
                    >
                        <Link to="/editprofile">
                            <Image
                                className=""
                                height="35px"
                                width="35px"
                                src={userImage}
                                roundedCircle
                            />
                        </Link>
                    </OverlayTrigger>
                </Form>
                <LogoutModal
                    handleLogout={handleLogout}
                    setLogOutModalVisible={setLogOutModalVisible}
                    isLogoutModalVisible={isLogoutModalVisible}
                />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-center">
                    <Nav className="mx-auto">
                        <Nav.Link eventKey="1" as={Link} to="/" className="me-1">Home</Nav.Link>
                        <Nav.Link eventKey="2" as={Link} to="/createtask">Create Task</Nav.Link>
                        <Nav.Link eventKey="3" as={Link} to="/topicboard" >Topic Board</Nav.Link>
                        <Nav.Link eventKey="4" onClick={handleVisible}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

