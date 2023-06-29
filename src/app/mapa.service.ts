import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  private mapa: google.maps.Map | null = null;
  private marcador: google.maps.Marker | null = null;
  private coordenadasActualizadasSubject = new Subject<{ latitud: number, longitud: number }>();
  private mapaActualizadoSubject = new Subject<google.maps.Map | null>();

  mapaActualizado$ = this.mapaActualizadoSubject.asObservable();
  coordenadasActualizadas$ = this.coordenadasActualizadasSubject.asObservable();


  constructor() { }

  setMapa(mapa: google.maps.Map | null) {
    this.mapa = mapa;
    this.mapaActualizadoSubject.next(this.mapa);
  }

  getMapa(): google.maps.Map | null {
    return this.mapa;
  }

  actualizarMarcador(coordenadas: { latitud: number; longitud: number }) {
    console.log('Latitud recibida:', coordenadas.latitud);
    console.log('Longitud recibida:', coordenadas.longitud);
    this.coordenadasActualizadasSubject.next(coordenadas);
    if (this.marcador) {
      const nuevaPosicion = new google.maps.LatLng(
        coordenadas.latitud,
        coordenadas.longitud
      );
      this.marcador.setPosition(nuevaPosicion);
    } else {
      const mapa = this.getMapa();
      if (mapa) {
        const nuevaPosicion = new google.maps.LatLng(
          coordenadas.latitud,
          coordenadas.longitud
        );
        this.marcador = new google.maps.Marker({
          position: nuevaPosicion,
          map: mapa,
          draggable: true
        });
      }
    }
  }
}
