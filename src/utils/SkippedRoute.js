import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export default function SkippedRoute({ component: RouteComponent, ...rest }) {
    const { currentUser, userData, setGroupCode } = useContext(AuthContext)

    // useEffect(() => {
    //     if (userData) {
    //         console.log(userData)
    //     } else {
    //         setGroupCode()
    //     }
    // }, [])

    return (
        <Route
            {...rest}
            render={routeProps =>
                // If currentUser conditional changes, edit here and in SecuredRoute
                currentUser !== ' ' ? (
                    <Redirect to={"/groups"} />
                ) : (
                    <RouteComponent {...routeProps} />
                )
            }
        />
    )
}
