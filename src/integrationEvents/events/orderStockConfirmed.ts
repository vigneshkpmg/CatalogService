import IIntegrationEvent from "./integrationEvent";

export default class orderStockConfirmed extends IIntegrationEvent{
    public orderId: number;
    /**
     *
     */
    constructor(id:number) {
        super("orderStockConfirmed");
        this.orderId = id;       
    }
}
