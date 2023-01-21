import IIntegrationEvent  from "./integrationEvent";
class orderStatusChangedToPendingValidation extends IIntegrationEvent{

    public orderId: number;
    public orderItems: orderStockItem[]
    constructor(id: number, items: orderStockItem[]) {
        super('orderPendingValidation');
        this.orderId = id;
        this.orderItems = items;       
    }

}

class orderStockItem {

    public productId: number;
    public quantity: number;
    constructor(id: number, qty:number) {
        this.productId = id;
        this.quantity = qty;     
    }
}

export {orderStatusChangedToPendingValidation,orderStockItem}