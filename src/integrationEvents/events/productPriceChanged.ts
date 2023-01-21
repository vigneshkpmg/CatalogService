import IIntegrationEvent from "./integrationEvent";

export default class productPricechanged extends IIntegrationEvent{
    private productId: Number;
    private oldPrice: Number;
    private newPrice: Number;
    constructor(id:number, oldPrice:number, newPrice:Number)
    {
        super("productPricechanged");
        this.productId = id;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
    }
}