import { v4 as uuidv4 } from 'uuid'
export default class IIntegrationEvent {
  eventName: string
  eventId: string
  eventDate: Date

  /**
   *
   */
  constructor(name: string) {
    this.eventName = name
    this.eventId = uuidv4()
    this.eventDate = new Date()
  }
}
