import { models, model, Schema } from 'mongoose';

const schema = new Schema(
  {
    pt_br: {
      type: String,
      required: true,
    },
    en_us: {
      type: String,
      required: false,
    },
    page: { type: Schema.Types.ObjectId, ref: 'Page' },
  },
  { timestamps: true }
);

export default models.Text || model('Text', schema);
