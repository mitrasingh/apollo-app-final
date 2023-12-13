import { Container } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackProfile from "../../components/Error Fallback/ErrorFallbackProfile";
import ProfileForm from "./ProfileForm/ProfileForm";

const EditProfilePage = () => {

    return (
        <Container>
            <ErrorBoundary FallbackComponent={ErrorFallbackProfile}>
                <ProfileForm />
            </ErrorBoundary>
        </Container>
    )
};

export default EditProfilePage;

