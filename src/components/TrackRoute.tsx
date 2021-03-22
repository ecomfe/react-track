import {FC, createContext, ReactElement, useContext} from 'react';
import {Route, RouteProps, useRouteMatch} from 'react-router-dom';
import {TrackConfig} from '../interface';
import {useTrackConfig} from './Tracker';
import TrackPageView from './TrackPageView';

const Context = createContext<string | null>(null);
Context.displayName = 'TrackRouteContext';

interface GuardProps extends Partial<TrackConfig> {
    warnNested: boolean;
    children: ReactElement;
}

const TrackRouteNestingGuard: FC<GuardProps> = ({warnNested, children}) => {
    const possibleParent = useContext(Context);
    const {path} = useRouteMatch();

    if (warnNested && possibleParent !== null) {
        console.warn(`A TrackRoute (${path}) is nested inside another TrackRoute (${possibleParent})`);
    }

    return (
        <Context.Provider value={path}>
            {children}
        </Context.Provider>
    );
};

type Props = RouteProps & Partial<TrackConfig>;

const TrackRoute: FC<Props> = props => {
    const {reportPageViewOnLeafOnly, warnNestedTrackRoute, render, children, component, ...routeDefinition} = props;
    const contextConfig = useTrackConfig();
    const config: TrackConfig = {...contextConfig, ...props};

    return (
        <Route {...routeDefinition}>
            <TrackRouteNestingGuard warnNested={config.warnNestedTrackRoute}>
                <TrackPageView disabled={config.reportPageViewOnLeafOnly && !!props.children}>
                    <Route render={render} component={component} {...routeDefinition}>
                        {children}
                    </Route>
                </TrackPageView>
            </TrackRouteNestingGuard>
        </Route>
    );
};

export default TrackRoute;
