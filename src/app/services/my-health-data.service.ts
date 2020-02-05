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

  constructor(httpService: HttpService, auth: AuthService, utilService: UtilService) {
    this.auth = auth;
    this.httpService = httpService;
    this.utilService = utilService;
  }
  fetchBPHealthData(startDate, endDate, filterType, toggleOption){

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
  }
  getBPHealthData(startDate, endDate, filterType, toggleOption) {
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

  }
  getBodyMesurementHealthData(startDate, endDate, filterType, toggleOption) {
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
  }

  getHeartRateHealthData(startDate, endDate, filterType, toggleOption) {
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
  }
  
  getSleepPatternHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'sleep_pattern';
    this.getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption);
  }
  getActivityHealthData(startDate, endDate, filterType, toggleOption) {
    this.seletedCategory = 'activity';
    this.getsleepPatternOrActivityHealthData(startDate, endDate, filterType, toggleOption);
  }

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
  }

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
      if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Subscriber")
      {
        delete healthDataDashboardConfig.categories.spo2;
        }
      this.healthDataDashboardConfig = healthDataDashboardConfig;
      
      // Promise.all(this.getSyncedLatestDeviceData(healthDataDashboardConfig, latestDeviceData, params)).then( (res)=> {
      this.httpService.commonPost(appConstants.apiBaseUrl + 'get_all_device_data', params).subscribe((resp) => {
      // console.log(resp);
        let latestDeviceData = resp.data[0]
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
        return displayValue = deviceDataArr.sys && deviceDataArr.dia ? deviceDataArr.sys + '/' + deviceDataArr.dia + 'mmHg' : '0';
      case 'body_measurement':
        return displayValue = deviceDataArr.body_weight ? deviceDataArr.body_weight + 'kg' : '0';
      case 'heart_rate':
        return displayValue = deviceDataArr.heart_rate ? deviceDataArr.heart_rate + 'bpm' : '0';
      case 'sleep_pattern':
        return  deviceDataArr.sleep_hours ? deviceDataArr.sleep_hours +' Hrs' : '0 Hrs' ;
        // return  deviceDataArr.sleep_minutes? this.utilService.timeConversion(deviceDataArr.sleep_minutes)+' Hrs' : '0 Hrs' ;
      case 'activity':
        return displayValue = (deviceDataArr.steps ? (  Math.floor(deviceDataArr.steps) + ' Steps') : '0 Steps') +
        (deviceDataArr.steps || deviceDataArr.calories_burt ? ', ' : ' ') +
        (deviceDataArr.calories_burt ? ( Math.floor(deviceDataArr.calories_burt) + ' Kcal') : '0 Kcal');
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
  mapHealthDataForChart(healthData, selectedLayoutOption ) {
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

  }
}


