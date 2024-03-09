import { Container, Nav, Navbar, Image, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase-config";
import { logoutUser } from "../../store/user/userSlice";
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import LogoutModal from "../Modals/LogoutModal";
import styles from "./Navigation.module.css";

const Navigation = () => {

    // ADDED COLUMNS TO THE NAVBAR

    // State whether navbar is open or closed
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    // Creates a reference referring to navbar element
    const navbarRef = useRef(null);

    // Handles the behavior of closing the Navbar when a user clicks outside of it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsNavbarOpen(false); // Close the Navbar if clicked outside
            }
        };
        // Add an event listener to the document for click events
        document.addEventListener('click', handleOutsideClick);

        // Clean up function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

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
            navigate("/");
            toast.info('You have been logged out!', {
                hideProgressBar: true
            })
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    };

    // Details modal functionality
    const [isLogoutModalVisible, setLogOutModalVisible] = useState(false);
    const handleVisible = () => setLogOutModalVisible(true);

    return (
        <Navbar
            collapseOnSelect
            fixed="top"
            bg="info"
            variant="dark"
            expand="lg"
            className={`px-5 d-flex flex-row ${styles.customNav}`}
            ref={navbarRef}
        >
            <Container className={styles.customContainer}>
                <Navbar.Brand as={Link} to="/home" className="fw-bold fs-3">
                    <Image
                        src="/rocket_white.svg"
                        width="30"
                        height="30"
                        alt="apollo logo"
                    />{" "}
                    Apollo
                </Navbar.Brand>
                <Navbar.Brand className={`order-lg-last ${styles.brandnav2}`}>
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
                                className="object-fit-cover pl-2"
                                height="35px"
                                width="35px"
                                src={userImage}
                                roundedCircle
                            />
                        </Link>
                    </OverlayTrigger>
                </Navbar.Brand>

                <LogoutModal
                    handleLogout={handleLogout}
                    setLogOutModalVisible={setLogOutModalVisible}
                    isLogoutModalVisible={isLogoutModalVisible}
                />
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                />
                <Navbar.Collapse id="basic-navbar-nav" className="text-center" in={isNavbarOpen}>
                    <Nav className="mx-auto" onClick={() => setIsNavbarOpen(false)}>
                        <Nav.Link eventKey="1" as={Link} to="/home" className="me-1">Home</Nav.Link>
                        <Nav.Link eventKey="2" as={Link} to="/createtask" >Create Task</Nav.Link>
                        <Nav.Link eventKey="3" as={Link} to="/topicboard" >Topic Board</Nav.Link>
                        <Nav.Link eventKey="4" onClick={handleVisible}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;