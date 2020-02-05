import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import * as _ from 'underscore';
import { UtilService } from '../services/util.service';
import { MyHealthReportService } from '../services/my-health-report.service';
import appConstants from '../config/app.constants';

@Component({
    selector: 'app-initial-report',
    templateUrl: './initial-report.component.html',
    styleUrls: ['./initial-report.component.css']
})
export class InitialReportComponent implements OnInit {

    initialReportForm;
    initialReportData = [];
    initialReportConfigData;
    user_id: string;
    form_group_ceate: any;
    empObj = {};
    isViewOnly = false;
    isEdit = false;
    healthReportServiceSubscribe;
    editableFields = [
        "HBA1C",
        "HDL_Cholesterol",
        "LDL_Cholesterol",
        "Total_Cholesterol",
        "WHR",
        "Triglycerides"
    ];

    constructor(private auth: AuthService, private data: DataService,
        private httpService: HttpService, private utilService: UtilService,
        private healthReportService: MyHealthReportService) { }

    ngOnInit() {
        if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
            this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
            this.isViewOnly = true;
        }
        this.initialReportForm = new FormGroup(this.empObj);

        this.healthReportServiceSubscribe = this.healthReportService.user_id_emitter.subscribe((e) => {
            if (this.auth.isDoctor()) {
                // this.user_id = e; //==== any one is fine... below one
                this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
            }
            this.httpService.commonGet('assets/json/initialReport.config.json').subscribe((initialReportConfig) => {
                this.initialReportConfigData = initialReportConfig;
                this.fetchInitialReportData().subscribe((resp) => {
                    this.isEdit = true;
                    this.initialReportData = resp.data;
                    // let data = this.initialReportData;
                    //===== Filter the data order By ======//
                    let initialReportKeys = Object.keys(this.initialReportConfigData);
                    let data = []
                    initialReportKeys.forEach(element => {
                        if (this.initialReportData.find((x) => x['vital'] === element)) {
                            data.push(this.initialReportData.find((x) => x['vital'] === element));
                        }
                    });
                    //========Filnal Fitered and sort order data ===
                    this.initialReportData = data;
                    // console.log(data);
                    this.form_group_ceate = data.map(x => x.vital);
                    this.form_group_ceate.map((x) => { return this.empObj[x] = new FormGroup(this.basicInputObject()) });
                    this.initialReportForm = new FormGroup(this.empObj);
                    let patchValObj = {};
                    this.form_group_ceate.forEach(element => {
                        patchValObj[element] = data.find((x) => x['vital'] === element);
                    });
                    this.initialReportForm.patchValue(patchValObj);
                    if (this.isViewOnly) {//==== For Subscriber only view ====
                        this.initialReportForm.disable();
                    }
                }, (err) => {
                    console.log(err);
                    this.utilService.toastrError("Not able to Load the data.", "Initial Report");
                });
            });
        })
    }

    basicInputObject() {
        return {
            date: new FormControl(),
            ideal: new FormControl(),
            initial: new FormControl(),
            target: new FormControl(),
            user_id: new FormControl(),
            vital: new FormControl(),
        }
    }

    get f() {
        return this.initialReportForm.controls;
    }
    onSubmit() {
        // console.log(this.initialReportForm.value);
        let inputInitialFormData = _.values(this.initialReportForm.value);
        let changedInputParams = this.utilService.diffObjects(this.initialReportData, inputInitialFormData);
        let updatePromises = [];
        // console.log(changedInputParams)
        if (!_.isEmpty(changedInputParams)) {
            // console.log(changedInputParams)
            for (const key in changedInputParams) {
                // console.log(changedInputParams[key]);
                let promise = new Promise((resolve, reject) => {
                    this.httpService.commonPost(appConstants.apiBaseUrl + 'update_doctor_initial_report', changedInputParams[key]).
                        subscribe((data) => {
                            // console.log(data);
                            resolve(data);
                        },
                            (err) => { reject(err) });
                });
                updatePromises.push(promise)
            }
            Promise.all(updatePromises).then((res) => {
                console.log(res);
                this.utilService.toastrSuccess(res[0].message, "Initial Report");
            }).catch((err) => {
                console.log(err);
                this.utilService.toastrError("Update Failed", "Initial Report");
            });
        } else if (_.isEmpty(changedInputParams)) {
            this.utilService.toastrInfo("you have not modified any data. Please modify and update.", "Initial Report");
        }

    }
    //======= Get patient initial Report ========//
    fetchInitialReportData() {
        return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_doctor_initial_report', { user_id: this.user_id });
    }
    
    isEditable(filed_name){
       return this.auth.isDoctor() ? !_.contains(this.editableFields, filed_name) : this.isViewOnly;
    }
    ngOnDestroy(): void {
        // this.healthReportService.user_id_emitter.unsubscribe(); //Bad Way to unsubscribe
        this.healthReportServiceSubscribe.unsubscribe();
    }
}
