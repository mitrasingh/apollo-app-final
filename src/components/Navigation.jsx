import { Col, Container, Nav, NavDropdown, Navbar, Image, Stack } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../utils/firebase-config'
import { logoutUser } from '../features/user/userSlice'
import { signOut } from 'firebase/auth'

export const Navigation = () => {
    // Fetching user values from Redux
    const user = useSelector((state) => state.user)

    // Adding a timestamp to avoid cache settings, allowing photo to display most up-to-date version
    const userImage = `${user.userPhoto}?timestamp=${Date.now()}`

    // Logs user out and redirects to sign in page
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logoutUser())
        signOut(auth)
        navigate("/signin")
    }

    return (
        <Navbar bg="light" variant="light" className="px-5">
            {/* <Navbar collapseOnSelect expand="sm" bg="light" variant="light" className="px-5"> */}
            {/* <Navbar.Toggle aria-controls="navbarScroll" data-bs-target="#navbarScroll" /> */}
            <Container>

                <Col className="d-flex justify-content-start">
                    <Stack direction="horizontal">
                        <Navbar.Brand as={Link} to="/">
                            <img
                                src="public/img/rocket.svg"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="apollo logo"
                            />
                        </Navbar.Brand>
                        {/* <Navbar.Brand style={{ fontSize: "12px" }} className="fw-bold" as={Link} to="/">Apollo</Navbar.Brand> */}
                    </Stack>
                </Col>

                <Col md="auto" className="d-flex justify-content-center text-nowrap">
                    <Navbar.Collapse id="navbarScroll">
                        <Nav style={{ fontSize: "10px" }} className="fw-bold mt-1">
                            <Nav.Link as={Link} to="/" className="me-1">Home</Nav.Link>
                            <Nav.Link as={Link} to="/createtask">Create Task</Nav.Link>
                            <Nav.Link as={Link} to="/shoutboard" className="ms-1">Shout Board</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Col>

                <Col className="d-flex justify-content-end">
                    <Nav>
                        <NavDropdown drop="down" title="" menuVariant="light">
                            <NavDropdown.Item style={{ fontSize: "9px" }} as={Link} to="/profile">Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item style={{ fontSize: "9px" }} onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                        <Navbar.Brand>
                            <Image
                                style={{
                                    height: "30px",
                                    width: "30px",
                                    objectFit: "cover",
                                    borderRadius: "50%"
                                }}
                                src={userImage}
                                roundedCircle />
                        </Navbar.Brand>
                        {/* <Nav.Link style={{ fontSize: "9px" }} className="fw-bold pt-3 ps-0">Hi, <strong>{user.firstName}</strong></Nav.Link> */}
                    </Nav>
                </Col>

            </Container>
        </Navbar>
    )
}

