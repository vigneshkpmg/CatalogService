/**
 * Define all your API web-routes
 */

import { Router } from 'express'

import catalog from '../controller/catalogController'
import validator from '../middleware/validator'

const catalogrouter = Router()

catalogrouter.get('/', catalog.getcatalogItems)
catalogrouter.get('/:id', catalog.getCatalogItemById)
catalogrouter.post(
  '/',
  validator.GetValidationRules(),
  validator.validate,
  catalog.createCatalogItem
)
catalogrouter.put('/:id', catalog.updateCatalogItemById)
catalogrouter.delete('/:id', catalog.deleteCatalogItemById)
catalogrouter.patch('/:id', catalog.updateCatalogItem)
export default catalogrouter
