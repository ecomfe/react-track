import {MemoryRouter as Router, NavLink, Switch} from 'react-router-dom';
import {noop} from 'lodash';
import {mount} from 'enzyme';
import 'mock-local-storage';
import {
    Tracker,
    TrackRoute,
    TrackEvent,
    combineCollects,
    browser,
    context,
    session,
    composeProvider,
    print,
    holmes,
    trackEvent,
    trackPageView,
} from '../src';

let consoleMessage = '';
const log = console.log;
const mockLogHandler = jest.fn((...inputs) => {
    log(...inputs);
    consoleMessage = inputs[0];
});
/* tslint:disable-next-line */
console.log = mockLogHandler;

const uuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

const genProvideWithAutofillNoop = key => event => ({
    install: noop,
    uninstall: noop,
    trackEvent: noop,
    trackPageView: noop,
    [key]: event,
});

const genInstallProvider = genProvideWithAutofillNoop('install');
const genUninstall = genProvideWithAutofillNoop('uninstall');
const genEventProvider = genProvideWithAutofillNoop('trackEvent');
const genPageViewProvider = genProvideWithAutofillNoop('trackPageView');

describe('test TrackEvent', () => {
    const mockEventHandler = jest.fn(x => x);

    const TrackEventComponent = ({collect, provider, category = 'noCategory', action = 'noAction', label, handler}) => {
        return (
            <Tracker collect={collect} provider={provider}>
                <TrackEvent eventPropName="onClick" category={category} action={action} label={label}>
                    <button onClick={handler}>button</button>
                </TrackEvent>
            </Tracker>
        );
    };

    const browsetCollect = browser();
    const printProvider = print();

    const wrapper = mount(
        <TrackEventComponent collect={browsetCollect} provider={printProvider} handler={mockEventHandler} />
    );

    test('TrackEvent should render button children correctly', () => {
        expect(wrapper.exists('button')).toBe(true);
    });

    test('TrackEvent should invoke original event handler', () => {
        wrapper.find('button').simulate('click');
        expect(mockEventHandler.mock.calls.length).toEqual(1);
    });

    test('TrackEvent should log event message without category, action and label', () => {
        wrapper.find('button').simulate('click');
        expect(consoleMessage).toEqual('[Track] Receive custom event noCategory:noAction:null');
    });

    test('TrackEvent should log event message with custom category, action and label', () => {
        wrapper.setProps({category: 'category', action: 'action', label: 'label'});
        wrapper.find('button').simulate('click');
        expect(consoleMessage).toEqual('[Track] Receive custom event category:action:label');
    });
});

describe('test combineCollects and combineProvider', () => {
    const TrackEventComponent = ({collect, provider, category = 'noCategory', action = 'noAction', label}) => {
        return (
            <Tracker collect={collect} provider={provider}>
                <TrackEvent eventPropName="onClick" category={category} action={action} label={label}>
                    <button onClick={noop}>button</button>
                </TrackEvent>
            </Tracker>
        );
    };

    const mockInstall = jest.fn(x => x);
    const installProvider = genInstallProvider(mockInstall);

    const mockUninstall = jest.fn(x => x);
    const uninstallProvider = genUninstall(mockUninstall);

    const customProvider = genEventProvider(
        jest.fn(({env, session}) => {
            test('env collect should equal test', () => {
                expect(env).toBe('test');
            });
            test('session collect should match uuid/v4', () => {
                expect(uuidRegex.test(session)).toBe(true);
            });
        })
    );
    const collect = combineCollects(browser(), context({env: 'test'}), session());
    const provider = composeProvider(print(), customProvider, installProvider, uninstallProvider);

    const wrapper = mount(<TrackEventComponent collect={collect} provider={provider} />);

    wrapper.find('button').simulate('click');

    test('should invoke install func when component mount', () => {
        expect(mockInstall.mock.calls.length).toEqual(1);
    });

    test('should invoke uninstall func when component unmount', () => {
        wrapper.unmount();
        expect(mockUninstall.mock.calls.length).toEqual(1);
    });
});

describe('test TrackRoute', () => {
    const TrackRouteComponent = ({collect, provider}) => {
        return (
            <Tracker collect={collect} provider={provider}>
                <Router initialEntries={[{pathname: '/', key: 'noKey'}]}>
                    <>
                        <NavLink className="hash" exact to="/about#hash">
                            About
                        </NavLink>
                        <NavLink className="query" exact to="/about?a=1">
                            Query
                        </NavLink>
                        <Switch>
                            <TrackRoute exact path="/about">
                                <p>About</p>
                            </TrackRoute>
                            <TrackRoute exact path="/">
                                <p>Root</p>
                            </TrackRoute>
                        </Switch>
                    </>
                </Router>
            </Tracker>
        );
    };

    const collect = browser();
    const provider = genPageViewProvider(
        jest.fn(x => {
            test('TrackPageView should contains browser keys', () => {
                expect(Object.keys(x)).toEqual([
                    'userAgent',
                    'resolution',
                    'os',
                    'browser',
                    'language',
                    'referrer',
                    'location',
                ]);
            });
        })
    );

    const combineProviders = composeProvider(print(), provider);

    const wrapper = mount(<TrackRouteComponent collect={collect} provider={combineProviders} />);
    test('TrackPageView should render root element correctly', () => {
        expect(wrapper.find('p').text()).toEqual('Root');
    });

    const newProvider = genPageViewProvider(
        jest.fn(({location}) => {
            test('location.pathname should be /about', () => {
                expect(location.pathname).toBe('/about');
            });

            test('hash should be #hash', () => {
                expect(location.hash).toBe('#hash');
            });
        })
    );

    wrapper.setProps({provider: newProvider});
    test('TrackPageView should record when route updated', () => {
        wrapper.find('a.hash').simulate('click', {button: 0});
        expect(wrapper.find('p').text()).toEqual('About');
    });
});

describe('test homles', () => {
    const TrackHolmesComponent = ({collect, provider}) => {
        return (
            <Tracker collect={collect} provider={provider}>
                <Router initialEntries={[{pathname: '/', key: 'noKey'}]}>
                    <>
                        <NavLink className="hash" exact to="/about">
                            About
                        </NavLink>
                        <Switch>
                            <TrackRoute exact path="/about">
                                <p>About</p>
                            </TrackRoute>
                            <TrackRoute exact path="/">
                                <TrackEvent eventPropName="onClick" category="category" action="action" label="action">
                                    <button>button</button>
                                </TrackEvent>
                            </TrackRoute>
                        </Switch>
                    </>
                </Router>
            </Tracker>
        );
    };

    const collect = x => x;
    const provider = holmes('any');

    const wrapper = mount(<TrackHolmesComponent collect={collect} provider={provider} />);

    test('should trackPageView / in _hmt ', () => {
        expect([..._hmt[1]]).toEqual(['_trackPageview', '/']);
    });

    test('should trackEvent in _hmt', () => {
        wrapper.find('button').simulate('click');
        expect([..._hmt[2]]).toEqual(['_trackEvent', 'category', 'action', 'action']);
    });

    test('should trackPageView / in _hmt', () => {
        // why {button: 0} flag here?
        // https://github.com/airbnb/enzyme/issues/516
        wrapper.find('a').simulate('click', {button: 0});
        expect([..._hmt[3]]).toEqual(['_trackPageview', '/about']);
    });
});

describe('test hocs', () => {
    const EventComponentIn = props => (
        <div className="event" {...props}>
            Event
        </div>
    );
    const TrackEventComponent = trackEvent({
        eventPropName: 'onClick',
        category: 'category',
        action: 'action',
    })(EventComponentIn);

    const PageComponentIn = () => (
        <div className="page">
            <TrackEventComponent />
        </div>
    );
    const TrackPageComponent = trackPageView(PageComponentIn);

    const collect = x => x;
    const mockInstall = jest.fn(x => x);
    const mockUninstall = jest.fn(x => x);
    const mocktrackEvent = jest.fn(x => x);
    const mockTrackPageView = jest.fn(x => x);

    const provider = {
        install: mockInstall,
        uninstall: mockUninstall,
        trackEvent: mocktrackEvent,
        trackPageView: mockTrackPageView,
    };

    const wrapper = mount(
        <Tracker collect={collect} provider={provider}>
            <Router initialEntries={[{pathname: '/', key: 'noKey'}]}>
                <TrackPageComponent />
            </Router>
        </Tracker>
    );

    test('trackPageView should render children correct', () => {
        expect(wrapper.find('div.page').text()).toEqual('Event');
    });

    test('trackEvent should render children correct', () => {
        expect(wrapper.find('div.event').text()).toEqual('Event');
    });

    test('should invoke install after component mount', () => {
        expect(mockInstall.mock.calls.length).toEqual(1);
    });

    test('should invoke trackPageView after component mount', () => {
        expect(mockTrackPageView.mock.calls.length).toEqual(1);
    });

    test('should invoke trackEvent after component mount', () => {
        wrapper.find('div.event').simulate('click');
        expect(mocktrackEvent.mock.calls.length).toEqual(1);
    });

    test('should invoke install after component unmount', () => {
        wrapper.unmount();
        expect(mockUninstall.mock.calls.length).toEqual(1);
    });
});
