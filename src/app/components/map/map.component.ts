import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartnershipsService } from '../../services/partnerships.service';
import { getPartnerParams } from '../../helpers/partnerships.helpers';
import { catchError } from 'rxjs/operators';
import Marker from '../../interfaces/marker';
import * as mapboxgl from 'mapbox-gl';
import * as GeoJSON from 'geojson';
import { environment } from '../../../environments/environment';


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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public loading = true;
  public mapError = false;
  public markers: Marker[];

  public partnershipsDisplayed = 0;
  public partnersDisplayed = 0;

  private map: mapboxgl.Map;
  private source: mapboxgl.GeoJSONSource;
  private style = 'mapbox://styles/mapbox/light-v10';
  private defaultCenter = { lat: 20, lon: 22 };
  private bbox: mapboxgl.LngLatBounds;

  private maxZoom = 7;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  ngOnInit(): void {
    this.initializeMap();
    this.route.queryParams.subscribe((queryParams: Params): any => {
      this.fetchMarkers(queryParams);
    });
  }

  fetchMarkers(queryParams: Params): void {
    this.loading = true;
    this.markers = [];
    this.partnershipsService.searchMarkers(getPartnerParams(queryParams))
      .pipe(
        catchError((): any => {
          this.mapError = true;
          this.loading = false;
        })
      )
      .subscribe((markers: Marker[]) => {
        this.mapError = false;
        this.loading = false;
        this.markers = markers;
        this.partnersDisplayed = markers.length;
        this.partnershipsDisplayed = 0;
        markers.map((marker => this.partnershipsDisplayed += marker.partnerships_count));
        this.updateSource();
      });
  }

  /**
   * Update the GeoJSON source with markers from the search
   */
  private updateSource() {
    if (this.source) {
      this.source.setData({
        type: 'FeatureCollection',
        features: this.markers.map(m => ({
          type: 'Feature',
          geometry: m.location,
          properties: {
            ...m
          }
        })),
      });
    }
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 1,
      maxZoom: this.maxZoom,
      center: this.defaultCenter,
      accessToken: environment.mapbox.accessToken,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
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
          'circle-stroke-color': '#5eb3e4',
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
          'circle-color': '#5eb3e4',
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

      // Zoom in a cluster on click
      this.map.on('click', 'clusters', (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        }) as GeoJSON.Feature<GeoJSON.Point>[];
        this.source.getClusterExpansionZoom(
          features[0].properties.cluster_id,
          (err, zoom) => {
            if (err) {
              return;
            }

            this.map.easeTo({
              // @ts-ignore
              center: features[0].geometry.coordinates,
              zoom: Math.min(zoom, this.maxZoom)
            });
          }
        );
      });

      const markerLayers = ['unclustered-point', 'clusters'];

      // Change the mouse pointer on markers
      const changeMousePointer = () => this.map.getCanvas().style.cursor = 'pointer';
      const resetMousePointer = () => this.map.getCanvas().style.cursor = '';
      markerLayers.map(layerName => this.map
        .on('mouseenter', layerName, changeMousePointer)
        .on('mouseleave', layerName, resetMousePointer)
      );

      // Update the list button label when navigating the map
      const updateListButtonLabel = () => {
        this.bbox = this.map.getBounds();

        const displayedMarkers = this.map.queryRenderedFeatures(null, {
          layers: markerLayers,
        });
        this.partnersDisplayed = 0;
        displayedMarkers.map((marker => this.partnersDisplayed += (
          marker.properties.point_count || 1
        )));
        this.partnershipsDisplayed = 0;
        displayedMarkers.map((marker => this.partnershipsDisplayed += (
          marker.properties.partnerships_count || marker.properties.sum
        )));
      };
      this.map.on('zoomend', updateListButtonLabel);
      this.map.on('moveend', updateListButtonLabel);
    });
  }

  goToList() {
    this.router.navigate(['partners'], {
      queryParamsHandling: 'merge',
      queryParams: {
        bbox: this.bbox
      }
    });
  }
}
