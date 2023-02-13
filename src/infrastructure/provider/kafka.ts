import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'
import { Kafka, Producer, Message } from 'kafkajs'
import logger from './logger'
import environment from './env'
import axios from 'axios'

class KafkaProvider {
  private kafkaInstance: Kafka
  private Producer: Producer
  private schemaRegistry: SchemaRegistry

  /**
   *
   */
  constructor() {
    this.schemaRegistry = new SchemaRegistry({
      host: environment.config().schemaRegistryUrl,
    })
    this.kafkaInstance = new Kafka({
      clientId: 'rentIt-Catalog',
      brokers: ['localhost:9092'],
      // brokers: async () => {
      //     // Example getting brokers from Confluent REST Proxy
      //     const clusterResponse = await fetch('http://0.0.0.0:8082/v3/clusters', {
      //         headers: { 'Content-Type': 'application/json' },
      //     }).then(response => response.json())
      //         .catch(err => logger.error("Error getting cluster information", err));

      //     const clusterUrl = clusterResponse.data[0].links.self
      //     const brokersResponse = await fetch(`${clusterUrl}/brokers`, {
      //         headers: { 'Content-Type': 'application/json' },
      //     }).then(response => response.json())
      //         .catch(err => logger.error("Error getting broker information", err))

      //     const brokers = brokersResponse.data.map((broker: { attributes: { host: any; port: any; }; }) => {
      //         const { host, port } = broker.attributes
      //         return `${host}:${port}`
      //     })
      //     return brokers
      // }
    })
    this.Producer = this.kafkaInstance.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    })
  }

  public async Send(message: Message[], topic: string): Promise<void> {
    await this.Producer.connect()
    await this.Producer.send({ topic: topic, messages: message })
    await this.Producer.disconnect()
  }

  async CreateKafkaTopicAndRegisterSchema(
    key: any,
    schema: any,
    topic: string
  ) {
    const requestValSchema = {
      url: `${
        environment.config().schemaRegistryUrl
      }/subjects/${topic}/versions`,
      method: 'post',
      headers: {
        Accept:
          'application/vnd.schemaregistry.v1+json, application/vnd.schemaregistry+json, application/json',
      },
      data: { schema: JSON.stringify(schema) },
    }
    try {
      await axios(requestValSchema)
    } catch (error) {
      logger.error('Error while registering the schema', { error })
    }
  }
}

export default new KafkaProvider()
