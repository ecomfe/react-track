import {TrackerCollect} from '../types';

const context = <T>(context: T): TrackerCollect => () => context;

export default context;
