import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import fscreen from 'fscreen';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { AdminService } from 'src/app/service/admin.service';
import * as moment from 'moment';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Title } from 'chart.js/dist';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrls: ['./dashboard-doughnut.component.scss'],
})
export class DashboardDoughnutComponent implements OnInit{
  canvas: any;
  ctx: any;
  @ViewChild('doughnutChart') doughnutChart!: { nativeElement: any };
  @ViewChild('doughnutChartDiv') doughnutChartDiv!: { nativeElement: any };
  @Input() doughnutChartAccessDataFromParent:AccessMappingSectionDto;
  lable = [];
  count = [];
  pieChart: any;
  countingitem = []
  isAssociation: boolean;
  // zoomchat = false;
  fullshow = false;
  Notfullshow=true;

  hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
  isFullscreen: boolean;
  elem: any;
  showOrHideIcon = true
  jsout: any;
  Reciableshow = false;
  PayableShow = true;
  chart: any;
  dashboardInputData= new DashboardInputDto();
  isAdmin: boolean;
  downloadDisable: boolean=false;



  constructor(private dashboardChartService: DashboardChartService,private adminService:AdminService,private dashboardService : DashboardService, private translate:TranslateService) {
    Chart.register(...registerables);
    if (this.hasFullscreenSupport) {
      fscreen.addEventListener('fullscreenchange', () => {
        this.isFullscreen = (fscreen.fullscreenElement !== null);
      }, false);
    }
    this.isAssociation = this.adminService.isAssociationUser()

    this.dashboardService.isChecked$.subscribe((value)=> {
      if(value) {
        this.dashboardInputData = value;
        this.getDoughNutChart(this.dashboardInputData);
      }
    })

    this.translate.onLangChange.subscribe((data)=>{
      this.chartLabelTranslation();
    })
  }

  chartLabelTranslation() {

      this.lable=[
        this.translate.instant('Digital_Paper_Status.Active') + ' (' + this.graphData[0].active.toLocaleString() + ')',
        this.translate.instant('Digital_Paper_Status.Expired') + ' (' + this.graphData[0].expired.toLocaleString() + ')',
        this.translate.instant('Digital_Paper_Status.Revoked') + ' (' + this.graphData[0].revoked.toLocaleString() + ')'
      ];

      if(this.chart){
        this.chart.data.labels=this.lable;
        this.chart.update();
      }
  }



  ngOnInit() {

    const startDate = moment().startOf('year').format('MM/DD/YYYY');
    const endDate = moment().endOf('year').format('MM/DD/YYYY');

    this.dashboardInputData.fromDate = new Date(startDate);
    this.dashboardInputData.toDate = new Date(endDate);
    this.dashboardInputData.filterType = 'YEAR';

    this.getDoughNutChart(this.dashboardInputData);


  }

   getDoughNutChart(dashboardInputData :DashboardInputDto) {

    if(this.doughnutChartAccessDataFromParent.isView===false){
      return;
    }
    this.isAdmin = this.adminService.isAssociationUser();

      this.dashboardChartService.getDoughNutChartData(dashboardInputData, this.isAdmin).subscribe((response) => {
        if (response) {
          const graphDetails = response;
          this.graphData[0] = graphDetails;
          this.lineChartLoad(graphDetails);
        }
      });

  }

  lineChartLoad(graphData:DoughnutData): void {

    const value:number[] = [];
    value.push(graphData.active);
    value.push(graphData.expired);
    value.push(graphData.revoked);

    if(graphData.active==0 && graphData.revoked==0 && graphData.expired==0){
      this.downloadDisable=true
    }else{
      this.downloadDisable=false
    }
    this.ctx = document.getElementById('doughnutChart') as HTMLElement;

    const plugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    this.chartLabelTranslation();

    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.lable,
        datasets: [
          {
            data: value,
            backgroundColor: [
              '#ADD458',
              '#82B2E7',
              '#00C8C8'
            ],
            hoverOffset: 4
          }
        ],
      },
      options: {
responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2.2,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 12.5,
                family: 'Inter',

              },
              color:'black',
              boxWidth: 30,
              boxHeight:16

            },
          },
          tooltip:{

            callbacks:{

              title:(tooltipItem)=>{

                const title=tooltipItem[0].label;
                const index=title.indexOf(" ");
                const newTitle=title.slice(0,index+1);


                return newTitle;
              },

              label:(tooltipItem)=>{


                return tooltipItem.formattedValue;

              },

            },

           titleFont:{size:12},

           bodyFont:{size:13},

          }



        },


    },
    plugins: [plugin],
    });
  }

  graphData: DoughnutData[]=[];

  ngOnDestroy() {
    if (this.hasFullscreenSupport) {
      fscreen.removeEventListener('fullscreenchange');
    }
  }





  //bar chart popup into fulscreen

  toggleFullScreen() {
    this.elem = this.doughnutChartDiv.nativeElement;

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
    const chartCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const ctx = chartCanvas.getContext('2d');

    // Get the heading text
    const headingText = this.translate.instant('DashBoard.Digital_Paper_Status')
    // Create a new canvas to combine the heading and chart
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    // Set the canvas size to match the chart canvas plus the heading height
    combinedCanvas.width = chartCanvas.width;
    combinedCanvas.height = chartCanvas.height + 50; // Adjust the value as needed for the heading height

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
    imgLink.download = 'Digital-paper-status.jpeg';
    imgLink.href = combinedCanvas.toDataURL('image/jpeg', 1);
    imgLink.click();
  }



  //download chart as image

  downloadAsPDF() {
    const chartCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;

    // Get the heading text and color
    const headingText =this.translate.instant('DashBoard.Digital_Paper_Status')
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
    pdf.save('Digital-paper-status.pdf');
  }



  //download chart data as Excel

  async downloadAsExcel() {
  //   const filename = 'Digital-paper-status.xlsx';
  //   const jsonData = this.graphData;
  //   const updatedData = jsonData.map((item) => {
  //     const updatedItem = {}; // Initialize updatedItem as an empty object for each item
  //     for (const prop in item) {
  //       const modStr = prop[0].toUpperCase() + prop.slice(1);
  //       updatedItem[modStr] = item[prop]; // Assign the value to the updated property name
  //     }
  //     return updatedItem;
  //   });
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(updatedData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Total');
  //   XLSX.writeFile(wb, filename);
  // }
  const data = this.graphData;
    const header = Object.keys(data[0]);

  // Capitalize the first letter of each header
  const headerFormatted = header.map(this.capitalizeFirstLetter);

  // Create a new workbook and worksheet using ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Total', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Set bold style for the header row
  const headerRow = worksheet.addRow(headerFormatted);
  headerRow.font = { bold: true };

  // Add data rows to the worksheet
  data.forEach((rowData) => worksheet.addRow(Object.values(rowData)));

  // Adjust the column width based on content
  for (let i = 0; i < header.length; i++) {
    const column = worksheet.getColumn(i + 1); // Columns are 1-indexed
    const columnData = [headerFormatted[i], ...data.map((row) => row[header[i]])];
    const columnMaxWidth = Math.max(...columnData.map((cell) => cell.toString().length));
    column.width = Math.min(columnMaxWidth + 2, 50); // Limit maximum width to 50 characters
  }

  // file name
  const filename = 'Digital-paper-status.xlsx';

  // Generate Excel file and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, filename);
  }
  capitalizeFirstLetter(input: string): string {
    if (typeof input !== 'string') {
      return input;
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  }


}

export class DoughnutData {
  active: number;
  expired: number;
  revoked: number;
}



export class AxisGraph {
  x: any;
  y: any;
}
