import IIntegrationEvent from './integrationEvent'

class orderStockRejected extends IIntegrationEvent {
  public orderId: number
  /**
   *
   */
  constructor(id: number) {
    super('orderStockRejected')
    this.orderId = id
  }
}

class confirmedOrderStockItem {
  public orderItemId: number
  public hasStock: boolean
  /**
   *
   */
  constructor(orderId: number, hasStock: boolean) {
    this.hasStock = hasStock
    this.orderItemId = orderId
  }
}

export { orderStockRejected, confirmedOrderStockItem }
