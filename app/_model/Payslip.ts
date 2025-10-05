export interface Payslip {
    id: string;
    fromDate: string; // ISO
    toDate: string; // ISO
    fileName: string; // e.g. 'sample-payslip.pdf' or 'sample-payslip.png'
    fileType: 'pdf' | 'image';
    asset: any;
}