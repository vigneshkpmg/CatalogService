import IIntegrationEvent from '../events/integrationEvent'

export default interface IIntegrationEventHandler<
  Type extends IIntegrationEvent
> {
  Handle(integrationEvent: Type): Promise<void>
}
