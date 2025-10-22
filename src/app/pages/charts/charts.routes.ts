import {Routes} from '@angular/router';
import {LineComponent} from "@app/pages/charts/Apexcharts/line/line.component";
import {AreaComponent} from "@app/pages/charts/Apexcharts/area/area.component";
import {ColumnComponent} from "@app/pages/charts/Apexcharts/column/column.component";
import {BarComponent} from "@app/pages/charts/Apexcharts/bar/bar.component";
import {MixedComponent} from "@app/pages/charts/Apexcharts/mixed/mixed.component";
import {TimelineComponent} from "@app/pages/charts/Apexcharts/timeline/timeline.component";
import {CandlestickComponent} from "@app/pages/charts/Apexcharts/candlestick/candlestick.component";
import {BoxplotComponent} from "@app/pages/charts/Apexcharts/boxplot/boxplot.component";
import {BubbleComponent} from "@app/pages/charts/Apexcharts/bubble/bubble.component";
import {ScatterComponent} from "@app/pages/charts/Apexcharts/scatter/scatter.component";
import {HeatmapComponent} from "@app/pages/charts/Apexcharts/heatmap/heatmap.component";
import {TreemapComponent} from "@app/pages/charts/Apexcharts/treemap/treemap.component";
import {PieComponent} from "@app/pages/charts/Apexcharts/pie/pie.component";
import {RadialbarComponent} from "@app/pages/charts/Apexcharts/radialbar/radialbar.component";
import {RadarComponent} from "@app/pages/charts/Apexcharts/radar/radar.component";
import {PolarComponent} from "@app/pages/charts/Apexcharts/polar/polar.component";
import {ChartjsComponent} from "@app/pages/charts/chartjs/chartjs.component";
import {EchartComponent} from "@app/pages/charts/echart/echart.component";
import {RangeAreaComponent} from "@app/pages/charts/Apexcharts/range-area/range-area.component";
import {FunnelComponent} from "@app/pages/charts/Apexcharts/funnel/funnel.component";
import {SlopeareaComponent} from "@app/pages/charts/Apexcharts/slope/slopearea.component";

export default [
  {
    path: "apex-line",
    component: LineComponent
  },
  {
    path: "apex-area",
    component: AreaComponent
  },
  {
    path: "apex-column",
    component: ColumnComponent
  },
  {
    path: "apex-bar",
    component: BarComponent
  },
  {
    path: "apex-mixed",
    component: MixedComponent
  },
  {
    path: "apex-timeline",
    component: TimelineComponent
  },
  {
    path: "apex-candlestick",
    component: CandlestickComponent
  },
  {
    path: "apex-boxplot",
    component: BoxplotComponent
  },
  {
    path: "apex-bubble",
    component: BubbleComponent
  },
  {
    path: "apex-scatter",
    component: ScatterComponent
  },
  {
    path: "apex-heatmap",
    component: HeatmapComponent
  },
  {
    path: "apex-treemap",
    component: TreemapComponent
  },
  {
    path: "apex-pie",
    component: PieComponent
  },
  {
    path: "apex-radialbar",
    component: RadialbarComponent
  },
  {
    path: "apex-radar",
    component: RadarComponent
  },
  {
    path: "apex-polar",
    component: PolarComponent
  },
  {
    path: "chartjs",
    component: ChartjsComponent
  },
  {
    path: "echarts",
    component: EchartComponent
  },
  {
    path: "range-area",
    component: RangeAreaComponent
  },
  {
    path: "funnel",
    component: FunnelComponent
  },
  {
    path: "slope",
    component: SlopeareaComponent
  },
] as Routes;
