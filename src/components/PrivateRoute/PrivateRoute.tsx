import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROUTES } from '../../Routes';

interface PrivateRouteProps {
    children: ReactElement;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

