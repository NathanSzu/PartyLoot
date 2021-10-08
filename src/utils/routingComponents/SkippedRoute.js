import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function SkippedRoute({ component: RouteComponent, ...rest }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={routeProps =>
                // If currentUser conditional changes, edit here and in SecuredRoute
                currentUser ? (
                    <Redirect to={"/groups"} />
                ) : (
                    <RouteComponent {...routeProps} />
                )
            }
        />
    )
}
