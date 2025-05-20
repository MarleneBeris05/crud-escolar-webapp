import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {
  @Input() datos_evento: any = {};
  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idEvento: number = 0;
  public fechaMinima: string;
  public responsables: any[] = [];
  public fechaSeleccionada: string = '';

  public eventos: any[] = [
    {value: '1', viewValue: 'Conferencia'},
    {value: '2', viewValue: 'Taller'},
    {value: '3', viewValue: 'Seminario'},
    {value: '4', viewValue: 'Concurso'},
  ];

  public programas:any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'},
  ];

  public publicos:any[] = [
    {value: '1', nombre: 'Estudiantes'},
    {value: '2', nombre: 'Profesores'},
    {value: '3', nombre: 'Público General'},
  ];

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private adminService: AdministradoresService,
    private datePipe: DatePipe
  ) {}

ngOnInit(): void {
  const id = this.activatedRoute.snapshot.params['id'];
  const hoy = new Date();
  this.fechaMinima = hoy.toISOString().split('T')[0];
  this.cargarResponsables();

  if (id !== undefined) {
    this.editar = true;
    this.idEvento = Number(id);
    
    // Cargar evento desde el backend
    this.eventosService.obtenerEventoPorId(this.idEvento).subscribe(
      (data) => {
        this.evento = data;
        
        this.evento.hora_inicio = this.formatearHora(this.evento.hora_inicio);
        this.evento.hora_fin = this.formatearHora(this.evento.hora_fin);

        // Asegurar que público esté definido como arreglo
        if (!Array.isArray(this.evento.publico)) {
          this.evento.publico = [];
        }
      },
      (error) => {
        console.error('Error al obtener evento:', error);
        this.evento = this.eventosService.esquemaEvento(); // fallback
      }
    );
  } else {
    this.evento = this.eventosService.esquemaEvento();
    this.token = this.facadeService.getSessionToken();
  }
}

  

  public regresar() {
    this.location.back();
  }

  public registrar(){
    //Validar
    this.errors = [];

    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    this.evento.fecha = this.datePipe.transform(this.evento.fecha, 'yyyy-MM-dd');
    this.evento.hora_inicio = this.convertirHora(this.evento.hora_inicio);
    this.evento.hora_fin = this.convertirHora(this.evento.hora_fin);
      //Aquí si todo es correcto vamos a registrar - aquí se manda a llamar al servicio
    this.eventosService.registrarEvento(this.evento).subscribe(
        (response)=>{
          alert("Evento registrado correctamente");
          console.log("Evento registrado: ", response);
          if(this.token != ""){
            this.router.navigate(["home"]);
           }else{
             this.router.navigate(["/"]);
           }
        }, (error)=>{
          alert("No se pudo registrar el evento");
        }
      )
    }

  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.evento.fecha = this.datePipe.transform(this.evento.fecha, 'yyyy-MM-dd');
    this.evento.hora_inicio = this.convertirHora(this.evento.hora_inicio);
    this.evento.hora_fin = this.convertirHora(this.evento.hora_fin);

    this.eventosService.editarEvento(this.evento).subscribe(
      (response)=>{
        alert("Evento editado correctamente");
        console.log("Evento editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el Evento");
      }
    );
  }

  public onCheckboxChange(nombre: string, isChecked: boolean): void {
  if (isChecked) {
    if (!this.evento.publico.includes(nombre)) {
      this.evento.publico.push(nombre);
    }
  } else {
    const index = this.evento.publico.indexOf(nombre);
    if (index !== -1) {
      this.evento.publico.splice(index, 1);
    }
  }
}


  public soloLetrasNumerosEspacios(event: KeyboardEvent) {
    const tecla = event.key;
    const regex = /^[a-zA-Z0-9 ]$/;
    if (!regex.test(tecla)) {
      event.preventDefault(); 
    }
  }

 public soloLetras(event: KeyboardEvent) {
  const char = event.key;
  const regex = /^[a-zA-Z0-9\s.,;:]$/;
  if (!regex.test(char)) {
    event.preventDefault();
  }
}

  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.evento.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.evento.fecha);
  }

  public cargarResponsables(): void {
    this.adminService.getResponsables().subscribe(usuarios => {
      this.responsables = usuarios
        .filter(usuario => usuario.rol === 'maestro' || usuario.rol === 'administrador')
        .map(usuario => ({
          id: usuario.id,
          nombre: `${usuario.user.first_name} ${usuario.user.last_name}`
        }));
    }, error => {
      console.error('Error al cargar usuarios responsables:', error);
    });
  }

  public convertirHora(hora: string): string {
    const [time, modifier] = hora.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  public formatearHora(hora: string): string {
    if (!hora) return '';
    // Si viene con segundos, los quitamos: "14:00:00" → "14:00"
    return hora.split(':').slice(0, 2).join(':');
  }

}
