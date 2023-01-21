import orderStockConfirmed from "../events/orderStockConfirmed";
import { orderStatusChangedToPendingValidation } from "../events/orderStatusChangedToPendingValidation";
import IIntegrationEventHandler from "./IIntegrationEventHandler";
import logger from "../../infrastructure/provider/logger";
import { catalog } from "../../model/catalog";
import { confirmedOrderStockItem, orderStockRejected } from "../events/orderStockRejected";

class orderStatusChangedToPendingValidationHandler implements IIntegrationEventHandler<orderStatusChangedToPendingValidation>{
    async Handle(integrationEvent: orderStatusChangedToPendingValidation) {
        logger.info(`Integration event is getting consumed: event id: ${integrationEvent.eventId} and event name: ${integrationEvent.eventName}`)
        let availableItems: confirmedOrderStockItem[] = [];
        for await (const item of integrationEvent.orderItems) {
            var product = await catalog.findById(item.productId);
            if (product) {
                const hasStock = product!.quantity >= item.quantity
                availableItems.push(new confirmedOrderStockItem(product?.id, hasStock))
            }
        }
        const event = availableItems.some(x => !x.hasStock) ?
                        new orderStockRejected(integrationEvent.orderId) :
                        new orderStockConfirmed(integrationEvent.orderId);
      
  }
}