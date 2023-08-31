import {Card} from "../../../shared/ui/Card";
import {Text} from "../../../shared/ui/Text";
import {Button} from "../../../shared/ui/Button";
import {VStack} from "../../../shared/ui/Stack";


export const LoginForm = () => {
    const handleSteamAuth = async () => {
        document.location.assign(`${import.meta.env.VITE_SERVICE_API_URL}auth/steam/login`)
    }
    return (
        <>
            <Card>
                <VStack align={'center'} gap={'16'}>
                    <Text text={'Login'} align={'center'}></Text>
                    {/*<Input value={nickname} onChange={(value) => setNickname(value)}></Input>*/}
                    <Button onClick={handleSteamAuth}>Steam OAuth</Button>
                </VStack>
            </Card>
        </>
    )
}
