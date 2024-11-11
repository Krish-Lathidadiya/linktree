import mongoose, { Document, Schema } from "mongoose";

interface IEvent extends Document {
  type: string;
  uri: string;
}

const EventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
    }, // Possible values: 'click' or 'view'
    uri: {
      type: String,
    },
  },
  { timestamps: true }
);

// Corrected line with lowercase 'models'
const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
