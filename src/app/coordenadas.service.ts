import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoordenadasService {
  public latitud: number;
  public longitud: number;

  constructor() {
    this.latitud = 0;
    this.longitud = 0;
  }

  setLatitud(latitud: number) {
    this.latitud = latitud;
    console.log('Latitud recibida en CoordenadasService:', this.latitud);
  }

  setLongitud(longitud: number) {
    this.longitud = longitud;
    console.log('Longitud recibida en CoordenadasService:', this.longitud);
  }

  getLatitud(): number {
    return this.latitud;
  }

  getLongitud(): number {
    return this.longitud;
  }
}
