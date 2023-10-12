import { Col, Container, Form, FormControl, InputGroup, Row, Button } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { useState } from 'react';

export const SearchBar = ({ userInputSearchBar, filterSearchHandle }) => { // Prop from Home.jsx

    // Value state of user input in form field
    const [userInput, setUserInput] = useState("")

    // Sends user input value to parent component (Home.jsx)
    const handleUserInput = (e) => {
        setUserInput(e.target.value)
        userInputSearchBar(userInput)
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col sm={5}>
                    <Form className="d-flex">
                        <InputGroup>
                            <Button variant="light">
                                <img
                                    src="public/img/search.svg"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                    alt="Search bar button"
                                    onClick={filterSearchHandle}
                                />
                            </Button>
                            <FormControl
                                style={{ fontSize: "11px" }}
                                type="text"
                                className="me-2"
                                placeholder="Search by task name..."
                                value={userInput}
                                onChange={handleUserInput}
                            />
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

SearchBar.propTypes = {
    userInputSearchBar: PropTypes.func.isRequired,
    filterSearchHandle: PropTypes.func.isRequired,
}