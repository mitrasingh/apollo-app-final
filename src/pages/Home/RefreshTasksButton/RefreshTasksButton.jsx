import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Props from Home.jsx
const RefreshTasksButton = ({ refreshTasksHandle, isClearFilterDisplayed }) => {

  return (
    <>
      <Button
        className="d-flex align-items-center text-light fs-6 fw-bold"
        variant="primary"
        onClick={refreshTasksHandle}
      >
        {isClearFilterDisplayed ? "Clear Filters" : "Refresh Tasks"}
      </Button>
    </>
  );
};

RefreshTasksButton.propTypes = {
  refreshTasksHandle: PropTypes.func.isRequired,
  isClearFilterDisplayed: PropTypes.bool.isRequired
};

export default RefreshTasksButton;
