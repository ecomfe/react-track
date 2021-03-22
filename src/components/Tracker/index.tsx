import {FC, ComponentProps} from 'react';
import ConfigProvider, {useTrackConfig} from './ConfigProvider';
import TrackProvider, {useTrackEvent, useTrackPageView} from './TrackProvider';

type Props = ComponentProps<typeof ConfigProvider> & ComponentProps<typeof TrackProvider>;

const Tracker: FC<Props> = ({collect, provider, children, ...props}) => (
    <ConfigProvider {...props}>
        <TrackProvider collect={collect} provider={provider}>
            {children}
        </TrackProvider>
    </ConfigProvider>
);

export default Tracker;

export {
    useTrackConfig,
    useTrackEvent,
    useTrackPageView,
};
