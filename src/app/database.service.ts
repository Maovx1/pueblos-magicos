import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { map } from 'rxjs/operators'; // Agrega esta línea para importar el operador map

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  establecimientosRef: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.establecimientosRef = this.db.list('Establecimientos');
  }

  guardarEstablecimiento(establecimiento: any, abrirModal: boolean) {
    if (!abrirModal) {
      // La variable abrirModal es falsa, continuar con la función
      return new Promise<void>((resolve, reject) => {
        if (establecimiento.foto && typeof establecimiento.foto !== 'string') {
          console.log("Entrando al if");
          const fotoPath = `establecimientos/${new Date().getTime()}_${establecimiento.foto.name}`;
          const fotoRef = this.storage.ref(fotoPath);
          const fotoTask = fotoRef.put(establecimiento.foto);

          fotoTask.snapshotChanges().pipe(
            finalize(() => {
              fotoRef.getDownloadURL().subscribe((downloadURL: string) => {
                const nuevoEstablecimiento = {
                  nombre: establecimiento.nombre,
                  fecha: establecimiento.fecha,
                  puebloMagico: establecimiento.puebloMagico,
                  descripcionNegocio: establecimiento.descripcionNegocio,
                  propietario: establecimiento.propietario,
                  redesSociales: establecimiento.redesSociales,
                  fotoURL: downloadURL,
                  latitud: establecimiento.latitud,
                  longitud: establecimiento.longitud
                };

                this.establecimientosRef.push(nuevoEstablecimiento)
                  .then(() => {
                    resolve();
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
            })
          ).subscribe();
        } else {
          console.log("Entrando al else");
          const nuevoEstablecimiento = {
            nombre: establecimiento.nombre,
            fecha: establecimiento.fecha,
            puebloMagico: establecimiento.puebloMagico,
            descripcionNegocio: establecimiento.descripcionNegocio,
            propietario: establecimiento.propietario,
            redesSociales: establecimiento.redesSociales,
            latitud: establecimiento.latitud,
            longitud: establecimiento.longitud
          };

          this.establecimientosRef.push(nuevoEstablecimiento)
            .then(() => {
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    } else {
      // La variable abrirModal es verdadera, retornar sin hacer nada
      console.log('No se ejecutará la función guardarEstablecimiento() debido a que abrirModal es verdadero.');
      return Promise.resolve();
    }
  }


  obtenerEstablecimientos() {
    return this.establecimientosRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
    );
  }
}
