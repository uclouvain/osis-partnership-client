import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as GeoJSON from 'geojson';
import { environment } from '../../../environments/environment';
import Partner from '../../interfaces/partners';
import { ActivatedRoute, Router } from '@angular/router';
import { HtmlElementPropertyService } from '../../services/html-element-property.service';
import { VisibleMarkerChangedEvent } from '../../interfaces/events';


/**
 * Create one pixel tall black image of a given width
 */
const createLineImage = (width) => {
  const bytesPerPixel = 4; // Each pixel is 4 bytes: red, green, blue, and alpha.
  const data = new Uint8Array(width * bytesPerPixel);

  for (let x = 0; x < width; x++) {
    const offset = x * bytesPerPixel;
    data[offset] = 0; // red
    data[offset + 1] = 0; // green
    data[offset + 2] = 0; // blue
    data[offset + 3] = 255; // alpha
  }
  return { data, width, height: 1 };
};

const markerLayers = ['unclustered-point', 'clusters'];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() markers: Partner[] = [];
  @Input() visible = false;
  @Input() loading = false;
  @Output() visibleMarkersChanged = new EventEmitter<VisibleMarkerChangedEvent>();
  @Output() switchToList = new EventEmitter();

  private map: mapboxgl.Map;
  private source: mapboxgl.GeoJSONSource;
  private style = 'mapbox://styles/mapbox/light-v10';

  // Center on a point in the south of the mediterranean
  private defaultCenter = { lat: 20, lon: 22 };
  private defaultZoom = 1;
  private bbox: mapboxgl.LngLatBounds;

  private maxZoom = 9;
  public mainColor: string;
  public height: number;

  constructor(
    private router: Router,
    private htmlElementPropertyService: HtmlElementPropertyService,
    private route: ActivatedRoute,
  ) {
    this.mainColor = htmlElementPropertyService.get('main-color', '#ddc000');
    this.height = htmlElementPropertyService.get('height', 500);

    // Mapbox is unable to parse hash properly
    this.route.queryParams.subscribe((queryParams: any): any => {
      if (queryParams.map) {
        const values = queryParams.map.split('/');
        this.defaultZoom = values[0];
        this.defaultCenter = {
          lat: values[1],
          lon: values[2],
        };
      }
    });
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.markers && changes.markers.previousValue !== changes.markers.currentValue) {
      this.markers = changes.markers.currentValue;
      this.updateSource();
    }
    // This ensures the canvas is correctly dimensionned with height
    if (this.map) {
      this.map.resize();
    }
  }

  /**
   * Update the GeoJSON source with markers from the search
   */
  private updateSource() {
    if (this.source) {
      this.source.setData({
        type: 'FeatureCollection',
        features: this.markers.map(({ location, ...properties }) => ({
          type: 'Feature',
          geometry: location,
          properties
        })),
      });

      const bounds = new mapboxgl.LngLatBounds();
      this.markers.map(({ location }) => {
        if (location) {
          // @ts-ignore
          bounds.extend(location.coordinates);
        }
      });
      if (!bounds.isEmpty()) {
        this.map.fitBounds(bounds, { linear: true });
      }
    }
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.defaultZoom,
      minZoom: 1,
      maxZoom: this.maxZoom,
      center: this.defaultCenter,
      accessToken: environment.mapbox.accessToken,
      hash: 'map',
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.initializeLayers();
      this.initializeMapEvents();
    });
  }

  private initializeLayers() {
    // Add GeoJSON source
    this.map.addSource('markers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      },
      cluster: true,
      clusterRadius: 65,
      // Sum the partnership count in clusters
      clusterProperties: {
        sum: ['+', ['get', 'partnerships_count']],
      }
    });
    this.source = this.map.getSource('markers') as mapboxgl.GeoJSONSource;
    this.updateSource();

    // Layer for cluster circles
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 20,
        'circle-stroke-width': 3,
        'circle-stroke-color': this.mainColor,
      }
    });

    // Layer for cluster text
    this.map.addImage('line', createLineImage(25));
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count}\n{sum}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-line-height': 1.5,
        'icon-image': 'line',
      },
    });

    // Layer for normal circles (single points)
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': this.mainColor,
        'circle-radius': 12,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff'
      }
    });
    this.map.addLayer({
      id: 'unclustered-point-detail',
      type: 'symbol',
      source: 'markers',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': '{partnerships_count}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#fff',
      }
    });
  }

  private initializeMapEvents() {
    // Zoom in a cluster on click
    this.map.on('click', 'clusters', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      }) as GeoJSON.Feature<GeoJSON.Point>[];

      const feature = features[0] as GeoJSON.Feature<GeoJSON.Point>;
      if (this.map.getZoom() === this.maxZoom) {
        // Get cluster leaves and switch to list
        this.source.getClusterLeaves(
          feature.properties.cluster_id,
          feature.properties.point_count,
          0,
          (error, leaves) => {
            const markers = leaves.map(leave => leave.properties) as Partner[];
            this.visibleMarkersChanged.emit({ markers, forceMapInfluence: true });
            this.switchToList.emit();
          }
        );
      } else {
        this.source.getClusterExpansionZoom(
          feature.properties.cluster_id,
          (err, zoom) => {
            if (err) {
              return;
            }

            this.map.easeTo({
              // @ts-ignore
              center: feature.geometry.coordinates,
              zoom: Math.min(zoom, this.maxZoom)
            });
          }
        );
      }
    });

    // Display a popup on hovering single partner
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.map.on('mouseover', 'unclustered-point', e => {
      this.map.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0] as GeoJSON.Feature<GeoJSON.Point>;
      // Initialize a popup and set its coordinates based on the feature found.
      // @ts-ignore
      popup.setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.name)
        .addTo(this.map);
    });
    this.map.on('mouseout', 'unclustered-point', () => {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = '';
      popup.remove();
    });

    // Go to partnership details
    this.map.on('click', 'unclustered-point', e => {
      const feature = e.features[0] as GeoJSON.Feature<GeoJSON.Point>;
      // Go to partner modal.
      this.router.navigate(['', feature.properties.uuid], {
        queryParamsHandling: 'merge',
        queryParams: {
          partnerFilter: feature.properties.uuid
        }
      });
    });


    // Change the mouse pointer on markers
    const changeMousePointer = () => this.map.getCanvas().style.cursor = 'pointer';
    const resetMousePointer = () => this.map.getCanvas().style.cursor = '';
    markerLayers.map(layerName => this.map
      .on('mouseenter', layerName, changeMousePointer)
      .on('mouseleave', layerName, resetMousePointer)
    );

    this.map.on('zoomend', this.updateListButtonLabel);
    this.map.on('moveend', this.updateListButtonLabel);

    // Trigger the above
    this.map.zoomTo(this.map.getZoom());
  }

  repaint() {
    setTimeout(() => this.map.resize(), 50);
  }

  /**
   * Update the list button label when navigating the map
   */
  updateListButtonLabel = async () => {
    if (!this.visible) {
      // early return in case map is not visible
      return;
    }
    this.bbox = this.map.getBounds();

    // Get all visible partners
    const features = this.map.queryRenderedFeatures(null, {
      layers: markerLayers,
    });

    // Get leaves of clusters along with normal points
    const markersPromises = features.map(({ properties: { point_count, cluster_id, ...properties } }) => {
      return new Promise(resolve => {
          if (cluster_id) {
            // get leaves
            this.source.getClusterLeaves(
              cluster_id,
              point_count,
              0,
              (error, leaves) =>
                resolve(leaves.map(leave => leave.properties))
            );
          } else {
            // normal point, return properties
            resolve([properties]);
          }
        }
      );
    });
    const markersResults = await Promise.all(markersPromises);
    const markers = [].concat(...markersResults.filter(Boolean));

    this.visibleMarkersChanged.emit({ markers });
  }
}
