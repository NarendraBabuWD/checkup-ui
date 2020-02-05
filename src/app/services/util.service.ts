import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toastr: ToastrService) { }

  convertStringToDate(str) {
    return moment(str, "DD-MM-YYYY");
  }

  timeConversion(millisec) {// it only return hours//
    return (millisec / (1000 * 60 * 60)).toFixed(2);
  }

  diffObjects(object, base) {

    let diff = _.pick(
      _.mapObject(object, (value, key) => (
        (!_.isEqual(value, base[key])) ? base[key] : null
      )),
      (value) => (value !== null)
    )

    return diff;
  }

  extractKeys(obj) {
    return Object.keys(obj);
  }
  hasEllipsis(e) {
    return (e.currentTarget.offsetWidth < e.currentTarget.scrollWidth);
  }
  convertDateStringtoFormat(dateStr, format) {
    return moment(new Date(dateStr)).format(format);
  }

  isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  isBlank(str) {
    if (str === null || str.length === 0 || str === " ") return true;
    return false;
  }

  getAge(dob) {
    var today = new Date();
    var thisYear = 0;
    var dob_date = new Date(dob);
    if (today.getMonth() < dob_date.getMonth()) {
        thisYear = 1;
    } else if ((today.getMonth() == dob_date.getMonth()) && today.getDate() < dob_date.getDate()) {
        thisYear = 1;
    }
    var age = today.getFullYear() - dob_date.getFullYear() - thisYear;
    return age;
  }
  
  toastrSuccess(msg, header) {
    // let headerContent =  header
    this.toastr.success(msg, header, {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'decreasing'
    });
  }

  toastrError(msg, header) {
    this.toastr.error(msg, header, {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'decreasing'
    });
  }

  toastrInfo(msg, header) {
    this.toastr.info(msg, header, {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'decreasing'
    });
  }

  toastrWarning(msg, header) {
    this.toastr.warning(msg, header, {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'decreasing'
    });
  }
}
