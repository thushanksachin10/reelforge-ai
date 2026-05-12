import mongoose from 'mongoose'

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    folderName: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true
    }
  },
  { timestamps: true }
)

const Folder = mongoose.model('Folder', folderSchema)
export default Folder