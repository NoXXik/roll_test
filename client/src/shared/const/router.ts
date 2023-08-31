export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    PROFILE = 'profile',
    // // last
    // NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/';
export const getRouteLogin = () => '/login';

export const getRouteProfile = () => 'profile';

export const getRouteForbidden = () => '/forbidden';

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRouteProfile()]: AppRoutes.PROFILE
};
