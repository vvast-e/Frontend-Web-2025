import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROUTES } from '../../Routes';

interface ModeratorRouteProps {
    children: ReactElement;
}

export const ModeratorRoute: FC<ModeratorRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const is_superuser = useSelector((state: RootState) => state.user.is_superuser);

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (!is_superuser) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

