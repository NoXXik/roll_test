import {AppRouter} from "./providers/router";
import {Suspense, useEffect} from "react";
import {classNames} from "../shared/lib/classNames/classNames";
import {MainLayout} from "../shared/layouts/MainLayout";
import {Navbar} from "../widgets/Navbar/ui/Navbar";
import {useLazyAuthorizationQuery} from "../entities/User/api/userApi";
import {useSelector} from "react-redux";
import {getCurrentUser} from "../entities/User/model/selectors/userSelectors";
import {useLocation, useNavigate} from "react-router-dom";


function App() {
    const [authorize] = useLazyAuthorizationQuery()
    const user = useSelector(getCurrentUser)
    const navigate = useNavigate()
    const location = useLocation()
    if(location.pathname === '/login' && user) {
        navigate('/')
    }
    useEffect(() => {
        authorize(null)
    }, [])
    return (
        <>
            <div
                id="app"
                className={classNames('app_redesigned', {}, ['app_dark_theme'])}
            >
                <Suspense fallback="">
                    <MainLayout
                        header={<Navbar />}
                        content={<AppRouter />}
                        // sidebar={<Sidebar />}
                        // toolbar={toolbar}
                    />
                </Suspense>
            </div>
        </>
    )
}

export default App
