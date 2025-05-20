import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-eliminar-evento',
  templateUrl: './eliminar-evento.component.html',
  styleUrls: ['./eliminar-evento.component.scss']
})
export class EliminarEventoComponent {

  constructor(
    private eventosService: EventosService,
    private dialogRef: MatDialogRef<EliminarEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar_modal() {
    this.dialogRef.close({ isDelete: false });
  }

  eliminarEvento() {
    this.eventosService.eliminarEvento(this.data.id).subscribe(
      (response) => {
        console.log('Evento eliminado:', response);
        this.dialogRef.close({ isDelete: true });
      },
      (error) => {
        console.error('Error al eliminar evento:', error);
        this.dialogRef.close({ isDelete: false });
      }
    );
  }
}
