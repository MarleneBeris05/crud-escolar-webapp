import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.scss']
})
export class EditarEventoComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar_modal(): void {
    this.dialogRef.close(false);
  }

  confirmarEdicion(): void {
    this.dialogRef.close(true);
  }
}
