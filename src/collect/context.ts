import {TrackerCollect} from '../interface';

const context = <T>(context: T): TrackerCollect => () => context;

export default context;
