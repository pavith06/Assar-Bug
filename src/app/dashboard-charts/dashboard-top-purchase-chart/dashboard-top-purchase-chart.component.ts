import { Component, OnInit, ViewChild, Input } from '@angular/core';
import fscreen from 'fscreen';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { DashboardOutputDto } from 'src/app/models/dashboard-data-dto/dashboard-output-dto';
import { TopPurchaseDto } from 'src/app/models/dashboard-data-dto/top-purchase-dto';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import * as XLSX from 'xlsx';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { AdminService } from 'src/app/service/admin.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-top-purchase-chart',
  templateUrl: './dashboard-top-purchase-chart.component.html',
  styleUrls: ['./dashboard-top-purchase-chart.component.scss']
})
export class DashboardTopPurchaseChartComponent implements OnInit{

  @Input() horizontalBarChartAccessDataFromParent:AccessMappingSectionDto;

  canvas: any;
  ctx: any;
  hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
  isFullscreen: boolean;
  showOrHideIcon=true;
  fullshow = false;
  Notfullshow=true;

  horizontalBarChartData: any;
  label: any[];
  count: any[];




  dashboardInputData= new DashboardInputDto();
  graphData:TopPurchaseDto[]=[];

  @ViewChild('HorizontalBarChartDiv') HorizontalBarChartDiv!: { nativeElement: any };
  @ViewChild('HorizontalBarChart') HorizontalBarChart!: { nativeElement: any };
  isAdmin: boolean;
  isDownloadDisable: boolean=false;
  countLabel: string;
  stockCountLabel: any;
  elem: any;



  constructor(private dashBoardService:DashboardChartService,private dashService: DashboardService, private adminService: AdminService, private translate:TranslateService){
    if (this.hasFullscreenSupport) {
      fscreen.addEventListener('fullscreenchange', () => {
        this.isFullscreen = (fscreen.fullscreenElement !== null);
      }, false);
    }

    this.dashService.isChecked$.subscribe((value) => {
      if (value) {
        this.dashboardInputData = value;
        this.applyDateFilter(this.dashboardInputData);
      }
    });
    this.countLabel=this.translate.instant('Bar_Chart_Labels.Count');
    this.stockCountLabel=this.translate.instant('Top_purchase.stock_count')
    this.translate.onLangChange.subscribe((data)=>{
      this.countLabel=this.translate.instant('Bar_Chart_Labels.Count');
      this.stockCountLabel=this.translate.instant('Top_purchase.stock_count')
      if(this.horizontalBarChartData){
        this.horizontalBarChartData.options.scales.x.title.text=this.countLabel;
        this.horizontalBarChartData.data.datasets[0].label =this.stockCountLabel;
        this.horizontalBarChartData.op
        this.horizontalBarChartData.update();
      }
    })
  }

  ngOnInit(): void {

      this.applyDateFilter(this.dashboardInputData);
  }

  private applyDateFilter(dateFilter:DashboardInputDto) {
    if(Object.keys(dateFilter).length===0){
      const startDate = moment().startOf('year').format('MM/DD/YYYY');
      const endDate = moment().endOf('year').format('MM/DD/YYYY');

      this.dashboardInputData.fromDate = new Date(startDate);
      this.dashboardInputData.toDate = new Date(endDate);
      this.dashboardInputData.filterType = 'YEAR';
    }

    if(this.horizontalBarChartAccessDataFromParent.isView===false){
      return;
    }

    this.isAdmin = this.adminService.isAssociationUser();

    if (this.isAdmin) {

      this.dashBoardService.getTopCompaniesPurchases(dateFilter).subscribe((data) => {

        this.graphData = data['content'];
        if(this.graphData.length===0){
          this.isDownloadDisable=true;
        }
        else{
          this.isDownloadDisable=false
        }
        this.horizontalChartLoading(this.graphData);
      });
    }

  }

  horizontalChartLoading(graphData: TopPurchaseDto[]) {
    if(this.horizontalBarChartData) {
      this.horizontalBarChartData.clear();
      this.horizontalBarChartData.destroy();
    }

    this.label=[];
    this.count=[];
    graphData.forEach((value)=>{
      this.label.push(value.companies);
      this.count.push(value.stockCount);
    })


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

    this.canvas = this.HorizontalBarChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.horizontalBarChartData = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label:  this.stockCountLabel,
            data: this.count,
            barPercentage: 0.3,
            backgroundColor: '#688F99',
            barThickness: 16,
          },
        ],
      },
      plugins: [plugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            align: 'end',
            labels: {
              font: {
                size: 12.5,
                family: 'Inter',
              },
              boxWidth: 30,
              boxHeight: 15,
              color: 'black',
            },
          },
        },
        scales: {
          y: {
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value: number) {
                const lbl = this.getLabelForValue(value);
                
                return lbl? lbl?.length <= 5 ? lbl : lbl.slice(0, 5):lbl;
              },
              font: {
                size: 12.5,
                family: 'Inter',
              },
              color: 'black',
              precision: 0,
            },
          },
          x: {
            min: 0,
            grid: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              font: {
                size: 12.5,
                family: 'Inter',
              },
              color: 'black',
              precision: 0,
            },
            title: {
              display: true,
              text: this.countLabel,
              align: 'center',
              color: 'black',
              font: {
                family: 'Inter',
              },
            },
          },
        },
        aspectRatio: 2.1,
      },
    });

  }
    fullshows=false;
    toggleFullScreen() {
      this.elem = this.HorizontalBarChartDiv.nativeElement;
  
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

  downloadAsJPEG(){
    const chartCanvas = document.getElementById('HorizontalBarChart') as HTMLCanvasElement;
    const ctx = chartCanvas.getContext('2d');

    // Get the heading text
    const headingText = this.translate.instant('DashBoard.Top_purchases');
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
    imgLink.download ='TopCompanyPurchases.jpeg';
    imgLink.href = combinedCanvas.toDataURL('image/jpeg', 1);
    imgLink.click();
  }

  downloadAsPDF(){
    const chartCanvas = document.getElementById('HorizontalBarChart') as HTMLCanvasElement;

    // Get the heading text and color
    const headingText =this.translate.instant('DashBoard.Top_purchases');
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
    pdf.save('TopCompanyPurchases.pdf');
  }

  downloadAsExcel(){

    const filename = 'TopCompanyPurchases.xlsx';
    const jsonData = this.graphData;
    const updatedData = jsonData.map((item) => {
      const updatedItem = {}; // Initialize updatedItem as an empty object for each item
      for (const prop in item) {
        const modStr = prop[0].toUpperCase() + prop.slice(1);
        updatedItem[modStr] = item[prop]; // Assign the value to the updated property name
      }
      return updatedItem;
    });
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(updatedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Total');
    XLSX.writeFile(wb, filename);

  }



}
