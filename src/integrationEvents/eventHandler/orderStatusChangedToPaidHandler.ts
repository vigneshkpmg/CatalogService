import logger from "../../infrastructure/provider/logger";
import { catalog } from "../../model/catalog";
import orderStatusChangedToPaid  from "../events/orderStatusChangedToPaid";
import IIntegrationEventHandler from "./IIntegrationEventHandler";

class orderStatusChangedToPaidHandler implements IIntegrationEventHandler<orderStatusChangedToPaid>{
    async Handle(integrationEvent: orderStatusChangedToPaid) {
        logger.info(`Integration event is getting consumed: event id: ${integrationEvent.eventId} and event name: ${integrationEvent.eventName}`);
        for await (const item of integrationEvent.orderItems) {
            const catalogItem = await catalog.findById(item.productId);
            catalogItem?.removeStock(item.quantity);
            await catalogItem?.save();       
       }
      
  }
}