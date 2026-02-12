export class NotificationDTO {
    claimId: number;
    template: string;
    isRead: boolean;
    lastActedCompany: string;
    toNotifyCompany: string;
    status: string;
    createdDate: any;
    receivable: boolean;
    imageUrl = 'assets/no-logo.svg';
    index:number;
}
