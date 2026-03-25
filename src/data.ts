import {
  Firestore,
  JobSite as JobSiteModule,
  User as UserModule,
  Org as OrgModule,
  TimeEntry as TimeEntryModule,
  Timesheet as TimesheetModule,
} from '@clockin/data';
import { db } from '@/lib/firebase';

const jobSiteService = Firestore.createJobSiteService(db);
const userService = Firestore.createUserService(db);
const orgService = Firestore.createOrgService(db);
const timeEntryService = Firestore.createTimeEntryService(db);
const timesheetService = Firestore.createTimesheetService(db);

export const JobSite = {
  Types: JobSiteModule.Types,
  Services: jobSiteService,
};

export const User = {
  Types: UserModule.Types,
  Services: userService,
};

export const Org = {
  Types: OrgModule.Types,
  Services: orgService,
};

export const TimeEntry = {
  Types: TimeEntryModule.Types,
  Services: timeEntryService,
};

export const Timesheet = {
  Types: TimesheetModule.Types,
  Services: {
    ...timesheetService,
    getCurrentPayPeriod: Firestore.getCurrentPayPeriod,
  },
};
