export class PurchaseStockListDto {
    purchaseId:string;
    transactionId:string;
    purchaseDate:string;
    stockCount:number;
    purchaseAmount:number;
    paymentMethod:string;
    paymentStatus:string;
    orderId:number;
    companyName?:string;
    currencyType:string;
}
