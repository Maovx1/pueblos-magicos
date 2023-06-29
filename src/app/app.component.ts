import { Component, OnInit } from '@angular/core';
import { MapaService } from './Services/mapa.service';
import { CoordenadasService } from './Services/coordenadas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pueblos-magicos';
  mapCenter: google.maps.LatLngLiteral;
  mapZoom: number;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  markerPositions: google.maps.LatLngLiteral[] = [];
  Latitud = 0;
  Longitud = 0;

  constructor(private mapaService: MapaService, private coordenadasService: CoordenadasService) {
    this.mapCenter = { lat: 19.465817750657045, lng: -99.10986328125 }; // Coordenadas iniciales
    this.mapZoom = 9; // Zoom inicial
  }

  ngOnInit() {
    this.mapaService.mapaActualizado$.subscribe((mapa) => {
      if (mapa) {
        const center = mapa.getCenter() as google.maps.LatLng;
        this.mapCenter = {
          lat: center.lat(),
          lng: center.lng()
        };
      }
    });

    this.mapaService.coordenadasActualizadas$.subscribe((coordenadas) => {
      this.Latitud = coordenadas.latitud;
      this.Longitud = coordenadas.longitud;
      console.log('App Latitud:', this.Latitud);
      console.log('App Longitud:', this.Longitud);
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.pop();
    this.markerPositions.push(event.latLng.toJSON());
    this.Latitud = event.latLng.lat();
    this.Longitud = event.latLng.lng();

    this.mapaService.actualizarMarcador({
      latitud: this.Latitud,
      longitud: this.Longitud
    });

    this.coordenadasService.setLatitud(this.Latitud);
    this.coordenadasService.setLongitud(this.Longitud);
  }

  actCoords(event: google.maps.MapMouseEvent) {
    this.Latitud = event.latLng.lat();
    this.Longitud = event.latLng.lng();
  }

  establecerMarcador() {
    const latitud = parseFloat(this.Latitud.toString());
    const longitud = parseFloat(this.Longitud.toString());
    if (!isNaN(latitud) && !isNaN(longitud)) {
      const position: google.maps.LatLngLiteral = { lat: latitud, lng: longitud };
      this.markerPositions.pop();
      this.markerPositions.push(position);
    }
  }
}
