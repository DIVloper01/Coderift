import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isSample: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 1,
  },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    constraints: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    testCases: [testCaseSchema],
    limits: {
      timeLimit: {
        type: Number, // in seconds
        default: 2,
        min: 0.1,
        max: 10,
      },
      memoryLimit: {
        type: Number, // in MB
        default: 256,
        min: 64,
        max: 1024,
      },
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stats: {
      totalSubmissions: {
        type: Number,
        default: 0,
      },
      acceptedSubmissions: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
problemSchema.index({ contestId: 1, order: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

// Virtual for acceptance rate
problemSchema.virtual('acceptanceRate').get(function () {
  if (this.stats.totalSubmissions === 0) return 0;
  return ((this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100).toFixed(2);
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
