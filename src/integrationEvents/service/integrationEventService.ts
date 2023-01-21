import logger from "../../infrastructure/provider/logger";
import IIntegrationEvent from "../events/integrationEvent";
import IIntegrationEventService from "./IIntegrationEventService";
import { integrationEventEntry, eventState } from "../../model/event"
import { mongoose } from "../../infrastructure/provider/database";
import { catalog } from "../../model/catalog";
import kafka from "../../infrastructure/provider/kafka";
import { Message } from "kafkajs";


class integrationEventService implements IIntegrationEventService{
    async saveEventAndCatalog(integrationEvent: IIntegrationEvent, catalogRequest:any): Promise<void> {
        logger.info(`Integration event and catalog is getting stored in DB: event id: ${integrationEvent.eventId} and event name: ${integrationEvent.eventName}`);
        const newIntegrationEvent = new integrationEventEntry({
            eventName: integrationEvent.eventName,
            eventdate: integrationEvent.eventDate,
            eventState: eventState.NotPublished,
            content: integrationEvent,
            eventId: integrationEvent.eventId
        });
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const catalogCol =await integrationEventEntry.createCollection();
                const eventCol =await catalog.createCollection();
                // Important:: You must pass the session to the operations
                await eventCol.insertOne(newIntegrationEvent, { session });
                await catalogCol.updateOne(catalogRequest.id, catalogRequest.request, {session:session, upsert: true });
            }, {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            });
        }
        catch (err) {
            logger.error("error from saveEventAndCatalog method ", err);
        }
        finally {
            session.endSession();
            logger.error("Mongo transaction session ended.");
        }
      
    }

    async publisheEvent(integrationEvent: IIntegrationEvent): Promise<void>{
        logger.info(`Integration event is getting published: event id: ${integrationEvent.eventId} and event name: ${integrationEvent.eventName}`);
        //Need to create new collection and make entry saying Event publishing is inprogress
        const newIntegrationEvent = new integrationEventEntry({
            eventName: integrationEvent.eventName,
            eventdate: integrationEvent.eventDate,
            eventState: eventState.inprogress,
            content: integrationEvent,
            eventId: integrationEvent.eventId
        });
        try {
            await integrationEventEntry.findOneAndUpdate({ eventId: newIntegrationEvent.eventId }, newIntegrationEvent);
            //And publish event to event bus
            const messages: Message[] = [];
            messages.push({ key: "eventId", value: JSON.stringify(integrationEvent) });
            await kafka.Send(messages, integrationEvent.eventName);
            //Make event status to published from in progress.
            newIntegrationEvent.eventState = eventState[eventState.published];
            await integrationEventEntry.findOneAndUpdate({ eventId: newIntegrationEvent.eventId }, newIntegrationEvent);
        }
        catch (err)
        {
             logger.error("error from publisheEvent In IIntegrationEventService ", err);
        }

    }

}

export default new integrationEventService();