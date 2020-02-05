import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DoctorComponent } from './doctor/doctor.component';
import { MedicalSummaryComponent } from './subscriber/medical-summary/medical-summary.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { MyHealthDataComponent } from './my-health-data/my-health-data.component';
import { InitialReportComponent } from './initial-report/initial-report.component';
import { MyHealthReportComponent } from './my-health-report/my-health-report.component';
import { SubscriberProfileComponent } from './subscriber/subscriber-profile/subscriber-profile.component';
import { DoctorProfileComponent } from './doctor/doctor-profile/doctor-profile.component';
import { InviteSubscriberComponent } from './invite-subscriber/invite-subscriber.component';
import { EmpanelmentFormComponent } from './empanelment-form/empanelment-form.component';
import { ClaimSubmittionComponent } from './claim-submittion/claim-submittion.component';
import { ClaimHistoryComponent } from './claim-history/claim-history.component';
import { RequestPatientsComponent  } from './request-patients/request-patients.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { SettingsComponent } from './settings/settings.component';
import { DoctorAppointmentComponent } from './doctor-appointment/doctor-appointment.component';
import { SubscriberAppointmentComponent } from './subscriber-appointment/subscriber-appointment.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { HealthInfoBitsComponent } from './health-info-bits/health-info-bits.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResponseComponent } from './response/response.component';
import { PaymentComponent } from './payment/payment.component';
import { SubscriptionAccountComponent } from './subscription-account/subscription-account.component';
import { SubscriptionOrderComponent } from './subscription-order/subscription-order.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'health-data', pathMatch: 'full', component: MyHealthDataComponent, canActivate: [AuthGuard] },
  { path: 'initial-report', component: InitialReportComponent, canActivate: [AuthGuard] },
  { path: 'health-report', component: MyHealthReportComponent, canActivate: [AuthGuard] },
  { path: 'empanelment-form', component: EmpanelmentFormComponent, canActivate: [AuthGuard] },
  { path: 'claim-submission', component: ClaimSubmittionComponent, canActivate: [AuthGuard] },
  { path: 'claim-history', component: ClaimHistoryComponent, canActivate: [AuthGuard] },
  { path: 'request-patient', component: RequestPatientsComponent, canActivate: [AuthGuard]},
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard]},
  { path: 'response', pathMatch: 'full', component: ResponseComponent},
  { path: 'subscription-order', component: SubscriptionOrderComponent, canActivate: [AuthGuard]},
  { path: 'subscriber',
    children: [
          { path: 'medical-summary', pathMatch: 'full', component: MedicalSummaryComponent, canActivate: [AuthGuard] },
          { path: 'profile', pathMatch: 'full', component: SubscriberProfileComponent, canActivate: [AuthGuard] },
       ]
  },
  { path: 'doctor',
    children: [
          { path: 'medical-summary', pathMatch: 'full', component: MedicalSummaryComponent, canActivate: [AuthGuard] },
          { path: 'profile', pathMatch: 'full', component: DoctorProfileComponent, canActivate: [AuthGuard] },
        ]
  },
  { path: '',  redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  redirectTo: '/login', pathMatch: 'full' },
  { path: 'sign-up',  redirectTo: '/sign-up', pathMatch: 'full' },
  { path: 'doctor',  redirectTo: '/doctor', pathMatch: 'full' },
  { path: 'subscriber',  redirectTo: '/subscriber', pathMatch: 'full' },
  { path: '',  redirectTo: '/home', pathMatch: 'full' },
  { path: 'invite-subscriber', component: InviteSubscriberComponent, canActivate: [AuthGuard] },
  { path: 'help-support', component: HelpSupportComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'doctor-appointment', component: DoctorAppointmentComponent, canActivate: [AuthGuard] },
  { path: 'subscriber-appointment', component: SubscriberAppointmentComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'announcements', component: AnnouncementsComponent, canActivate: [AuthGuard] },
  { path: 'whatsnew', component: WhatsNewComponent, canActivate: [AuthGuard] },
  { path: 'healthInfoBits', component: HealthInfoBitsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate: [AuthGuard]},
  { path: 'subscription-account', component: SubscriptionAccountComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash:true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
