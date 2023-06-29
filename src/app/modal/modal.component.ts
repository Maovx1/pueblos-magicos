import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() establecimientos!: any[];
  @Output() seleccionarEstablecimiento: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalCerrado: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  seleccionar(establecimiento: any) {
    this.seleccionarEstablecimiento.emit(establecimiento);
  }

  cerrarModal() {
    this.modalCerrado.emit();
  }
}
