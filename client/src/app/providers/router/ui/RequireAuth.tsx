import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {getCurrentUser} from "../../../../entities/User/model/selectors/userSelectors";
import {UserRoles} from "../../../../entities/User/model/types/types";
import {getRouteLogin} from "../../../../shared/const/router";


interface RequireAuthProps {
    children: JSX.Element;
    roles?: UserRoles;
}

export function RequireAuth({ children }: RequireAuthProps) {
    const location = useLocation();
    const user = useSelector(getCurrentUser);

    // const hasRequiredRoles = useMemo(() => {
    //     if (!roles) {
    //         return true;
    //     }
    //
    //     return roles.some((requiredRole) => {
    //         const hasRole = userRoles?.includes(requiredRole);
    //         return hasRole;
    //     });
    // }, [roles, userRoles]);

    if (!user) {
        // localStorage.setItem('last_url', location.pathname)
        return (
            <Navigate to={getRouteLogin()} state={{ from: location }} replace />
        );
    }

    // if (!hasRequiredRoles) {
    //     return (
    //         <Navigate
    //             to={getRouteForbidden()}
    //             state={{ from: location }}
    //             replace
    //         />
    //     );
    // }

    return children;
}
