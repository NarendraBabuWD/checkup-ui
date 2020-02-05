import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { MyHealthDataService } from '../services/my-health-data.service';
import { UtilService } from '../services/util.service';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-my-health-data',
  templateUrl: './my-health-data.component.html',
  styleUrls: ['./my-health-data.component.css']
})
export class MyHealthDataComponent implements OnDestroy {

  public selectedCategory = 'bp';
  private selectedLayoutOption = 'day';
  private selectedToggleOption = 'list';
  private startDate = new Date();
  private endDate = new Date();
  private today = new Date();
  public dateRange = [this.startDate, this.endDate];
  public hasMoreData = true;
  private timeout = null;
  public healthDataService: MyHealthDataService;
  private utilService: UtilService;
  constructor(healthDataService: MyHealthDataService, utilService: UtilService, public auth: AuthService,) {
    this.healthDataService = healthDataService;
    this.utilService = utilService;
    this.healthDataService.getHealthDataCategories();
    this.findInitialDateRange();
  }
  ngOnDestroy() {
    document.querySelector('body').classList.remove('bg-color-whilte');
  }
  categoryChangeHandler(category) {
    if(this.selectedCategory === category){
      return;
    }
    this.selectedCategory = category;
    this.healthDataService.page = 1;
    this.healthDataService.hasMoreHealthData = true;
    this.selectedLayoutOption = 'day';
    this.selectedToggleOption = 'list';
    this.findInitialDateRange();
  }
  filterResultChangeHandler(e) {
    this.healthDataService.healthData = [];
    this.healthDataService.page = 1;
    this.healthDataService.hasMoreHealthData = true;
    if (e.selectedLayoutOption !== this.selectedLayoutOption) {
      this.selectedLayoutOption = e.selectedLayoutOption;
      this.findInitialDateRange();
    }
    if(e.selectedToggleOption !== this.selectedToggleOption){
      this.selectedToggleOption = e.selectedToggleOption;
      this.fetchHealthData();
    }

  }
  findInitialDateRange() {
    switch (this.selectedLayoutOption) {
      case 'day':
      this.startDate = new Date();
      this.endDate = new Date();
      break;
      case 'week':      
      // this.startDate = new Date();
      // this.startDate.setDate(this.startDate.getDate() - 7);
      // this.endDate = new Date();    
      
      var curr = new Date;
      this.startDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      this.endDate = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));

      break;
      case 'month':
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setDate(1);
      break;
      case 'year':
      this.startDate = new Date('01/01/' + this.today.getFullYear());
      this.endDate = new Date();
      break;
      default:
    }
    this.dateRange = [this.startDate, this.endDate];
    this.fetchHealthData();
    return;
  }
  fetchHealthData() {
    switch (this.selectedCategory) {
      case 'bp':
        this.healthDataService.getBPHealthData(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      case 'body_measurement':
        this.healthDataService.getBodyMesurementHealthData(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      case 'heart_rate':
        this.healthDataService.getHeartRateHealthData(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      case 'sleep_pattern':
        this.healthDataService.getSleepPatternHealthData(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      case 'activity':
        this.healthDataService.getActivityHealthData(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      case 'spo2':
        this.healthDataService.getSpo2Data(this.startDate, this.endDate, this.selectedLayoutOption, this.selectedToggleOption);
        return;
      default :

    }
  }
  dailyDateChangeHandler(event) {
    this.healthDataService.page = 1;
    if((moment(this.startDate).format('DD/MM/YYYY') === moment(event).format('DD/MM/YYYY'))){
      return;
    }
    this.healthDataService.healthData = [];
    this.endDate = event;
    if (event){
      console.log(event); 
      this.timeout = setTimeout(() => {
        this.fetchHealthData();
        clearTimeout(this.timeout);
      }, 0);
    }
    
  }
  changeDateRangeHandler(event){
    this.healthDataService.page = 1;
    if((moment(this.startDate).format('DD/MM/YYYY') === moment(event[0]).format('DD/MM/YYYY')) && moment(this.endDate).format('DD/MM/YYYY') === moment(event[1]).format('DD/MM/YYYY')){
      return;
    }
    this.healthDataService.healthData = [];
    this.startDate = event[0];
    this.endDate = event[1];
    this.endDate = new Date(this.startDate.getTime());
    switch (this.selectedLayoutOption) {
      case 'week':
      // console.log(this.endDate.getDate());      
        this.endDate.setDate(this.endDate.getDate() + 6);
        break;
      case 'month':
        this.endDate.setDate(this.endDate.getDate() + 29);
        break;
      case 'year':
        this.endDate.setFullYear(this.endDate.getFullYear() + 1);
        break;
      default:

    }
    if(this.endDate > new Date()){
      this.endDate = new Date();
    }
    this.timeout = setTimeout(() => {
      this.dateRange = [this.startDate, this.endDate];
      this.fetchHealthData();
      clearTimeout(this.timeout);
    }, 0);
  }
  findBpCategory(sys, dia) {
    sys = parseInt(sys, 10);
    dia = parseInt(dia, 10);
    if (sys < 120 && dia < 80) {
      return 'Normal';
    }
    if (sys > 120 && sys < 130 && dia < 80) {
      return 'Elevated';
    }
    if ((sys > 130 && sys < 140) || (dia > 80 && dia < 80)) {
      return 'High Blood Pressure(Hypertension) stage1';
    }
    if (sys > 180 && dia > 120) {
      return 'Hypertensive crisis';
    }
    if (sys > 140 && dia > 90) {
      return 'High Blood Pressure(Hypertension) stage2';
    }
  }

  getDisplayLayouts() {
    const DISPLAY_FILTER_LAYOUT = 'display_filter_layout';
    const  healthDataCategoyItem = this.healthDataService.healthDataCategories.find(categoyItem =>
                                    categoyItem.category === this.selectedCategory);
    return healthDataCategoyItem && healthDataCategoyItem[DISPLAY_FILTER_LAYOUT] ? healthDataCategoyItem[DISPLAY_FILTER_LAYOUT] : null;
  }
  onScroll(){
    this.healthDataService.page += 1;
    this.fetchHealthData();
  }

  categoryItemClass(category){
    switch (category) {
      case 'body_measurement':
        return 'bg-primary';
      case 'bp':
        return 'bg-warning';
      case 'heart_rate':
        return 'bg-green';
      case 'sleep_pattern':
        return 'bg-orange';
      case 'activity':
        return 'bg-darkBlue';
      case 'spo2':
        return 'bg-info';
      default :
        return 'bg-darkBlue';
    }
  }
}
