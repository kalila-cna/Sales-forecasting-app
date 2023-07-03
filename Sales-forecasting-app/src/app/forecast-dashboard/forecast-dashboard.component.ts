import { Component, OnInit } from '@angular/core';
import { FlaskapiService } from '../flaskapi.service';

@Component({
  selector: 'app-forecast-dashboard',
  templateUrl: './forecast-dashboard.component.html',
  styleUrls: ['./forecast-dashboard.component.css'],
  providers: [FlaskapiService],
})
export class ForecastDashboardComponent implements OnInit {
  mae: number;
  mape: number;
  mse: number;
  rmse: number;
  metrics_data: any;
  duration: number;
  period: string;


  constructor() {}

  ngOnInit(): void {
    this.set_metrics();
  }

  set_metrics() {
    this.metrics_data = localStorage.getItem('metricsData');
    this.metrics_data = JSON.parse(this.metrics_data);

    this.mape = this.metrics_data['mape'];
    this.mae = this.metrics_data['mae'].toFixed(3);
    this.mse = this.metrics_data['mse'].toFixed(3);
    this.rmse = this.metrics_data['rmse'].toFixed(3);
    this.duration = this.metrics_data['duration'];
    this.period = this.metrics_data['period'];
  }
}
