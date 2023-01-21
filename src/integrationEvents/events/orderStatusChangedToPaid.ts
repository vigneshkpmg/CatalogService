import IIntegrationEvent from './integrationEvent'
import { orderStockItem } from './orderStatusChangedToPendingValidation'

export default class orderStatusChangedToPaid extends IIntegrationEvent {
  public orderId: number
  public orderItems: orderStockItem[]

  /**
   *
   */
  constructor(id: number, items: orderStockItem[]) {
    super('orderStatusChangedToPaid')
    this.orderId = id
    this.orderItems = items
  }
}
