import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import fscreen from 'fscreen';
import * as XLSX from 'xlsx';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-dashboard-line',
  templateUrl: './dashboard-line.component.html',
  styleUrls: ['./dashboard-line.component.scss'],
})
export class DashboardLineComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild('lineChart') lineChart!: { nativeElement: any };
  @ViewChild('lineChartDiv') lineChartDiv!: { nativeElement: any };
  @Input() predictionCartAcessDataFromParent:AccessMappingSectionDto;
  lable = [];
  count = [];
  pieChart: any;
  countingitem = [];
  isReceivable: boolean;
  fullshow = false;
  Notfullshow=true;



  hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
  isFullscreen: boolean;
  elem: any;
  showOrHideIcon = true;
  jsout: any;
  Reciableshow = false;
  PayableShow = true;
  chart: any;
  isDownloadDisable: boolean=false;
  graphArray: AxisGraph[];
  currentMonthData: AxisGraph;

  constructor(private dashboardChartService: DashboardChartService, private translate:TranslateService, private datepipe: DatePipe) {
    Chart.register(...registerables);
    if (this.hasFullscreenSupport) {
      fscreen.addEventListener(
        'fullscreenchange',
        () => {
          this.isFullscreen = fscreen.fullscreenElement !== null;
        },
        false
      );
    }
    this.translate.onLangChange.subscribe((data)=>{
      this.lineChartMonthTranslation(this.graphData);
    })
  }

  ngOnInit() {
    if(this.predictionCartAcessDataFromParent.isView){

      this.dashboardChartService
        .getPredictionChartData()
        .subscribe((response) => {
          if (response) {
            this.graphData = response['content']['dashBoardValues'];

            this.lineChartLoad(this.graphData);
          }
        });
    }
  }

  lineChartLoad(graphData: GraphData[]): void {

    let count=0;
    graphData.forEach((element)=>{
        if(element.yaxis===0){
          count++;
        }
    });
    if(count===12){
      this.isDownloadDisable=true
    }else{
      this.isDownloadDisable=false
    }

    const currentDateValue = new Date();
    const month = currentDateValue.getMonth();
    if(month+1>7){
      graphData.splice(month + 2, graphData.length);
    }
     
    this.lineChartMonthTranslation(graphData);

    this.ctx = document.getElementById('lineChart') as HTMLElement;

    const plugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#FFFFFF';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    };

    this.chart = new Chart(this.ctx, {
      data: {
        datasets: [
          {
            type: 'line',
            label: '',
            data: this.graphArray,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,

          },
          {
            type: 'bar',
            label: '',
            data: [this.currentMonthData],
            borderColor: 'rgb(33, 33, 33)',
            backgroundColor: 'red',
            barThickness: 0.5,
            maxBarThickness: 1,

          },


        ],
      },
      plugins: [plugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,

        aspectRatio:2.8,
        color:'black',
        plugins: {
          legend: {
            display: false,

          },


        },
        scales: {
          y: {
            title: {
              display: true,
              text: this.translate.instant('Prediction_Charts.Paper Count'),
              color:'black',
            },
            ticks:{
              font:{
            size:12.5,
            family: 'Inter',
              },
              color:'black',
             precision:0

             },

          },
          x: {
            title: {
              display: true,

              color:'black',
            },
            ticks:{
              font:{
            size:12.5,
            family: 'Inter',
              },
              color:'black',
             precision:0

             },

          },


        },
      },
    });
  }

  graphData: GraphData[] = [];
  private lineChartMonthTranslation(graphData: GraphData[]) {
    this.graphArray = [];
    graphData.forEach((element) => {
      const graphValue = new AxisGraph();
      graphValue.x = this.translate.instant('Papers_Taken_Months.'+element.xaxis.substring(0, 3));
      graphValue.y = element.yaxis;
      this.graphArray.push(graphValue);
    });
    const monthValue=this.datepipe.transform(new Date(), 'MMM');
    this.currentMonthData= this.graphArray.find(value=>value.x.toLocaleLowerCase()===monthValue.toLocaleLowerCase());

    if(this.chart){
      this.chart.data.datasets[0].data=this.graphArray;
      this.chart.options.scales.y.title.text=this.translate.instant('Prediction_Charts.Paper Count')
      this.chart.update();
    }

  }

  ngOnDestroy() {
    if (this.hasFullscreenSupport) {
      fscreen.removeEventListener('fullscreenchange');
    }
  }

  //bar chart popup into fulscreen

  toggleFullScreen() {
    this.elem = this.lineChartDiv.nativeElement;

    if (!this.isFullscreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      this.showOrHideIcon = false;
      this.Notfullshow = false;
      this.fullshow = true;
    } else {
      if (fscreen.exitFullscreen) {
        fscreen.exitFullscreen();
      } else if (fscreen.webkitExitFullscreen) {
        fscreen.webkitExitFullscreen();
      }else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozCancelFullScreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msExitFullscreen();
      }
      this.showOrHideIcon = true;
      this.Notfullshow = true;
      this.fullshow = false;
    }
  }

  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])

  screenChange(event) {
    this.toggleFullScreen();
  }

  // download option
  //download chart as image
  downloadAsJPEG() {
    const chartCanvas = document.getElementById('lineChart') as HTMLCanvasElement;
    const ctx = chartCanvas.getContext('2d');

    // Get the heading text
    const headingText =this.translate.instant('Prediction_Charts.Prediction');
    // Create a new canvas to combine the heading and chart
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    // Set the canvas size to match the chart canvas plus the heading height
    combinedCanvas.width = chartCanvas.width;
    combinedCanvas.height = chartCanvas.height + 30; // Adjust the value as needed for the heading height

    // Draw the heading on the combined canvas
    combinedCtx.fillStyle = '#FFF'; // Set the background color if needed
    combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height); // Fill the background
    combinedCtx.font = '20px Arial'; // Set the heading font
    combinedCtx.fillStyle = '#688f99'; // Set the heading color
    combinedCtx.textAlign = 'left'; // Left-align the heading
    combinedCtx.fillText(headingText, 10, 20); // Draw the heading, adjust '10' for the desired left margin

    // Draw the chart canvas on the combined canvas, below the heading
    combinedCtx.drawImage(chartCanvas, 0, 30); // Adjust the value as needed to position the chart below the heading

    // Convert the combined canvas to a data URL and trigger the download
    const imgLink = document.createElement('a');
    imgLink.download ='Prediction-chart.jpeg';
    imgLink.href = combinedCanvas.toDataURL('image/jpeg', 1);
    imgLink.click();
  }

  //download chart as image
  downloadAsPDF() {
    const chartCanvas = document.getElementById('lineChart') as HTMLCanvasElement;

    // Get the heading text and color
    const headingText =this.translate.instant('Prediction_Charts.Prediction');
    const headingColor = '#688f99'; // Replace this with your desired color
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = chartCanvas.width;
    combinedCanvas.height = chartCanvas.height + 30; // Adjust the value as needed for the heading height

    // Get the 2D context of the combined canvas
    const combinedCtx = combinedCanvas.getContext('2d');

    // Draw the heading on the combined canvas
    combinedCtx.fillStyle = '#ffffff'; // Set the background color to transparent
    combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height); // Fill the canvas with the transparent background

    combinedCtx.fillStyle = headingColor; // Set the heading color
    combinedCtx.font = '20px Arial'; // Set the heading font
    combinedCtx.textAlign = 'left'; // Left-align the heading
    combinedCtx.fillText(headingText, 10, 20); // Draw the heading, adjust '10' for the desired left margin

    // Draw the chart canvas on the combined canvas, below the heading
    combinedCtx.drawImage(chartCanvas, 0, 30); // Adjust the value as needed to position the chart below the heading

    // Convert the combined canvas to a data URL
    const combinedImage = combinedCanvas.toDataURL('image/jpeg', 1);

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    pdf.addImage(combinedImage, 'JPEG', 15, 15, 180, 110); // Adjust the coordinates and size as needed for positioning
    pdf.save('Prediction-chart.pdf');
  }

  //download chart data as Excel
  downloadAsExcel() {
    const filename = 'Prediction-chart.xlsx';
    const jsonData = this.graphData;
    const updatedData = jsonData.map((item) => {
      const updatedItem = {}; // Initialize updatedItem as an empty object for each item
      for (const prop in item) {
        const modStr = prop[0].toUpperCase() + prop.slice(1);
        updatedItem[modStr] = item[prop]; // Assign the value to the updated property name
      }
      return updatedItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(updatedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Total');
    XLSX.writeFile(wb, filename);
  }
}

export class GraphData{
  xaxis:string;
  yaxis:number;
}

export class AxisGraph{
  x:any;
  y:any;
}
