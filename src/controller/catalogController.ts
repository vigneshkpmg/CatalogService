import express from 'express'
import logger from '../infrastructure/provider/logger'
import { catalog } from '../model/catalog'
import redis from '../infrastructure/provider/redis'
import productPricechanged from '../integrationEvents/events/productPriceChanged'
import integrationEventService from '../integrationEvents/service/integrationEventService'

class catalogController {
  public async getcatalogItems(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      let catalogList = await redis.getCachedData()
      if (!catalogList) {
        catalogList = await catalog.find({})
        await redis.setCacheData(catalogList)
      }
      res.status(200).send({ data: catalogList })
    } catch (error) {
      logger.error('Error while fetching list of catalog',{error})
      res.status(500).send('Internal server error !')
    }
  }

  public async getCatalogItemById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const id = req.params.id
      let catalogData = await redis.getCachedData(id)
      if (!catalogData) {
        catalogData = await catalog.findById(id)
        await redis.setCacheData(catalogData, id)
      }
      res.status(200).send({ data: catalogData })
    } catch (error) {
      logger.error('Error while fetching catalog by id', { error })
      res.status(500).send('Internal server error !')
    }
  }

  public async createCatalogItem(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const catalogInstance = new catalog({
        title: req.body.title,
        availabilityStartDate: req.body.availabilityStartDate,
        description: req.body.description,
        sellerReferenceId: req.body.sellerReferenceId,
        equipmentRentPrice: req.body.equipmentRentPrice,
        catalogType: req.body.catalogType,
        isOperatorAvailable: req.body.isOperatorAvailable,
        operatorPrice: req.body.operatorPrice,
        additionalDetails: req.body.additionalDetails,
        mediaContainer: req.body.mediaContainer,
        quantity: req.body.quantity,
        operatorCount: req.body.operatorCount,
      })

      const result = await catalogInstance.save()
      await redis.deleteCacheData()
      res.status(201).send(result)
    } catch (error) {
      logger.error('Error while saving catalog', { error })
      res.status(500).send('Internal server error!')
    }
  }

  public async updateCatalogItemById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const id = req.params.id
      await catalog.findByIdAndUpdate(id, req.body, { overwrite: true })
      await redis.deleteCacheData(id)
      res.status(200).send()
    } catch (error) {
      logger.error('Error while updating catalog by id', { error })
      res.status(500).send('Internal server error !')
    }
  }

  public async deleteCatalogItemById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const result = await catalog.findByIdAndDelete(req.params.id)
      await redis.deleteCacheData(req.params.id)
      res.status(204).send(result)
    } catch (error) {
      logger.error('Error while deleting catalog by id', { error })
      res.status(500).send('Internal server error !')
    }
  }

  public async updateCatalogItem(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const id = req.params.id
      const request = req.body
      const catalogItem = await catalog.findById(id)
      const isPriceChangeEventToBeRaised =
        catalogItem &&
        catalogItem?.equipmentRentPrice != request?.equipmentRentPrice
      if (isPriceChangeEventToBeRaised) {
        const productPricechangedevent = new productPricechanged(
          catalogItem.id,
          catalogItem.equipmentRentPrice,
          request?.equipmentRentPrice
        )
        await integrationEventService.saveEventAndCatalog(
          productPricechangedevent,
          { id: id, request: request }
        )
        await integrationEventService.publisheEvent(productPricechangedevent)
      } else {
        await catalog.findByIdAndUpdate(id, request)
      }

      await redis.deleteCacheData(id)
      res.status(200).send()
    } catch (error:any) {
      logger.error('Error while patching catalog by id', { error })
      res.status(500).send('Internal server error !')
    }
  }
}

export default new catalogController()
