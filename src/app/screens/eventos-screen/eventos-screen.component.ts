import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarEventoComponent } from 'src/app/modals/eliminar-evento/eliminar-evento.component';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent {
  public token : string = "";
  public lista_eventos: any[] = [];
  public usuario_rol: string = '';

  //Para la tabla
  displayedColumns: string[] = ['nombre_evento', 'tipo_evento', 'fecha', 'hora_inicio', 'hora_fin', 'lugar', 'publico', 'programa', 'responsable', 'descripcion', 'cupo_max', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate([""]);
    }
    //Para paginador
    this.initPaginator();
    this.usuario_rol = this.facadeService.getUserGroup();
    this.displayedColumns = [
        'nombre_evento', 'tipo_evento', 'fecha', 'hora_inicio', 'hora_fin',
        'lugar', 'publico', 'programa', 'responsable', 'descripcion', 'cupo_max'
      ];

      if (this.usuario_rol === 'administrador') {
        this.displayedColumns.push('editar', 'eliminar');
      }
    this.obtenerEventos();
  }

  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

    public obtenerEventos() {
      this.eventosService.obtenerListaEventos().subscribe(
        (response) => {
          let eventosFiltrados = response;

          if (this.usuario_rol === 'alumno') {
            eventosFiltrados = response.filter(evento => {
              const publico = (evento.publico || []).map((p: string) =>
                p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '')
              );
              return publico.includes('estudiantes') || publico.includes('publico general');
            });
          } else if (this.usuario_rol === 'maestro') {
            eventosFiltrados = response.filter(evento => {
              const publico = (evento.publico || []).map((p: string) =>
                p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '')
              );
              return publico.includes('profesores') || publico.includes('publico general');
            });
          } else if (this.usuario_rol === 'administrador') {
            // El administrador ve todos los eventos, no se filtra
            eventosFiltrados = response;
          }

          this.lista_eventos = eventosFiltrados;
          this.dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);
        },
        (error) => {
          alert("No se pudo obtener la lista de eventos");
        }
      );
    }


    public goEditar(id: number){
    this.router.navigate(["registro-eventos/"+id]);
    }
  
    public delete(id: number){
      const evento = this.lista_eventos.find(e => e.id === id);

      const dialogRef = this.dialog.open(EliminarEventoComponent, {
        data: { 
          id: id,
          nombre_evento: evento?.nombre_evento || ''
        }, 
        height: '288px',
        width: '328px',
      });


    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Evento eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Evento no eliminado ");
        console.log("No se eliminó el evento");
      }
    });
  }
}

export interface DatosEvento {
  nombre_evento: string;
  tipo_evento: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  publico: string;
  programa: string;
  responsable_id: {
    user: {
      first_name: string;
      last_name: string;
    }
  };
  descripcion: string;
  cupo_max: number;
}
