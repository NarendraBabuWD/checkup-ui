import { environment } from '../../environments/environment';
const appConstants = {
    routingList: {
        LOGIN_COMPONENT : '/login',
        SIGNUP_COMPONENT : '/sign-up',
        DOCTOR_COMPONENT : '/doctor',
        SUBSCRIBER_COMPONENT : '/subscriber',
        HOME_COMPONENT : '/home',
        SUBSCRIBER_MEDICAL_SUMMARY_COMPONENT : '/subscriber/medical-summary',
        DOCTOR_MEDICAL_SUMMARY_COMPONENT : '/doctor/medical-summary'
    } ,
    userType: {
        SUBSCRIBER: 'Subscriber' ,
        DOCTOR : 'Doctor',
        CORP : 'WeCheckup'
    },
    apiBaseUrl: environment.apiUrl,
    claimStatusList:{
        NEW: "New",
        SUBMITED : "Submited",
        DONE: "Done"
    }
};

export default appConstants;
