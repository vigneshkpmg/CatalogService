import IIntegrationEvent from './integrationEvent'

export default class productPricechanged extends IIntegrationEvent {
  private productId: number
  private oldPrice: number
  private newPrice: number
  constructor(id: number, oldPrice: number, newPrice: number) {
    super('productPricechanged')
    this.productId = id
    this.oldPrice = oldPrice
    this.newPrice = newPrice
  }
}
