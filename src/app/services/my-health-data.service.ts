
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from './http.service';
import * as _ from 'underscore';
import { AuthService } from '../auth.service';
import { UtilService } from './util.service';
import appConstants from '../config/app.constants';

@Injectable({
  providedIn: 'root'
})
export class MyHealthDataService {
  public healthData = [];
  private httpService: HttpService;
  public healthDataCategories = [];
  public seletedCategory;
  private auth: AuthService;
  private utilService: UtilService;
  private healthDataDashboardConfig = {};
  public page = 1;
  public hasMoreHealthData = true;
  public defaultWeeks = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  public defaultWeeksDays = [];
 

  constructor(httpService: HttpService, auth: AuthService, utilService: UtilService) {
    this.auth = auth;
    this.httpService = httpService;
    this.utilService = utilService;
  }
  /*fetchBPHealthData(startDate, endDate, filterType, toggleOption){

    this.seletedCategory = 'bp';
    const params = {
      columns: this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["input_fields"],
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      filter_type: toggleOption === 'list' ? this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["modified_filter_layout"]: filterType,
      device_id: 'iChoiceDevice_BPM_02',
      user_id: this.auth.getUserId(),
      page: this.page
      };
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_device_data', params).subscribe((res) => {
      if(res.data.length > 0 ){
        this.hasMoreHealthData = true;
      } else {
        this.hasMoreHealthData = false;
      }
      this.healthData = filterType === 'day' ? this.healthData.concat(res.data): res.data;
    });
  }*/
  /*getBPHealthData(startDate, endDate, filterType, toggleOption) {
    if(Object.keys(this.healthDataDashboardConfig).length > 0){
      this.fetchBPHealthData(startDate, endDate, filterType, toggleOption);
    } else {
      this.httpService.commonGet('assets/json/healthDataDashboard.config.json').subscribe((healthDataDashboardConfig) => {
        // this.healthDataDashboardConfig = healthDataDashboardConfig;
        // console.log(healthDataDashboardConfig.categories.spo2);
        if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Subscriber")
        {
          delete healthDataDashboardConfig.categories.spo2;
          }
      this.healthDataDashboardConfig = healthDataDashboardConfig;
      
        this.fetchBPHealthData(startDate, endDate, filterType, toggleOption);
      });
    }

  }*/
  
  /*getBodyMesurementHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'body_measurement';
    const params = {
      columns: this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["input_fields"],
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      filter_type: toggleOption === 'list' ? this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["modified_filter_layout"]: filterType,
      device_id: 'SmartBodyanalyzer_01',
      user_id: this.auth.getUserId(),
      page: this.page
      };
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_device_data', params).subscribe((res) => {
      if(res.data.length > 0){
        this.healthData = this.healthData.concat(res.data);
        this.hasMoreHealthData = true;
      } else {
        this.hasMoreHealthData = false;
      }
    });
  }*/


  

  getBodyMesurementHealthData(startDate, endDate, filterType, toggleOption) {
    this.healthData = [];
    this.seletedCategory = 'Body Measurement';
    const params = { 
      date_from: moment(startDate).format('YYYY-MM-DD'),
      date_to: moment(endDate).format('YYYY-MM-DD'),
      // date_from: '2020-03-01',
      // date_to: '2020-03-31',
      category: this.seletedCategory
      };
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDeviceData', params).subscribe((res) => {
        if(res.data.length > 0){
          var dayArray = [];
          if(filterType == 'week'){
            for(let i = 0; i < res.data.length; i++){
              var day = moment(res.data[i].date).format('dddd');
              
              dayArray.push({day: day});
            }
           
            let arr3 = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
           
            for(let j = 0; j < this.defaultWeeks.length; j++){
                  var bmi = 0;
                  var bodyWeight = 0;
                  var fat = 0;
                  var muscle = 0;
                  var itemCount = 0;
                for(let k = 0; k < arr3.length; k++){
                      if(this.defaultWeeks[j] == arr3[k].day){
                           bmi += parseFloat(arr3[k].bmi);
                           bodyWeight += parseFloat(arr3[k].body_weight);
                           fat += parseFloat(arr3[k].fat);
                           muscle += parseFloat(arr3[k].muscle);
                           itemCount += 1;
                      }
                }
                if(itemCount > 0){
                  this.healthData.push({week: this.defaultWeeks[j], avgBmi: (bmi/itemCount).toFixed(2), avgBodyWeight: (bodyWeight/itemCount).toFixed(2),
                                      avgfat: (fat/itemCount).toFixed(2), avgMuscle: (muscle/itemCount).toFixed(2)})
                }
            }
          } else if(filterType == 'month'){
            var totNumOfWeeks = [];
           /* for (var totalweeks = 1; totalweeks <= 53; totalweeks++) {
                     totNumOfWeeks.push("week "+totalweeks);
             }*/

            for(let i = 0; i < res.data.length; i++){
              var weeknumber = moment(res.data[i].date, "YYYYMMDD").week();
              dayArray.push({day: "week "+weeknumber});
            }
            
            let combinedArray = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
            for(let l = 0; l < combinedArray.length; l++){
              if (totNumOfWeeks.includes(combinedArray[l].day) === false) totNumOfWeeks.push(combinedArray[l].day);
            }
            
           for(let j = 0; j < totNumOfWeeks.length; j++){
            var bmi = 0;
            var bodyWeight = 0;
            var fat = 0;
            var muscle = 0;
            var itemCount = 0;
          for(let k = 0; k < combinedArray.length; k++){
                if(totNumOfWeeks[j] == combinedArray[k].day){
                  bmi += parseFloat(combinedArray[k].bmi);
                  bodyWeight += parseFloat(combinedArray[k].body_weight);
                  fat += parseFloat(combinedArray[k].fat);
                  muscle += parseFloat(combinedArray[k].muscle);
                  itemCount += 1;
                }
          }
          if(itemCount > 0){
            this.healthData.push({week: totNumOfWeeks[j], avgBmi: (bmi/itemCount).toFixed(2), avgBodyWeight: (bodyWeight/itemCount).toFixed(2),
                                avgfat: (fat/itemCount).toFixed(2), avgMuscle: (muscle/itemCount).toFixed(2)})
          }
      }
        
          } else{
            this.healthData = res.data;
            this.hasMoreHealthData = true;
          }
        } else {
          this.hasMoreHealthData = false;
        }
    });
  }

  getBPHealthData(startDate, endDate, filterType, toggleOption){

    this.seletedCategory = 'Blood Pressure';
    const params = {
     date_from: moment(startDate).format('YYYY-MM-DD'),
      date_to: moment(endDate).format('YYYY-MM-DD'),
      // date_from: '2020-03-01',
      // date_to: '2020-03-31',
      category: this.seletedCategory
      };
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDeviceData', params).subscribe((res) => {
        if(res.data.length > 0){
          var dayArray = [];
          if(filterType == 'week'){
            for(let i = 0; i < res.data.length; i++){
              var day = moment(res.data[i].date).format('dddd');
             
              dayArray.push({day: day});
            }
           
            let arr3 = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
            
            for(let j = 0; j < this.defaultWeeks.length; j++){
                  var sys = 0;
                  var dia = 0;
                  var itemCount = 0;
                for(let k = 0; k < arr3.length; k++){
                      if(this.defaultWeeks[j] == arr3[k].day){
                           sys += parseFloat(arr3[k].sys);
                           dia += parseFloat(arr3[k].dia);
                           itemCount += 1;
                      }
                }
                if(itemCount > 0 && !isNaN(sys) && !isNaN(dia)){
                  this.healthData.push({week: this.defaultWeeks[j], avgSys: sys/itemCount, avgDia: dia/itemCount})
                }
            }
            
          } else if(filterType == 'month'){
            var totNumOfWeeks = [];
            /*for (var totalweeks = 1; totalweeks <= 53; totalweeks++) {
                     totNumOfWeeks.push("week "+totalweeks);
             }*/

            for(let i = 0; i < res.data.length; i++){
              var weeknumber = moment(res.data[i].date, "YYYYMMDD").week();
              
              dayArray.push({day: "week "+weeknumber});
            }
            
            let combinedArray = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
            // console.log(combinedArray);
            for(let l = 0; l < combinedArray.length; l++){
              if (totNumOfWeeks.includes(combinedArray[l].day) === false) totNumOfWeeks.push(combinedArray[l].day);
            }
           for(let j = 0; j < totNumOfWeeks.length; j++){
            var sys = 0;
            var dia = 0;
            var itemCount = 0;
          for(let k = 0; k < combinedArray.length; k++){
                if(totNumOfWeeks[j] == combinedArray[k].day && combinedArray[k].sys != null && combinedArray[k].dia != null){
                  sys += parseFloat(combinedArray[k].sys);
                  dia += parseFloat(combinedArray[k].dia);
                  itemCount += 1;
                }
          }
          if(itemCount > 0 ){
            this.healthData.push({week: totNumOfWeeks[j], avgSys: sys/itemCount, avgDia: dia/itemCount})
          }
      }
        
          }else{
            this.healthData = res.data;
            this.hasMoreHealthData = true;
          }
        } else {
          this.hasMoreHealthData = false;
        }
    });
  }

  /*getHeartRateHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'heart_rate';
    const params = {
      columns: this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["input_fields"],
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      filter_type: toggleOption === 'list' ? this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["modified_filter_layout"]: filterType,
      device_id: 'SmartBand_03',
      page: this.page,
      user_id: this.auth.getUserId(),
      };
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_device_data', params).subscribe((res) => {
      if(res.data.length > 0){
        this.healthData = this.healthData.concat(res.data);
        this.hasMoreHealthData = true;
      } else {
        this.hasMoreHealthData = false;
      }
    });
  }*/

  getHeartRateHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'Heart Rate';
    const params = {
      date_from: moment(startDate).format('YYYY-MM-DD'),
       date_to: moment(endDate).format('YYYY-MM-DD'),
      //  date_from: '2020-03-01',
      //  date_to: '2020-03-31',
       category: this.seletedCategory
       };
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDeviceData', params).subscribe((res) => {
        if(res.data.length > 0){
          var dayArray = [];
          if(filterType == 'week'){
            for(let i = 0; i < res.data.length; i++){
              var day = moment(res.data[i].date).format('dddd');
              
              dayArray.push({day: day});
            }
            
            this.healthData = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
            
          } else if(filterType == 'month'){
            var totNumOfWeeks = [];
           /* for (var totalweeks = 1; totalweeks <= 53; totalweeks++) {
                     totNumOfWeeks.push("week "+totalweeks);
             }*/

            for(let i = 0; i < res.data.length; i++){
              var weeknumber = moment(res.data[i].date, "YYYYMMDD").week();
              
              dayArray.push({day: "week "+weeknumber});
            }
            
            let combinedArray = res.data.map((item, i) => Object.assign({}, item, dayArray[i]));
            for(let l = 0; l < combinedArray.length; l++){
              if (totNumOfWeeks.includes(combinedArray[l].day) === false) totNumOfWeeks.push(combinedArray[l].day);
            }
           for(let j = 0; j < totNumOfWeeks.length; j++){
            var heartRate = 0;
            var itemCount = 0;
          for(let k = 0; k < combinedArray.length; k++){
                if(totNumOfWeeks[j] == combinedArray[k].day){
                  heartRate += parseInt(combinedArray[k].heart_rate);
                     itemCount += 1;
                }
          }
          if(itemCount > 0){
            this.healthData.push({day: totNumOfWeeks[j], heart_rate: Math.round(heartRate/itemCount)})
          }
      }
       
          } else{
            this.healthData = res.data;
            this.hasMoreHealthData = true;
          }
        } else {
          this.hasMoreHealthData = false;
        }
    });
  }
  
  getSleepPatternHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'sleep_pattern';
    this.getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption);
  }
  // getActivityHealthData(startDate, endDate, filterType, toggleOption) {
  //   this.seletedCategory = 'activity';
  //   this.getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption);
  // }

  getSpo2Data(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'spo2';
    this.getSpo2HealthData(startDate, endDate, filterType, toggleOption);
  }

  getSpo2HealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'spo2';
    const params = {
      columns: this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["input_fields"],
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      filter_type: toggleOption === 'list' ? this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["modified_filter_layout"]: filterType,
      device_id: 'SmartBand_03',
      page: this.page,
      user_id: this.auth.getUserId(),
      };
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_device_data', params).subscribe((res) => {
      if(res.data.length > 0){
        // this.healthData = this.healthData.concat(res.data);
        this.healthData = res.data;
        
        this.hasMoreHealthData = true;
      } else {
        this.hasMoreHealthData = false;
      }
    });
  }

  getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'Sleep Pattern';
    const params = {
      date_from: moment(startDate).format('YYYY-MM-DD'),
       date_to: moment(endDate).format('YYYY-MM-DD'),
      //  date_from: '2020-03-08',
      //  date_to: '2020-03-14',
       category: this.seletedCategory
       };
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDeviceData', params).subscribe((res) => {
      if(res.data.length > 0){
        if(filterType == 'week' || filterType == 'month'){
          var sleep_hours=0;
           for(var i in res.data) { sleep_hours += parseInt(res.data[i].sleep_hours); }
            
            var sleep_minutes=0;
           for(var i in res.data) { sleep_minutes += parseInt(res.data[i].sleep_minutes); }
            
            this.healthData.push({
              sleep_hours: sleep_hours,
              sleep_minutes: sleep_minutes
            });
        } else{
          this.healthData = res.data;
          this.hasMoreHealthData = true;
        }
      } else {
        this.hasMoreHealthData = false;
      }
    });
  }

  getActivityHealthData(startDate, endDate, filterType, toggleOption) {
    this.healthData = [];
    this.seletedCategory = 'Activity';
    const params = {
       date_from: moment(startDate).format('YYYY-MM-DD'),
       date_to: moment(endDate).format('YYYY-MM-DD'),
      //  date_from: '2020-03-08',
      //  date_to: '2020-03-14',
       category: this.seletedCategory
       };
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDeviceData', params).subscribe((res) => {
      if(res.data.length > 0){
        if(filterType == 'week' || filterType == 'month'){
          var steps=0;
           for(var i in res.data) { steps += parseInt(res.data[i].steps); }
            
            var distance=0;
           for(var i in res.data) { distance += parseFloat(res.data[i].distance); }
            
            var calories=0;
           for(var i in res.data) { calories += parseFloat(res.data[i].calories_burt); }
          
            this.healthData.push({
              steps: steps,
              distance: distance,
              calories_burt: calories
            });
        } else{
          this.healthData = res.data;
          this.hasMoreHealthData = true;
        }
        
      } else {
        this.hasMoreHealthData = false;
      }
    });
  }

  /*getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption) {
    if(filterType === 'day'){
      const params = {
        user_id: this.auth.getUserId(),
        date: moment(startDate).format('YYYY-MM-DD')
        };
      this.httpService.commonPost(appConstants.apiBaseUrl + 'latest_device_data', params).subscribe((res) => {
        this.healthData = res.data['sleep_minutes'] ?   [res.data] : [];
      //  console.log( this.healthData);
       
        if( this.healthData.length >0 ){
          this.healthData[0]['date']= moment(startDate).format('YYYY-MM-DD');
        }
        
      });
      return;
    }
    const params = {
      columns: this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["input_fields"],
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      filter_type: toggleOption === 'list' ? this.healthDataDashboardConfig['categories'][this.seletedCategory]["display_filter_layout"][filterType]["modified_filter_layout"]: filterType,
      device_id: 'SmartBand_03',
      user_id: this.auth.getUserId(),
      };
      this.httpService.commonPost(appConstants.apiBaseUrl + (this.seletedCategory === 'sleep_pattern' ? 'get_device_data': 'steps'), params).subscribe((res) => {
        console.log(res);
        
        if(this.seletedCategory === 'sleep_pattern'){
          this.healthData = res.data.filter(item => item.sleep_minutes !== null);
        } else {
          this.healthData = res.data.filter(item => item.steps !== null || item.calories_burt !== null);
        }
    });
  }*/

  getSyncedLatestDeviceData(healthDataDashboardConfig, latestDeviceData, params){
    let resultPromises = [];
    let promise = null;
    for (let key of Object.keys(healthDataDashboardConfig['devices'] ? healthDataDashboardConfig['devices']: {})){
      promise =  new Promise(resolve => {
        params["device_id"] = key;
        this.httpService.commonPost(appConstants.apiBaseUrl + 'get_last_sync_time', params).subscribe(res => {
          params["date"] = res.data.length > 0 ? res.data[0].date : moment().format("YYYY-MM-DD hh:mm:ss");
          delete  params["device_id"];
          this.httpService.commonPost(appConstants.apiBaseUrl + 'latest_device_data', params).subscribe((resp) => {
            for (let categoryIndicator of healthDataDashboardConfig['devices'][key]) {
              latestDeviceData[categoryIndicator] = resp.data[categoryIndicator];
            }
            resolve(latestDeviceData);
          });
        });
      });
      resultPromises.push(promise)
      }
      return resultPromises;
  }

  getHealthDataCategories() {
    let latestDeviceData = {};
    this.healthDataCategories = [];
    const params = {
      user_id: this.auth.getUserId()
    };
    this.httpService.commonGet('assets/json/healthDataDashboard.config.json').subscribe((healthDataDashboardConfig) => {
      if(JSON.parse(sessionStorage.getItem("userdata")).category == 2)
      {
        delete healthDataDashboardConfig.categories.spo2;
        }
      this.healthDataDashboardConfig = healthDataDashboardConfig;
      
      // Promise.all(this.getSyncedLatestDeviceData(healthDataDashboardConfig, latestDeviceData, params)).then( (res)=> {
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getLatestDeviceData', {}).subscribe((resp) => {
      // console.log(resp);
        let latestDeviceData = resp.data;
        for (const key of Object.keys(this.healthDataDashboardConfig["categories"] ? this.healthDataDashboardConfig["categories"]: {})) {
          const INPUT_FIELDS = 'input_fields';
          const TITLE = 'title';
          const CATEGORY = 'category';
          const DISPLAY_VALUE = 'displayValue';
          const DISPLAY_FILTER_LAYOUT = 'display_filter_layout';
          const ICON = 'icon';
          const commonHealthDataArr = _.intersection(Object.keys(latestDeviceData), this.healthDataDashboardConfig['categories'][key][INPUT_FIELDS]);
          const healthDataCategoryObj = {};
          healthDataCategoryObj[CATEGORY] = key;
          healthDataCategoryObj[TITLE] = this.healthDataDashboardConfig['categories'][key][TITLE];
          healthDataCategoryObj[ICON] = this.healthDataDashboardConfig['categories'][key][ICON];
          // console.log(healthDataDashboardConfig, key);
          healthDataCategoryObj[DISPLAY_FILTER_LAYOUT] = Object.keys(this.healthDataDashboardConfig['categories'][key][DISPLAY_FILTER_LAYOUT]);
          // console.log(healthDataCategoryObj[DISPLAY_FILTER_LAYOUT]);
          
          healthDataCategoryObj[DISPLAY_VALUE] = this.getDisplayCategoryValues(key, latestDeviceData);

          
          if (commonHealthDataArr.length > 0) {

          for (const commonHealthDataKey of commonHealthDataArr) {
            healthDataCategoryObj[commonHealthDataKey] = latestDeviceData[commonHealthDataKey];
            }
          this.healthDataCategories.push(healthDataCategoryObj);
          }
          
        }
      });
     
  });
  }

  getDisplayCategoryValues = (category, deviceDataArr) => {
    let displayValue = '';
    switch (category) {
      case 'bp':
        return displayValue =  deviceDataArr.bp ? deviceDataArr.bp + ' mmHg' : '0';
      case 'body_measurement':
        return displayValue = deviceDataArr.body_weight ? deviceDataArr.body_weight + ' kg' : '0';
      case 'heart_rate':
        return displayValue = deviceDataArr.heart_rate ? deviceDataArr.heart_rate + ' bpm' : '0';
      case 'sleep_pattern':
        return  deviceDataArr.sleep_pattern ? deviceDataArr.sleep_pattern +' Hrs' : '0 Hrs' ;
        // return  deviceDataArr.sleep_minutes? this.utilService.timeConversion(deviceDataArr.sleep_minutes)+' Hrs' : '0 Hrs' ;
      case 'activity':
        return displayValue = (deviceDataArr.steps ? (  Math.floor(deviceDataArr.steps) + ' Steps') : '0 Steps') +
        (deviceDataArr.steps || deviceDataArr.calories_burned ? ', ' : ' ') +
        (deviceDataArr.calories_burned ? ( Math.floor(deviceDataArr.calories_burned) + ' Kcal') : '0 Kcal');
      case 'spo2':
        return displayValue = deviceDataArr.spo2 ? deviceDataArr.spo2 + '%' : '0 %';
      
        default :

    }
    return '';
  }
  dateConverter(d, selectedFilterOptionVal) {
    let date = null;
    switch (selectedFilterOptionVal) {
      case 'day' || undefined:
        date = moment(d.date);
        break;
      case 'week':
        date = moment(d.date, 'DD-MM-YYYY');
        break;
      case 'month':
        date = moment(d.week, 'WW-YYYY');
        break;
      case 'year':
        date = moment(d.month, 'M-YYYY');
        break;
      default:
    }
    return date;
  }
  /*mapHealthDataForChart(healthData, selectedLayoutOption ) {
      const HEALTH_CHART_MAPPING = 'healthChartMapping';
      const healthChartMapping = this.healthDataDashboardConfig[HEALTH_CHART_MAPPING];
        // console.log( healthChartMapping, healthChartMapping[this.seletedCategory])
        // console.log(Object.keys(healthChartMapping[this.seletedCategory]))
      return Object.keys(healthChartMapping[this.seletedCategory]).map(key => {
        const tmpObj = {name: '', values: null};
        tmpObj.name = healthChartMapping[this.seletedCategory][key];
        if ( healthData instanceof Array) {
            tmpObj.values = healthData.map(data => {
              return {
                date: this.dateConverter(data, selectedLayoutOption),
                value: key ==='sleep_minutes'? this.utilService.timeConversion(data[key]) : data[key]
              };
            });
        } else {
            tmpObj.values = [{
                date: this.dateConverter(healthData, selectedLayoutOption),
                value: key ==='sleep_minutes'? this.utilService.timeConversion(healthData[key]) : healthData[key]
            }];
        }
        return tmpObj;
      });

  }*/
  mapHealthDataForChart(healthData, selectedLayoutOption, seletedCategory ) {
    const HEALTH_CHART_MAPPING = 'healthChartMapping';
    return healthData
}

}
