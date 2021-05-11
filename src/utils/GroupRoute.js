import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GroupContext } from './GroupContext';

export default function GroupRoute({ component: RouteComponent, ...rest }) {
    const { currentGroup } = useContext(GroupContext);

    return (
        <Route
            {...rest}
            render={routeProps =>
                !currentGroup ? (
                    <Redirect to={"/groups"} />

                ) : (
                    <RouteComponent {...routeProps} />
                )
            }
        />
    )
}
