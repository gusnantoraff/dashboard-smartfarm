export interface Location {
  address: Address;
  boundingbox: string[];
  display_name: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  powered_by: string;
}

export interface Address {
  city: string;
  country: string;
  country_code: string;
  county: string;
  municipality: string;
  postcode: string;
  state: string;
  town: string;
}
