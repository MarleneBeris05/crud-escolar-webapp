import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaEvento() {
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico': [],
      'programa': '',
      'responsable_id': '',
      'descripcion': '',
      'cupo_max': ''
    };
  }

  public validarEvento(data: any, editar: boolean) {
   console.log("Validando evento... ", data);
    let error: any = [];

    if (!this.validatorService.required(data["nombre_evento"])) {
      error["nombre_evento"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["tipo_evento"])) {
      error["tipo_evento"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["fecha"])) {
      error["fecha"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["lugar"])) {
      error["lugar"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["publico"])) {
      error["publico"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["responsable_id"])) {
      error["responsable_id"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["cupo_max"])) {
      error["cupo_max"] = this.errorService.required;
    }
    return error;
  }

  public registrarEvento(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, httpOptions);
  }
  public obtenerResponsables(): Observable<any[]> {
    return this.http.get<any[]>('/api/usuarios?roles=maestro,administrador');
  }
  public obtenerEventoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${id}`, httpOptions);
  }
  public obtenerListaEventos (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, {headers:headers});
  }
  public editarEvento (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/eventos-edit/`, data, {headers:headers});
  }
  public eliminarEvento(id: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/eventos-edit/?id=${id}`,{headers:headers});
  }

}
