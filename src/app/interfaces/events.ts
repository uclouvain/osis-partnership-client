import Partner from './partners';
import { LngLatBounds } from 'mapbox-gl';

export interface VisibleMarkerChangedEvent {
    markers: Partner[];
    forceMapInfluence?: boolean;
}

export interface BBoxChangedEvent {
    bbox: LngLatBounds;
}
