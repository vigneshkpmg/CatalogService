import logger from '../infrastructure/provider/logger'
import { BlobServiceClient } from '@azure/storage-blob'
import environment from '../infrastructure/provider/env'
import { streamToBuffer } from '../utils/stream'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

class mediaController {
  public async saveMedia(req: any, res: any): Promise<any> {
    try {
      const containerName = `rentitmedia-image-${uuidv4()}`
      const AZURE_STORAGE_CONNECTION_STRING =
        environment.config().azureStorageConnectionString
      if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found')
      }

      // Create the BlobServiceClient object with connection string
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      )

      // Get a reference to a container
      const containerClient =
        blobServiceClient.getContainerClient(containerName)
      // Create the container
      const createContainerResponse = await containerClient.createIfNotExists()
      logger.info(
        `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
      )

      const results: any = []
      await Promise.all(
        req.files.map(async (file: any) => {
          // Get a block blob client
          const blockBlobClient = containerClient.getBlockBlobClient(
            file.originalname
          )
          // Display blob name and url
          logger.info(
            `\nUploading to Azure storage as blob\n\tname: ${file.originalname}:\n\tURL: ${blockBlobClient.url}`
          )
          results.push(blockBlobClient.url)
          await blockBlobClient.uploadFile(file.path)
        })
      )
      return res
        .status(201)
        .send({ data: { file: results }, container: containerName })
    } catch (error) {
      logger.error('Error while saving media', { error })
      return res.status(500).send('Internal server error !')
    }
  }

  public async GetMeadia(req: any, res: any) {
    const containerName = req.params.containerName
    try {
      const AZURE_STORAGE_CONNECTION_STRING =
        environment.config().azureStorageConnectionString
      if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found')
      }

      // Create the BlobServiceClient object with connection string
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      )

      // Get a reference to a container
      const containerClient =
        blobServiceClient.getContainerClient(containerName)
      const blobList = containerClient
        .listBlobsFlat()
        .byPage({ maxPageSize: 5 })
      const results: string[] = []
      for await (const blob of blobList) {
        for (const item of blob.segment.blobItems) {
          const blockBlobClient = containerClient.getBlockBlobClient(item.name)
          const downloadBlockBlobResponse = await blockBlobClient.download()
          results.push(
            (
              await streamToBuffer(
                downloadBlockBlobResponse.readableStreamBody!
              )
            ).toString('base64')
          )
          await mediaController.removeUplodedFile(item.name)
        }
      }
      return res.status(200).send({ data: { value: results } })
    } catch (error) {
      logger.error('Error while saving media', { error })
      return res.status(500).send('Internal server error !')
    }
  }
  /**
   * name
   */
  private static async removeUplodedFile(filename: string) {
    fs.unlink(`./uploads/${filename}`, err => {
      if (err) {
        logger.error('Error while deleting a file locally', { err })
      }
      logger.info(`./uploads/${filename} got deleted`)
    })
  }
}

export default new mediaController()
