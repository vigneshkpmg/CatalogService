import IIntegrationEvent from '../events/integrationEvent'

export default interface IIntegrationEventService {
  publisheEvent(integrationEvent: IIntegrationEvent): Promise<void>
  saveEventAndCatalog(
    integrationEvent: IIntegrationEvent,
    catalog: any
  ): Promise<void>
}
