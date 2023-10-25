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