import { Component } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {

  uuid = '';
  model = '';
  platform = '';
  version = '';
  map: mapboxgl.Map;
  lat = 0;
  long = 0;

  constructor(private device: Device, private geolocation: Geolocation) { }

  async ionViewWillEnter() {
    this.uuid = this.device.uuid;
    this.model = this.device.model;
    this.platform = this.device.platform;
    this.version = this.device.version;
    await this.getLocation();
  }

  async getLocation() {
    const subscription = this.geolocation.watchPosition().subscribe(position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      this.buildMap();
      subscription.unsubscribe();
    });
  }

  buildMap() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [this.long, this.lat],
      zoom: 15,
    });

    const marker = new mapboxgl.Marker().setLngLat([this.long, this.lat]).addTo(this.map);
  }
}
