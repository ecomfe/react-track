import {createContext, FC, ReactNode, useContext} from 'react';
import {TrackConfig} from '../../interface';

interface Props extends Partial<TrackConfig> {
    children: ReactNode;
}

const DEFAULT_VALUE: TrackConfig = {
    reportPageViewOnLeafOnly: false,
    warnNestedTrackRoute: true,
};
const Context = createContext(DEFAULT_VALUE);
Context.displayName = 'TrackConfigProvider';

const TrackConfigProvider: FC<Props> = ({children, ...props}) => {
    const value: TrackConfig = {...DEFAULT_VALUE, ...props};

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default TrackConfigProvider;

export const useTrackConfig = () => useContext(Context);
