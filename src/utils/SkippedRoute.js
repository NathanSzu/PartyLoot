import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export default function SkippedRoute({ component: RouteComponent, ...rest }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={routeProps =>
                currentUser ? (
                    <Redirect to={"/groups"} />

                ) : (
                    <RouteComponent {...routeProps} />
                )
            }
        />
    )
}
