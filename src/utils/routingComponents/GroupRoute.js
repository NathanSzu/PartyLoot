import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GroupContext } from '../contexts/GroupContext';

export default function GroupRoute({ component: RouteComponent, ...rest }) {
    const { currentGroup } = useContext(GroupContext);

    return (
        <Route
            {...rest}
            render={routeProps =>
                // ' ' is the default group value set in GroupContext.
                currentGroup === ' ' ? (
                    <Redirect to={"/groups"} />

                ) : (
                    <RouteComponent {...routeProps} />
                )
            }
        />
    )
}
