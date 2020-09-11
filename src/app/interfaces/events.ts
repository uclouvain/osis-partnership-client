import Partner from './partners';

export interface VisibleMarkerChangedEvent {
    markers: Partner[];
    forceMapInfluence?: boolean;
}
