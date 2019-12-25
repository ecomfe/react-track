import {Suspense, SFC, ComponentType} from 'react';
import {Route, RouteProps} from 'react-router-dom';
import TrackPageView from './TrackPageView';

const lazyComponentMapping = new WeakMap<ComponentType, ComponentType>();

const mapToLazyComponent = (ComponentIn: ComponentType) => {
    if (!lazyComponentMapping.has(ComponentIn)) {
        const ComponentOut: SFC = props => (
            <Suspense fallback={null}>
                <ComponentIn {...props} />
            </Suspense>
        );
        ComponentOut.displayName = `withSuspense(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;
        lazyComponentMapping.set(ComponentIn, ComponentOut);
    }
    return lazyComponentMapping.get(ComponentIn);
};

interface Props extends RouteProps {
    wrapSuspense?: boolean;
}

const TrackRoute: SFC<Props> = ({render, children, component, wrapSuspense = false, ...props}) => {
    const componentPropValue = (wrapSuspense && component) ? mapToLazyComponent(component as ComponentType) : component;
    return (
        <Route {...props}>
            <TrackPageView>
                <Route render={render} component={componentPropValue}>
                    {children}
                </Route>
            </TrackPageView>
        </Route>
    );
};

export default TrackRoute;
