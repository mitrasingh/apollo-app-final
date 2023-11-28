import { useState } from 'react';
import { Col, Container, Form, FormControl, InputGroup, Row, Button } from 'react-bootstrap'
import PropTypes from 'prop-types';

const SearchBar = ({ userInputSearchBar, filterSearchHandle, refreshTasksHandle }) => { // Prop from Home.jsx

    // Value state of user input in form field
    const [userInput, setUserInput] = useState("")

    // Sends user input value to parent component (Home.jsx)
    const handleUserInput = (e) => {
        setUserInput(e.target.value)
        userInputSearchBar(userInput)
    }

    const handleKeyDownReset = (e) => {
        if (e.keyCode === 8 && userInput.length === 1) return refreshTasksHandle();
        if (e.keyCode === 46 && userInput.length === 1) return refreshTasksHandle();
    }

    return (
        <Container className="mt-4 mb-3">
            <Row className="justify-content-center">
                <Col lg={5} md={8} sm={8}>
                    <Form onSubmit={filterSearchHandle} className="d-flex">
                        <InputGroup>
                            <Button >
                                <img
                                    src="public/img/search_new.svg"
                                    width="20"
                                    height="20"
                                    alt="Search bar button"
                                    type="button"
                                    onClick={filterSearchHandle}
                                />
                            </Button>
                            <FormControl
                                type="text"
                                className="me-2 fs-6 shadow-none"
                                placeholder="Search by task name..."
                                value={userInput}
                                onKeyDown={handleKeyDownReset}
                                onChange={handleUserInput}
                            />
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
};

SearchBar.propTypes = {
    userInputSearchBar: PropTypes.func.isRequired,
    filterSearchHandle: PropTypes.func.isRequired,
    refreshTasksHandle: PropTypes.func.isRequired
};

export default SearchBar;