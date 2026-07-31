import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule, ApexAxisChartSeries, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, ApexLegend, ApexGrid } from 'ng-apexcharts';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StudentService } from '../../core/services/student.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Student } from '../../core/models/student.model';
import { ThemeService } from '../../core/services/theme.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  labels?: string[];
  legend?: ApexLegend;
  grid?: ApexGrid;
  colors?: string[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule,
    StatCardComponent
  ],
  template: `
    <div class="space-y-8 pb-12">
      
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Overview 🚀
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and database management metrics.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/enrollments/wizard"
            class="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 active:scale-95">
            <span>⚡</span> Quick Enroll Student
          </a>
        </div>
      </div>

      <!-- KPI Analytics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <app-stat-card
          title="Total Students"
          [value]="totalStudents()"
          subtitle="Database registered students"
          gradientClass="from-blue-500 to-indigo-500"
          iconBgClass="bg-blue-500/10 text-blue-500">
          <span icon class="text-xl">🎓</span>
        </app-stat-card>

        <app-stat-card
          title="Total Courses"
          [value]="totalCourses()"
          subtitle="Active course catalog"
          gradientClass="from-emerald-500 to-teal-500"
          iconBgClass="bg-emerald-500/10 text-emerald-500">
          <span icon class="text-xl">📚</span>
        </app-stat-card>

        <app-stat-card
          title="Total Enrollments"
          [value]="totalEnrollments()"
          subtitle="Active student enrollments"
          gradientClass="from-purple-500 to-violet-500"
          iconBgClass="bg-purple-500/10 text-purple-500">
          <span icon class="text-xl">⚡</span>
        </app-stat-card>

        <app-stat-card
          title="Avg. Course Fee"
          [value]="'₹' + avgCourseFee().toFixed(2)"
          subtitle="Calculated catalog average"
          gradientClass="from-amber-500 to-orange-500"
          iconBgClass="bg-amber-500/10 text-amber-500">
          <span icon class="text-xl">💰</span>
        </app-stat-card>

      </div>

      <!-- Charts Section Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Enrollment Velocity Chart -->
        <div class="lg:col-span-2 glass-card p-6 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Enrollment Metrics</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Database student course links</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-500 rounded-lg">
              Spring Boot API Live
            </span>
          </div>

          <div *ngIf="trendChartOptions.series" class="w-full h-72">
            <apx-chart
              [series]="trendChartOptions.series!"
              [chart]="trendChartOptions.chart!"
              [xaxis]="trendChartOptions.xaxis!"
              [stroke]="trendChartOptions.stroke!"
              [tooltip]="trendChartOptions.tooltip!"
              [grid]="trendChartOptions.grid!"
              [colors]="trendChartOptions.colors!">
            </apx-chart>
          </div>
        </div>

        <!-- Students per City Donut Chart -->
        <div class="glass-card p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Geographic Breakdown</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Students per city in database</p>
          </div>

          <div *ngIf="cityChartOptions.series && cityChartOptions.series.length > 0" class="my-6 flex justify-center">
            <apx-chart
              [series]="cityChartOptions.series!"
              [chart]="cityChartOptions.chart!"
              [labels]="cityChartOptions.labels!"
              [legend]="cityChartOptions.legend!"
              [colors]="cityChartOptions.colors!">
            </apx-chart>
          </div>

          <div *ngIf="!cityChartOptions.series || cityChartOptions.series.length === 0" class="my-12 text-center text-xs text-slate-400">
            No geographic city data in database yet.
          </div>
        </div>

      </div>

      <!-- Lower Dual Grid: Fee Distribution & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Course Fee Distribution Bar Chart -->
        <div class="glass-card p-6 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Course Tuition Range</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Fee tiers across database courses</p>
            </div>
            <a routerLink="/courses" class="text-xs font-semibold text-brand-500 hover:underline">View Catalog →</a>
          </div>

          <div *ngIf="feeChartOptions.series" class="h-64">
            <apx-chart
              [series]="feeChartOptions.series!"
              [chart]="feeChartOptions.chart!"
              [xaxis]="feeChartOptions.xaxis!"
              [colors]="feeChartOptions.colors!"
              [grid]="feeChartOptions.grid!">
            </apx-chart>
          </div>
        </div>

        <!-- Latest Students Feed -->
        <div class="glass-card p-6 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Recent Database Students</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Latest records stored in database</p>
            </div>
            <a routerLink="/students" class="text-xs font-semibold text-brand-500 hover:underline">Manage All →</a>
          </div>

          <div class="space-y-4">
            <div
              *ngFor="let student of latestStudents()"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-xs">
                  {{ student.name.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ student.name }}</h4>
                  <p class="text-[11px] text-slate-400">{{ student.email }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {{ student.city }}
                </span>
                <p class="text-[10px] text-slate-400 mt-0.5">Age {{ student.age }}</p>
              </div>
            </div>

            <div *ngIf="latestStudents().length === 0" class="text-center py-6 text-xs text-slate-400">
              No student records in database. Click "Register New Student" to add data.
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  studentService = inject(StudentService);
  courseService = inject(CourseService);
  enrollmentService = inject(EnrollmentService);
  themeService = inject(ThemeService);

  totalStudents = signal<number>(0);
  totalCourses = signal<number>(0);
  totalEnrollments = signal<number>(0);
  avgCourseFee = signal<number>(0);
  latestStudents = signal<Student[]>([]);

  trendChartOptions: ChartOptions = {
    series: [{ name: 'Enrollments', data: [0] }],
    chart: { type: 'area', height: 280, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
    xaxis: { categories: ['Current'] },
    stroke: { curve: 'smooth', width: 3 },
    tooltip: { theme: 'dark' },
    colors: ['#6366F1'],
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)' }
  };

  cityChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'donut', height: 240 },
    labels: [],
    colors: ['#6366F1', '#10B981', '#8B5CF6', '#F59E0B'],
    legend: { position: 'bottom', labels: { colors: '#94A3B8' } }
  };

  feeChartOptions: ChartOptions = {
    series: [{ name: 'Courses in Range', data: [0, 0, 0, 0] }],
    chart: { type: 'bar', height: 250, toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { categories: ['₹0-₹300', '₹300-₹600', '₹600-₹1000', '₹1000+'] },
    colors: ['#10B981'],
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)' }
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.totalStudents.set(students.length);
        this.latestStudents.set(students.slice(0, 5));

        const cityMap: { [key: string]: number } = {};
        students.forEach(s => {
          if (s.city) {
            cityMap[s.city] = (cityMap[s.city] || 0) + 1;
          }
        });

        const cities = Object.keys(cityMap);
        const counts = Object.values(cityMap);
        if (cities.length > 0) {
          this.cityChartOptions = {
            ...this.cityChartOptions,
            series: counts,
            labels: cities
          };
        }
      },
      error: () => {
        this.totalStudents.set(0);
        this.latestStudents.set([]);
      }
    });

    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.totalCourses.set(courses.length);
        if (courses.length > 0) {
          const totalFee = courses.reduce((sum, c) => sum + (c.fee || 0), 0);
          this.avgCourseFee.set(totalFee / courses.length);

          let r1 = 0, r2 = 0, r3 = 0, r4 = 0;
          courses.forEach(c => {
            const f = c.fee || 0;
            if (f <= 300) r1++;
            else if (f <= 600) r2++;
            else if (f <= 1000) r3++;
            else r4++;
          });

          this.feeChartOptions = {
            ...this.feeChartOptions,
            series: [{ name: 'Courses', data: [r1, r2, r3, r4] }]
          };
        }
      },
      error: () => {
        this.totalCourses.set(0);
        this.avgCourseFee.set(0);
      }
    });

    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => {
        this.totalEnrollments.set(enrollments.length);
        this.trendChartOptions = {
          ...this.trendChartOptions,
          series: [{ name: 'Total Enrollments', data: [enrollments.length] }]
        };
      },
      error: () => {
        this.totalEnrollments.set(0);
      }
    });
  }
}
