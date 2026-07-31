import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../dashboard/dashboard.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, StatCardComponent],
  template: `
    <div class="space-y-8 pb-12">
      
      <!-- Analytics Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Performance Analytics 📈
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into student enrollment trajectories, city demographics, and course revenues.
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-600 dark:text-slate-300">
            Academic Year 2025 - 2026
          </span>
        </div>
      </div>

      <!-- KPI Summary Banner -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <app-stat-card
          title="Completion Rate"
          value="94.2%"
          subtitle="Course finishing average"
          gradientClass="from-emerald-500 to-teal-500"
          iconBgClass="bg-emerald-500/10 text-emerald-500">
          <span icon>🎯</span>
        </app-stat-card>

        <app-stat-card
          title="Active Instructors"
          value="18"
          subtitle="Faculty members active"
          gradientClass="from-purple-500 to-indigo-500"
          iconBgClass="bg-purple-500/10 text-purple-500">
          <span icon>👨‍🏫</span>
        </app-stat-card>

        <app-stat-card
          title="Retention Ratio"
          value="98.7%"
          subtitle="Semester return rate"
          gradientClass="from-amber-500 to-orange-500"
          iconBgClass="bg-amber-500/10 text-amber-500">
          <span icon>⭐</span>
        </app-stat-card>
      </div>

      <!-- Main Dual Analytics Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Revenue & Tuition Velocity -->
        <div class="glass-card p-6 border border-slate-200 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">Tuition Revenue Velocity</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Gross tuition value processed (₹ INR)</p>
          
          <div class="h-72">
            <apx-chart
              [series]="revenueChart.series!"
              [chart]="revenueChart.chart!"
              [xaxis]="revenueChart.xaxis!"
              [stroke]="revenueChart.stroke!"
              [colors]="revenueChart.colors!"
              [grid]="revenueChart.grid!">
            </apx-chart>
          </div>
        </div>

        <!-- Grade Performance Distribution -->
        <div class="glass-card p-6 border border-slate-200 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">Grade Distribution Matrix</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Percentage of students per grade band</p>

          <div class="h-72">
            <apx-chart
              [series]="gradeChart.series!"
              [chart]="gradeChart.chart!"
              [xaxis]="gradeChart.xaxis!"
              [colors]="gradeChart.colors!"
              [grid]="gradeChart.grid!">
            </apx-chart>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AnalyticsComponent {
  revenueChart: ChartOptions = {
    series: [{ name: 'Revenue (₹)', data: [15000, 24000, 31000, 48000, 62000, 89000] }],
    chart: { type: 'line', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 Next', 'Q2 Next'] },
    stroke: { curve: 'smooth', width: 4 },
    colors: ['#10B981'],
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)' }
  };

  gradeChart: ChartOptions = {
    series: [{ name: 'Students', data: [42, 35, 15, 6, 2] }],
    chart: { type: 'bar', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { categories: ['A+ Grade', 'A Grade', 'B Grade', 'C Grade', 'Needs Improvement'] },
    colors: ['#6366F1'],
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)' }
  };
}
