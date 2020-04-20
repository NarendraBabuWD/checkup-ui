import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import { MyHealthDataService } from '../../services/my-health-data.service';
import d3Tip from "d3-tip"
import * as Highcharts from 'highcharts';

// import * as d3-tip from '/../assets/js/lib/d3-tip.js';
// import * as d3-tip from 'tip';

@Component({
  selector: 'chart-multi-line',
  templateUrl: './multi-line.component.html',
  styleUrls: ['./multi-line.component.css']
})
export class MultiLineComponent implements OnChanges {
  // public data;
  constructor(private healthDataService: MyHealthDataService) { }
  @Input("selectedFilterOption") selectedLayoutOption;
  @Input("seletedCategory") seletedCategory;
  dydata: any;
  data: any;
  chartOptions: any;
  highcharts: any;
  /*removeChartFromDom(){
    if(document.getElementById('multi-line-chart').children.length > 0){
      document.getElementById('multi-line-chart').children[0].remove(); 
    }
  }*/
  ngOnChanges() {
    // this.removeChartFromDom();
    this.createChart(this.healthDataService.healthData);
  }

  private createChart(healthData): void {
    var dydata = this.healthDataService.mapHealthDataForChart(healthData, this.selectedLayoutOption, this.seletedCategory);
    
   //  console.log(this.selectedLayoutOption);
   //  console.log(this.seletedCategory);

    if(this.seletedCategory == 'Body Measurement'){
      this.getBodyMeasurementChart(dydata, this.selectedLayoutOption);
        }
        
        if(this.seletedCategory == 'Blood Pressure'){
         this.getBPChart(dydata, this.selectedLayoutOption);
           }
        if(this.seletedCategory == 'Sleep Pattern'){
          this.getSleepPatternChart(dydata);
        }

        if(this.seletedCategory == 'Heart Rate'){
            this.getHeartRateChart(dydata, this.selectedLayoutOption);
        }
    if(this.seletedCategory == 'Activity'){
      this.getActivityChart(dydata);
    }
    // this.multiLineChart();
  }  
  
    getBPChart(healthData, selectedLayoutOption){
       
   let categories = [];
   let sys = [];
   let dia = [];
      if(selectedLayoutOption != 'day'){
         for(var i in healthData) { categories.push(healthData[i].week);
         sys.push(parseFloat(healthData[i].avgSys));
         dia.push(parseFloat(healthData[i].avgDia)); }
      } else{
         for(var i in healthData) { categories.push(moment(healthData[i].date).format('HH:mm'));
         sys.push(parseFloat(healthData[i].sys));
         dia.push(parseFloat(healthData[i].dia)); }
      }
 
 this.highcharts = Highcharts;
 this.chartOptions = {   
   credits: {
      enabled: false
  },
    chart: {
       type: "spline"
    },
    title: {
       text: "Blood Pressure"
    },
    xAxis:{
       categories: categories
    },
    yAxis: {          
       title:{
          text:"Values"
       } 
    },
   
    series: [
       {
          name: 'Sys',
          data: sys
       },
       {
          name: 'Dia',
          data: dia
       }
    ]
 };
  }

  
  getHeartRateChart(healthData, selectedLayoutOption){
   let categories = [];
   let heartRate = [];


                           if(selectedLayoutOption != 'day'){
                              for(var i in healthData) { 
                                 categories.push(healthData[i].day);
                                 heartRate.push(parseFloat(healthData[i].heart_rate));
                               }
                           } else{
                              for(var i in healthData) { 
                                 categories.push(moment(healthData[i].date).format('HH:mm'));
                                 heartRate.push(parseFloat(healthData[i].heart_rate)); }
                           }
 
 this.highcharts = Highcharts;
 this.chartOptions = {   
   credits: {
      enabled: false
  },
    chart: {
       type: "spline"
    },
    title: {
       text: "Heart Rate"
    },
    xAxis:{
       categories: categories
    },
    yAxis: {          
       title:{
          text:"Values"
       } 
    },
   
    series: [
       {
          name: 'Heart rate',
          data: heartRate
       }
    ]
 };
  }


  getActivityChart(healthData){
    let steps = [];
    let calories = [];
    let distance = [];
    steps.push(healthData[0].steps);
    calories.push(healthData[0].calories_burt);
    distance.push(healthData[0].distance);
    this.highcharts = Highcharts;
    this.chartOptions = {   
      credits: {
        enabled: false
    },
    xAxis: {
      labels: {
          enabled: false
      }
  },
    title : {
          text: 'Activity'   
       },      
       series : [{
          type: 'scatter',
          zoomType:'y',
          name: 'Steps',
          data: steps
       },
       {
        type: 'scatter',
        zoomType:'y',
        name: 'Calories',
        data: calories
     },
     {
      type: 'scatter',
      zoomType:'y',
      name: 'Distance',
      data: distance
   }
      ]
    };
  }


  getSleepPatternChart(healthData){
    let hrsmins = healthData[0].sleep_hours+"."+healthData[0].sleep_minutes;
    // let hrsmins = "10.2";
    let sleep = [];
    sleep.push(parseFloat(hrsmins));
    this.highcharts = Highcharts;
    this.chartOptions = {   
      credits: {
        enabled: false
    },
    xAxis: {
      labels: {
          enabled: false
      }
  },
    title : {
          text: 'Sleep Pattern'   
       },      
       series : [{
          type: 'scatter',
          zoomType:'y',
          name: 'Sleep Hours',
          data: sleep
       }
      ]
    };
  }

  getBodyMeasurementChart(healthData, selectedLayoutOption){
      let categories = [];
      let bmi = [];
      let weight = [];
      let muscle = [];
         if(selectedLayoutOption != 'day'){
                        for(var i in healthData) { categories.push(healthData[i].week);
                        bmi.push(parseFloat(healthData[i].avgBmi));
                        weight.push(parseFloat(healthData[i].avgBodyWeight));
                        muscle.push(parseFloat(healthData[i].avgMuscle)); }
         } else{
            for(var i in healthData) { categories.push(moment(healthData[i].date).format('HH:mm'));
                                       bmi.push(parseFloat(healthData[i].bmi));
                                       weight.push(parseFloat(healthData[i].body_weight));
                                       muscle.push(parseFloat(healthData[i].muscle)); }
         }

    
    this.highcharts = Highcharts;
    this.chartOptions = {   
      credits: {
         enabled: false
     },
       chart: {
          type: "spline"
       },
       title: {
          text: "Body Measurement"
       },
       xAxis:{
          categories: categories
       },
       yAxis: {          
          title:{
             text:"Values"
          } 
       },
      
       series: [
          {
             name: 'Weight',
             data: weight
          },
          {
             name: 'BMI',
             data: bmi
          },
          {
             name: 'Muscle',
             data: muscle
          }
       ]
    };
 }
  
  ngOnDestroy(): void {
    // d3.select("#multi-line-chart").remove() 
  }

}

