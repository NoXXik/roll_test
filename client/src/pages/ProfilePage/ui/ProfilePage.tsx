import {useSelector} from "react-redux";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {useEffect} from "react";
import {AppImage} from "../../../shared/ui/AppImage";
import {Text} from "../../../shared/ui/Text";
import {HStack, VStack} from "../../../shared/ui/Stack";
import {useLazyGetBetsQuery} from "../../../entities/User/api/userApi";
// import { Page } from '@/widgets/Page';

const ProfilePage = () => {
    const user = useSelector(getCurrentUser)
    const [getBets, {data, isLoading, isError}] = useLazyGetBetsQuery()
    useEffect(() => {
        getBets(null)
    }, [])

    if (!user) {
        <main>
            ...Loading
        </main>
    }

    console.log(data)
    return (
        <main>
            <VStack gap={'24'}>
                <HStack gap={'32'} align={'start'}>
                    <AppImage src={user?.avatar_url}></AppImage>
                    <Text title={user?.nickname}></Text>
                </HStack>

                <Text title={'История ставок'}></Text>
                {data && <>
                    <HStack justify={'center'} gap={'32'}>
                        <Text text={'Раунд'}></Text>
                        <Text text={'Ставка'}></Text>
                        <Text text={"Выигрышь"}></Text>
                        <Text text={"Дата"}></Text>
                    </HStack>
                    {data.map(bet => <>
                        <HStack justify={'center'} align={'center'} gap={'32'}>
                            <Text text={String(bet.id)}></Text>
                            <Text text={String(bet.bet_amount)}></Text>
                            <Text text={String(bet.won)}></Text>
                            <Text text={String(bet.created_at)}></Text>
                        </HStack>
                    </>)}
                </>}
            </VStack>
        </main>
    );
};

export default ProfilePage;
