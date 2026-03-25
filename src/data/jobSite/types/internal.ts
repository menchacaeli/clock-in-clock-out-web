import { Timestamp } from 'firebase/firestore';
import { JobSiteStatus } from "../../common/types";

export interface JobSite {
    id: string;
    organizationId: string;
    name: string;
    address: string;
    status: JobSiteStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    managerIds?: string[];  // workers who can supervise this site
    workerCount?: number;   // denormalized for dashboard performance
}