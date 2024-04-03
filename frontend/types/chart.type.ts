import ApexCharts from 'apexcharts';

export interface ChartType {
  options: ApexCharts.ApexOptions;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
}
