import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { CoordenadasService } from '../coordenadas.service';
import { MapaService } from '../mapa.service';

@Component({
  selector: 'app-formulario-establecimiento',
  templateUrl: './formulario-establecimiento.component.html',
  styleUrls: ['./formulario-establecimiento.component.css']
})
export class FormularioEstablecimientoComponent {
  // Propiedades del formulario
  puebloMagico: string;
  nombreLocal: string;
  horarioAtencion: string;
  descripcionNegocio: string;
  propietario: string;
  redesSociales: string;
  foto: File | null;
  fotoURL: string | null;
  // Propiedades de la ventana modal
  mostrarModal: boolean;
  establecimientos: any[];
  latitud: number;
  longitud: number;

  constructor(private databaseService: DatabaseService,
    private coordenadasService: CoordenadasService,
    private mapaService: MapaService) {
    this.puebloMagico = '';
    this.nombreLocal = '';
    this.horarioAtencion = '';
    this.descripcionNegocio = '';
    this.propietario = '';
    this.redesSociales = '';
    this.foto = null;
    this.fotoURL = null;
    this.mostrarModal = false;
    this.establecimientos = [];
    this.latitud = 0;
    this.longitud = 0;
  }



  guardarEstablecimiento() {

    const nuevoEstablecimiento = {
      nombre: this.nombreLocal,
      fecha: this.horarioAtencion,
      puebloMagico: this.puebloMagico,
      descripcionNegocio: this.descripcionNegocio,
      propietario: this.propietario,
      redesSociales: this.redesSociales,
      foto: this.foto,
      latitud: this.coordenadasService.getLatitud().toString(),
      longitud: this.coordenadasService.getLongitud().toString(),

    };

    console.log('Coordenadas:', nuevoEstablecimiento.latitud, nuevoEstablecimiento.longitud);



    this.databaseService.guardarEstablecimiento(nuevoEstablecimiento, this.mostrarModal)
      .then(() => {
        console.log('Establecimiento guardado');
        console.log("Datos Salida: ", nuevoEstablecimiento);
      })
      .catch(error => {
        console.error('Error al guardar el establecimiento', error);
        // Maneja el error de manera adecuada
      });
  }

  onFileSelected(event: any) {
    this.foto = event.target.files[0];
  }

  limpiarCampos() {
    this.puebloMagico = '';
    this.nombreLocal = '';
    this.horarioAtencion = '';
    this.descripcionNegocio = '';
    this.propietario = '';
    this.redesSociales = '';
    this.foto = null;
    this.fotoURL = null;
  }



  abrirModal() {
    this.mostrarModal = true;
    this.establecimientos = [];

    this.databaseService.obtenerEstablecimientos().subscribe(establecimientos => {
      this.establecimientos = establecimientos.filter(establecimiento => establecimiento.nombre && establecimiento.nombre.trim() !== '');
    }, error => {
      console.error('Error al obtener los establecimientos', error);
    });
  }


  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarEstablecimiento(establecimiento: any) {
    // Verificar si hay cambios en los campos del formulario antes de seleccionar el establecimiento
    const hayCambios = this.nombreLocal !== establecimiento.nombre ||
      this.horarioAtencion !== establecimiento.fecha ||
      this.puebloMagico !== establecimiento.puebloMagico ||
      this.descripcionNegocio !== establecimiento.descripcionNegocio ||
      this.propietario !== establecimiento.propietario ||
      this.redesSociales !== establecimiento.redesSociales;

    if (hayCambios) {
      // Solicitar confirmación antes de reemplazar los campos del formulario
      const confirmacion = confirm('Hay cambios sin guardar en el formulario. ¿Deseas descartar los cambios y seleccionar el establecimiento?');
      if (confirmacion) {
        // Rellenar los campos del formulario con la información del establecimiento seleccionado
        this.nombreLocal = establecimiento.nombre;
        this.horarioAtencion = establecimiento.fecha;
        this.puebloMagico = establecimiento.puebloMagico;
        this.descripcionNegocio = establecimiento.descripcionNegocio;
        this.propietario = establecimiento.propietario;
        this.redesSociales = establecimiento.redesSociales;
        this.fotoURL = establecimiento.fotoURL;

        this.mapaService.actualizarMarcador({
          latitud: establecimiento.latitud,
          longitud: establecimiento.longitud
        });

        console.log("Datos entrada: ",establecimiento);

        // Cerrar el modal
        this.cerrarModal();
      }
    } else {
      // Si no hay cambios, simplemente seleccionar el establecimiento
      // Rellenar los campos del formulario con la información del establecimiento seleccionado
      this.nombreLocal = establecimiento.nombre;
      this.horarioAtencion = establecimiento.fecha;
      this.puebloMagico = establecimiento.puebloMagico;
      this.descripcionNegocio = establecimiento.descripcionNegocio;
      this.propietario = establecimiento.propietario;
      this.redesSociales = establecimiento.redesSociales;

      this.mapaService.actualizarMarcador({
        latitud: establecimiento.latitud,
        longitud: establecimiento.longitud
      });

      // Cerrar el modal
      this.cerrarModal();
    }
  }

  actualizarMapa() {
    const mapa = this.mapaService.getMapa();
    if (mapa) {
      console.log("Latitud actualizada: ", );

      const latitud = this.coordenadasService.getLatitud();
      const longitud = this.coordenadasService.getLongitud();
      const nuevaPosicion = new google.maps.LatLng(latitud, longitud);
      mapa.setCenter(nuevaPosicion);



    }
  }
}
