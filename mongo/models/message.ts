import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
  message: { type: Schema.Types.Mixed, required: true },
});

const Message = models.Message || model('Message', messageSchema);

export default Message;
