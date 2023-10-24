import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import styles from "./RefreshButton.module.css";

// Props from Home.jsx
export const RefreshButton = ({ refreshTasksHandle, isClearFilterDisplayed }) => {

  return (
    <>
      <Button
        className={`d-flex align-items-center text-light fs-6 fw-bold ${styles.customBtn}`}
        variant="primary"
        onClick={refreshTasksHandle}
      >
        {isClearFilterDisplayed ? "Clear Filters" : "Refresh Tasks"}
      </Button>
    </>
  );
};

RefreshButton.propTypes = {
  refreshTasksHandle: PropTypes.func.isRequired,
  isClearFilterDisplayed: PropTypes.bool.isRequired
}
