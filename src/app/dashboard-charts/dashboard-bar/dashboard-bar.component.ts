import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { Section } from 'src/app/models/report-loss-dto/section';
import { Input } from '@angular/core';
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { BarChartDto } from 'src/app/models/dashboard-dto/barchart-dto';
import { DashboardService } from 'src/app/service/dashboard.service';
import fscreen from 'fscreen';
import { AdminService } from 'src/app/service/admin.service';
import { Context } from 'html2canvas/dist/types/core/context';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { I } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-bar',
  templateUrl: './dashboard-bar.component.html',
  styleUrls: ['./dashboard-bar.component.scss'],
})
export class DashboardBarComponent implements OnInit {
  barChartData: any;
  barChartDto: BarChartDto[] = [];
  barChart: BarChartDto;
  jsout: any;
  datavalues: any = [];
  Notfullshow = true;
  elem: any;
  isDownloadDisable=false;

  isFullscreen: boolean;
  showOrHideIcon = true;
  hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
  @ViewChild('barChartDiv') barChartDiv!: { nativeElement: any };
  @ViewChild('barChartDiv1') barChartDiv1!: { nativeElement: any };
  decodedToken: any;
  token: string;
  isAdmin: boolean;
  @Input() barChartAccessDataFromParent: AccessMappingSectionDto;
  digitalPaperAllocated: any;
  digitalPaperPurchased: any;
  splitInsuredCompanyName: any[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private dashBoardService: DashboardService,
    private adminService: AdminService,
    private translate:TranslateService
  ) {

    this.translate.onLangChange.subscribe((data)=>{
      if(this.jsout && !this.isAdmin){
        this.monthTranslation(this.jsout)
      }
      else if(this.isAdmin){
        this.languageChangeForAuthorityBarChart(this.digitalPaperAllocated, this.digitalPaperPurchased,this.splitInsuredCompanyName);
      }
    })
  }
  ngOnInit() {
    this.isAdmin = this.adminService.isAssociationUser();
    this.dashBoardService.isChecked$.subscribe((value) => {
      if (value) {
        this.barChart = value;
        this.getBarChart(this.barChart);
      }
    });

    if (this.hasFullscreenSupport) {
      fscreen.addEventListener(
        'fullscreenchange',
        () => {
          this.isFullscreen = fscreen.fullscreenElement !== null;
        },
        false
      );
    }
    this.barChart = undefined;
    this.getBarChart(this.barChart);
  }

  ngOnDestroy() {
    if (this.hasFullscreenSupport) {
      fscreen.removeEventListener('fullscreenchange');
    }
  }

  getBarChart(barChartDto: BarChartDto) {
    this.isAdmin = this.adminService.isAssociationUser();
    if (this.isAdmin && this.barChartAccessDataFromParent.isView) {
      this.dashBoardService
        .getAuthorityBarChart(barChartDto)
        .subscribe((result) => {
          this.jsout = result;
          if(this.jsout['content'].length==0){
            this.isDownloadDisable=true
          }
          else{
            this.isDownloadDisable=false
          }
          let insuredComapny: any;
          let shortName: any;
          this.splitInsuredCompanyName = [];
          const companies = result.content.map((item) => item.insuredComapny);

          insuredComapny = result['content'].map(
            (result) => result.shortName
          );
          shortName = result['content'].map((result) => result.shortName);
          this.digitalPaperAllocated = result['content'].map(
            (result) => result.digitalPaperAllocated
          );
          this.digitalPaperPurchased = result['content'].map(
            (result) => result.digitalPaperPurchased
          );

          // const labelAdjust = insuredComapny.map(label=> label.split(' '));

          // if (this.barChartData) {
          //   this.barChartData.clear();
          //   this.barChartData.destroy();
          // }

          insuredComapny.forEach((companyName) => {
            let firstSpaceIndex = companyName.indexOf(' ');
            if (firstSpaceIndex !== -1) {
              const firstPart = companyName.substring(0, firstSpaceIndex);
              const secondPart = companyName.substring(firstSpaceIndex + 1);
              const splitedName = [];
              splitedName.push(firstPart);
              splitedName.push(secondPart);
              const splitnameArray = [];
              splitnameArray.push(splitedName);
              this.splitInsuredCompanyName.push(splitedName);
            } else {
              const splitedName = [];
              splitedName.push(companyName);
              splitedName.push('');
              const splitnameArray = [];
              splitnameArray.push(splitedName);
              this.splitInsuredCompanyName.push(splitedName);
            }
          });

          this.languageChangeForAuthorityBarChart(this.digitalPaperAllocated, this.digitalPaperPurchased,this.splitInsuredCompanyName);

          

          this.barChartData = new Chart('BarChart', {
            type: 'bar',
            data: {
              labels: this.splitInsuredCompanyName,
              datasets: this.datavalues,
            },

            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  align: 'start',
                  labels: {
                    font: {
                      size: 12.5,

                      family: 'Inter',
                    },
                    color: 'black',
                    boxWidth: 30,
                    boxHeight: 15,
                  },
                },
                tooltip: {
                  callbacks: {
                      title: function (context) {
                         const label= context[0].label;
                         const splittedLabelArrayByComma=label.split(',');
                          const requiredLabel= splittedLabelArrayByComma.shift();
                          return requiredLabel;
                      },
                      // label: function (context) {
                      //   const dataIndex = context.dataIndex;
                      //   const company = companies[dataIndex];
                      //   const count = 8;
                      //   return company;
                      // },

                  }
              }
              },
              scales: {
                y: {
                  min: 0,
                  ticks: {
                    font: {
                      size: 12.5,

                      family: 'Inter',
                    },
                    color: 'black',
                    precision: 0,
                  },
                  grid: {
                    display: false,
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: 12.5,
                      family: 'Inter',
                    },
                    color: 'black',
                    precision: 0,
                  },
                  grid: {
                    display: false,
                  },
                },
              },


              aspectRatio: 3,
            },

            plugins: [plugin],
          });
        });
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
    } else if (this.barChartAccessDataFromParent.isView && !this.isAdmin) {
      this.dashBoardService.getBarChartData(barChartDto).subscribe((res) => {
        this.jsout = res;
        const barchartData= this.jsout['content'];
        const barchartDataLength=barchartData!=undefined?barchartData.length:null;
        let count=0;
        barchartData.forEach(element => {
          if(element['stockAllocated']===0 && element['certificateIssued']==0){
            count++;
          }
        });
        if(count===barchartDataLength){
          this.isDownloadDisable=true
        }
        else{
          this.isDownloadDisable=false
        }

    // if (this.barChartData) {
    //   this.barChartData.clear();
    //   this.barChartData.destroy();
    // }

        let month: any = this.monthTranslation(this.jsout);

        this.barChartData = new Chart('BarChart', {
          type: 'bar',
          data: {
            labels: month,
            datasets: this.datavalues,
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                align: 'start',
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
                min: 0,
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 12.5,
                    family: 'Inter',
                  },
                  color: 'black',
                  precision: 0,
                  // stepSize:40,
                },
              },
              x: {
                grid: {
                  display: false,
                },

                ticks: {
                  font: {
                    size: 12.5,
                    family: 'Inter',
                  },
                  color: 'black',
                  precision: 0,
                },
              },
            },

            aspectRatio: 2.5,
            layout: {
              padding: {
                left: 50,
              },
            },
          },

          plugins: [plugin],
        });
      });

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
    }
  }
  fullshow = false;

  // For Authority bar chart

  private languageChangeForAuthorityBarChart(digitalPaperAllocated: any, digitalPaperPurchased: any,splitInsuredCompanyName:any) {
    this.datavalues = [
      {
        data: digitalPaperAllocated,
        label: this.translate.instant('Bar_Chart_Labels.No.of Digital Paper Allocated'),
        backgroundColor: '#688F99',
        // barPercentage: 1,
      },
      {
        data: digitalPaperPurchased,
        label: this.translate.instant('Bar_Chart_Labels.No.of Digital Paper Purchased'),
        backgroundColor: 'rgb(255,155,107)',
      },
    ];

    if(this.barChartData){
      this.barChartData.data.datasets=this.datavalues;
      this.barChartData.data.labels=splitInsuredCompanyName
      this.barChartData.update();
    }
  }

  // For digital papers taken chart translation method

  private monthTranslation(res: any) {
    let month: any;
    let stockAllocated: any;
    let certificateIssued: any;

    month = res['content'].map((res) => this.translate.instant('Papers_Taken_Months.'+res.month));
    stockAllocated = res['content'].map((res) => res.stockAllocated);
    certificateIssued = res['content'].map((res) => res.certificateIssued);

    this.datavalues = [
      {
        data: stockAllocated,
        label: this.translate.instant('Bar_Chart_Labels.No of Stock Allocated'),
        backgroundColor: '#688F99',
        // barPercentage: 1,
      },
      {
        data: certificateIssued,
        label: this.translate.instant('Bar_Chart_Labels.No of Certificate Issued'),
        backgroundColor: 'rgb(255,155,107)',
        // barPercentage: 1,
      },
    ];

    if(this.barChartData){
      this.barChartData.data.labels= month;
      this.barChartData.data.datasets=this.datavalues;
      this.barChartData.update();
    }
    return month;
  }

  toggleFullScreen() {
    this.elem = this.barChartDiv1.nativeElement;

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
    if (this.isAdmin) {
      const chartCanvas = document.getElementById(
        'BarChart'
      ) as HTMLCanvasElement;
      const ctx = chartCanvas.getContext('2d');

      // Get the heading text
      const headingText =this.translate.instant('DashBoard.Authority_BarChart')
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
      imgLink.download =
        'NoOfDigitalPaperPurchasedvsNoOfDigitalPaperAllocated.jpeg';
      imgLink.href = combinedCanvas.toDataURL('image/jpeg', 1);
      imgLink.click();
    } else {
      const chartCanvas = document.getElementById(
        'BarChart'
      ) as HTMLCanvasElement;
      const ctx = chartCanvas.getContext('2d');

      // Get the heading text
      const headingText = this.translate.instant('DashBoard.Insurance_Comp_BarChart')
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
      imgLink.download = 'DigitalPapersTaken.jpeg';
      imgLink.href = combinedCanvas.toDataURL('image/jpeg', 1);
      imgLink.click();
    }
  }

  //download chart as image
  downloadAsPDF() {
    if (this.isAdmin) {const chartCanvas = document.getElementById('BarChart') as HTMLCanvasElement;

      // Get the heading text and color
      const headingText =this.translate.instant('DashBoard.Authority_BarChart')
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
      const combinedImage = combinedCanvas.toDataURL('image/jpeg', 1.0);

      // Create a new jsPDF instance
      const pdf = new jsPDF('landscape');

      pdf.addImage(combinedImage, 'JPEG', 5, 15, 200, 70, 'image', 'FAST');// Adjust the coordinates and size as needed for positioning
      pdf.save('NoOfDigitalPaperPurchasedvsNoOfDigitalPaperAllocated.pdf');
    } else {
      const chartCanvas = document.getElementById('BarChart') as HTMLCanvasElement;

      // Get the heading text and color
      const headingText = this.translate.instant('DashBoard.Insurance_Comp_BarChart')
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

      pdf.addImage(combinedImage, 'JPEG', 5, 15, 200, 70, 'image', 'FAST'); // Adjust the coordinates and size as needed for positioning
      pdf.save('DigitalPapersTaken.pdf');
    }
  }

  // //download chart data as Excel
  downloadAsExcel() {
    if (this.isAdmin) {
      const filename ='NoOfDigitalPaperPurchasedvsNoOfDigitalPaperAllocated.xlsx';
      const jsonData = this.jsout.content;
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
    } else {
      const filename = 'DigitalPapersTaken.xlsx';
      const jsonData = this.jsout.content;
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
}
export class SplitName {
  firstName: string;
  secondName: string;
}
