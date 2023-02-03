import { Schema } from 'mongoose'
import { mongoose } from '../infrastructure/provider/database'
import IIntegrationEvent from '../integrationEvents/events/integrationEvent'

enum eventState {
  NotPublished,
  inprogress,
  published,
  FailedToPublish,
}
const eventSchema = new Schema<IntegrationEventEntry>({
  content: Schema.Types.Mixed,
  eventName: { type: String, required: [true, 'Required'] },
  eventdate: { type: Date, default: new Date() },
  eventState: { type: String, enum: eventState },
  attmeptedCount: { type: Number, default: 0 },
  eventId: { type: String, required: [true, 'Required'] },
})
class IntegrationEventEntry {
  public eventName: string
  public eventdate: Date
  public content: IIntegrationEvent
  public eventState: string
  public attmeptedCount: number
  public eventId: string
  /**
   *
   */
  constructor(
    eventId: string,
    state: string = eventState.NotPublished.toString(),
    eventDetail: IIntegrationEvent,
    count = 0
  ) {
    this.eventName = eventDetail.eventName
    this.eventdate = eventDetail.eventDate
    this.eventState = state
    this.attmeptedCount = count
    this.content = eventDetail
    this.eventId = eventId
  }
}

const integrationEventEntry = mongoose.model<IntegrationEventEntry>(
  'IntegrationEventEntry',
  eventSchema
)
export { integrationEventEntry, eventState }
