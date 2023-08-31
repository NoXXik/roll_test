import { MainPage } from '../../../../pages/MainPage';

import {
    AppRoutes, getRouteLogin, getRouteMain, getRouteProfile,
} from '../../../../shared/const/router';
import { AppRoutesProps } from '../../../../shared/types/router';
import {LoginPage} from "../../../../pages/LoginPage";
import {ProfilePage} from "../../../../pages/ProfilePage";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <MainPage />,
        authOnly: true
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <LoginPage />,
    },
    [AppRoutes.PROFILE]: {
        path: getRouteProfile(),
        element: <ProfilePage />,
        authOnly: true
    }
};
