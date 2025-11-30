import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  chart: any;
  totalSales = 0;
  totalUsers = 0;
  totalTraffic = 0;

  constructor(private apiService: ApiService, private socketService: SocketService) { } // Injected SocketService

  ngOnInit() {
    // Listen for real-time updates
    this.socketService.on('analyticsUpdate').subscribe((data: any) => {
      this.updateChart(data);
    });
  }

  ngAfterViewInit() {
    this.apiService.getAnalytics().subscribe((data: any) => {
      this.totalSales = data.currentSales; // Real total
      this.totalUsers = data.currentUsers; // Real total
      this.totalTraffic = data.currentTraffic; // Real total

      this.initChart(data);
    });
  }

  initChart(data: any) {
    const ctx = document.getElementById('analyticsChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Sales',
              data: [12, 19, 3, 5, 2, 30], // Reduced scale
              borderColor: '#4F46E5',
              tension: 0.4
            },
            {
              label: 'Users',
              data: data.users,
              borderColor: '#10B981',
              tension: 0.4
            },
            {
              label: 'Traffic',
              data: [50, 60, 40, 70, 80, 90], // Reduced scale
              borderColor: '#3B82F6',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Analytics'
            }
          }
        }
      });
    }
  }

  updateChart(data: any) {
    if (this.chart) {
      // Update totals if present
      if (data.sales !== undefined) this.totalSales = data.sales;
      if (data.traffic !== undefined) this.totalTraffic = data.traffic;
      if (data.currentUsers !== undefined) this.totalUsers = data.currentUsers;

      // Shift data for real-time effect
      const salesData = this.chart.data.datasets[0].data;
      const usersData = this.chart.data.datasets[1].data;
      const trafficData = this.chart.data.datasets[2].data;

      // Only push if data is present, otherwise repeat last value to keep line moving
      salesData.push(data.sales !== undefined ? data.sales : salesData[salesData.length - 1]);
      salesData.shift();

      usersData.push(data.currentUsers !== undefined ? data.currentUsers : usersData[usersData.length - 1]);
      usersData.shift();

      trafficData.push(data.traffic !== undefined ? data.traffic : trafficData[trafficData.length - 1]);
      trafficData.shift();

      this.chart.update();
    }
  }

  simulateSale() {
    this.apiService.recordSale().subscribe();
  }
}
