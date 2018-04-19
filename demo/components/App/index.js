import {PureComponent} from 'react';
import {BrowserRouter, NavLink, Switch, Route} from 'react-router-dom';
import {noop} from 'lodash';
import {Tracker, TrackEvent, TrackRoute, combineCollects, browser, context, session} from '@ee-fe/react-track';
import './index.css';

const app = {
    app: 'react-track demo',
    version: require('../../../package.json').version
};

const collect = combineCollects(
    context(app),
    browser(),
    session()
);

const appendLog = ({logs}, type, data) => {
    const item = {
        type,
        message: type === 'pageView' ? data.location.pathname : `${data.category}:${data.action}:${data.label}`
    };

    return {
        logs: [...logs, item]
    };
};

const NavItem = ({name, to}) => (
    <TrackEvent eventPropName="onMouseEnter" category="navigation" action="hover" label={name}>
        <li>
            <NavLink exact to={to} activeClassName="nav-link-active">{name}</NavLink>
        </li>
    </TrackEvent>
);

export default class App extends PureComponent {

    state = {
        logs: []
    };

    trackProvider = {
        install: noop,

        uninstall: noop,

        trackPageView: data => {
            this.setState(state => appendLog(state, 'pageView', data));
        },

        trackEvent: data => {
            this.setState(state => appendLog(state, 'customEvent', data));
        }
    };

    render() {
        const {logs} = this.state;

        return (
            <Tracker collect={collect} provider={this.trackProvider}>
                <BrowserRouter>
                    <div>
                        <nav>
                            <ul>
                                <NavItem to="/" name="Home" />
                                <NavItem to="/console" name="Console" />
                                <NavItem to="/about" name="About" />
                            </ul>
                        </nav>
                        <div>
                            <h3>Logs</h3>
                            <ol>
                                {logs.map((log, i) => <li key={i}>{log.type} - {log.message}</li>)}
                            </ol>
                        </div>
                        <Switch>
                            <TrackRoute exact path="/">
                                <h2>Home</h2>
                            </TrackRoute>
                            <TrackRoute exact path="/console">
                                <h2>Admin Console</h2>
                            </TrackRoute>
                            <TrackRoute exact path="/about">
                                <h2>About ME</h2>
                            </TrackRoute>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Tracker>
        );
    }
}
