import { Container } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallbackProfile from "../../components/ErrorFallbackProfile";
import ProfileForm from "../../components/ProfileForm";

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

