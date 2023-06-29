
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule} from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { provideFirebaseApp, initializeApp  } from '@angular/fire/app';
import { environment } from '../environments/environment';
// import { provideAuth,getAuth } from '@angular/fire/auth';
// import { provideDatabase,getDatabase } from '@angular/fire/database';
import { FormularioEstablecimientoComponent } from './formulario-establecimiento/formulario-establecimiento.component';
import { ModalComponent } from './modal/modal.component';

import {GoogleMapsModule} from '@angular/google-maps';

import { CoordenadasService } from './Services/coordenadas.service';

@NgModule({
  declarations: [
    AppComponent,
    FormularioEstablecimientoComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    GoogleMapsModule
  ],
  providers: [
    CoordenadasService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
