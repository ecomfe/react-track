import {NavLink} from 'react-router-dom';
import {TrackRoute} from '../../../src';

const Console = () => (
    <>
        <h2>Console</h2>
        <NavLink exact to="/console/logs" activeClassName="nav-link-active">Nested</NavLink>
        <TrackRoute path="/console/logs">
            <p style={{color: 'red'}}>
                This is an unwanted track router, see console warning.
            </p>
        </TrackRoute>
    </>
);

export default Console;
