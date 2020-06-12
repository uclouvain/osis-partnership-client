export default interface Marker {
  name: string;
  uuid: string;
  partnerships_count: number;
  location: GeoJSON.Geometry;
}
