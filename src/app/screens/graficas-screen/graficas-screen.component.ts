import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';



@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{
 

  //Agregar chartjs-plugin-datalabels
  //Variables
  public total_user: any = {};
  //Histograma
  lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data:[89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de eventos',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData = {
    labels: ["Desarrollo Web", "Minería de Datos", "Redes", "Móviles", "Matemáticas"],
    datasets: [
      {
        data:[34, 43, 54, 28, 74],
        label: 'Registro de eventos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];
  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[89, 34, 43],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:true
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  // Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[10,20 ,30 ],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:true
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ){}

  ngOnInit(): void {
    this.obtenerTotalUsers();
    console.log("Data: ", this.doughnutChartData);
  }

  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
      

        const adminCount = response.admins || 0;
      const teacherCount = response.maestros || 0;
      const studentCount = response.alumnos || 0;

      const newData = [adminCount, teacherCount, studentCount];

      // Actualizar gráfica doughnut
      this.doughnutChartData.datasets[0].data = newData;

      // Actualizar gráfica circular (pie)
      this.pieChartData.datasets[0].data = newData;


      console.log("Datos  actualizados: ", this.total_user);
      }, (error)=>{
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }
}