import {PureComponent} from 'react';
import {BrowserRouter, NavLink, Switch, Route} from 'react-router-dom';
import {compose} from 'recompose';
import {noop} from 'lodash';
import {Tracker, TrackRoute, TrackEvent, trackEvent, combineCollects, browser, context, session} from '../../../src';
import AboutMe from '../AboutMe';
import Console from '../Console';
import Service from '../Service';
import Select from '../Select';
import NameInput from '../NameInput';
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
    <TrackEvent eventPropName="onMouseEnter" category="navigation" action="mouseEnter" label={name}>
        <TrackEvent eventPropName="onMouseLeave" category="navigation" action="mouseLeave" label={name}>
            <li>
                <NavLink exact to={to} activeClassName="nav-link-active">{name}</NavLink>
            </li>
        </TrackEvent>
    </TrackEvent>
);

const fruitOptions = [{
    value: 'grapefruit',
    name: 'Grapefruit'
}, {
    value: 'lime',
    name: 'Lime'
}, {
    value: 'coconut',
    name: 'Coconut'
}, {
    value: 'mango',
    name: 'Mango'
}];

const ComposedSelect = compose(
    trackEvent({eventPropName: 'onChange', category: 'select', action: 'change', label: 'Fruit Select'}),
    trackEvent({eventPropName: 'onClick', category: 'select', action: 'click', label: 'Fruit Click'})
)(Select);

export default class App extends PureComponent {

    state = {
        logs: [],
        name: ''
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

    onNameChange = value => {
        this.setState({
            name: value
        });
    };

    render() {
        const {logs, name} = this.state;

        return (
            <Tracker collect={collect} provider={this.trackProvider}>
                <BrowserRouter>
                    <div>
                        <nav>
                            <ul>
                                <NavItem to="/" name="Home" />
                                <NavItem to="/console" name="Console" />
                                <NavItem to="/service" name="Service" />
                                <NavItem to="/about" name="About" />
                            </ul>
                        </nav>
                        <Switch>
                            <TrackRoute exact path="/" >
                                <div>
                                    <h2>Home</h2>
                                    <div>
                                        <label>Fruit: </label>
                                        <ComposedSelect options={fruitOptions} defaultValue="coconut" />
                                    </div>
                                    <div>
                                        <label>UserName: </label>
                                        <NameInput onNameChange={this.onNameChange} />
                                    </div>
                                </div>
                            </TrackRoute>
                            <TrackRoute exact path="/console" component={Console} />
                            <TrackRoute exact path="/service" render={() => <Service />} />
                            <Route exact path="/about" component={AboutMe} />
                        </Switch>
                        <div>
                            <h3>UserName: {name}</h3>
                            <h3>Logs</h3>
                            <ol>
                                {logs.concat().reverse().map((log, i) =>
                                    (
                                        <li key={i}>{log.type} - {log.message}</li>
                                    )
                                )}
                            </ol>
                        </div>
                    </div>
                </BrowserRouter>
            </Tracker>
        );
    }
}
