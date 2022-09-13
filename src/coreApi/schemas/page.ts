import { models, model, Schema } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

export default models.Page || model('Page', schema);
