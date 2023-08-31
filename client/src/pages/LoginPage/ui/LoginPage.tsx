import {Flex} from "../../../shared/ui/Stack/Flex/Flex";
import {LoginForm} from "../../../entities/User/ui/LoginForm";


const LoginPage = () => {
    return (
        <main>
            <Flex direction={'column'} align={'center'}>
                <LoginForm />
            </Flex>
        </main>
    );
};

export default LoginPage;
