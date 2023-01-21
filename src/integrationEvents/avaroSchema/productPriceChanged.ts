export const productPriceChangedEventSchema = {
  namespace: 'RentItCatalogService',
  doc: 'A event for product price change from catalog',
  type: 'record',
  name: 'ProductPriceChangedEvent',
  fields: [
    {
      name: 'eventId',
      type: 'string',
    },
    {
      name: 'eventName',
      type: 'string',
    },
    {
      name: 'eventDate',
      type: 'string',
    },
    {
      name: 'productId',
      type: 'string',
    },
    {
      name: 'oldPrice',
      type: 'double',
    },
    {
      name: 'newPrice',
      type: 'double',
    },
  ],
}
