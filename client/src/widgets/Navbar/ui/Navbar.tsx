import {memo} from "react";
import {classNames} from "../../../shared/lib/classNames/classNames";
import {HStack} from "../../../shared/ui/Stack";
import cls from './Navbar.module.scss'
import {Button} from "../../../shared/ui/Button";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {Text} from "../../../shared/ui/Text";
import {Card} from "../../../shared/ui/Card";
import {AppLink} from "../../../shared/ui/AppLink";
import {useLogoutMutation} from "../../../entities/User/api/userApi";
import {Avatar} from "../../../shared/ui/Avatar";

interface NavbarProps {
    className?: string;
}
export const Navbar = memo(({className}: NavbarProps) => {
    const authData = useSelector(getCurrentUser);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    // const onShowModal = useCallback(() => {
    //     setIsAuthModal(true);
    // }, []);

    const handleLogout = () => {
        logout('')
    }
    if (authData) {
        return (
            <header className={classNames('isAppRedesigned', {}, [className])}>
                <Card>
                    <HStack justify={'end'} gap="16" className={cls.actions}>
                        {/*<NotificationButton/>*/}
                        {/*<AvatarDropdown/>*/}
                        <AppLink to={'/'}>Главная</AppLink>
                        <Text text={`Баланс ${authData.balance}`}/>
                        {/*<Text text={authData.nickname} />*/}
                        <AppLink to={'/profile'}><HStack gap={'24'}>{authData.nickname} <Avatar size={50} src={authData.avatar_url} /></HStack>
                        </AppLink>
                        <Button onClick={handleLogout}>Выйти</Button>
                    </HStack>
                </Card>

            </header>
        );
    }

    return (
        <header className={classNames('isAppRedesigned', {}, [className])}>
            <Button
                variant="clear"
                className={cls.links}
                onClick={() => navigate('/login')}
            >
                Войти
            </Button>
        </header>
    );
});
