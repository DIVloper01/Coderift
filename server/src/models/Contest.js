import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Contest title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Contest description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'ended'],
      default: 'upcoming',
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      duration: {
        type: Number, // in minutes
        required: true,
      },
      penaltyTime: {
        type: Number, // in minutes per wrong submission
        default: 10,
      },
      maxParticipants: {
        type: Number,
        default: null, // null means unlimited
      },
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
    rules: {
      type: String,
      default: 'Standard ICPC rules apply.',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
contestSchema.index({ status: 1, startTime: -1 });
contestSchema.index({ createdBy: 1 });

// Virtual for duration calculation
contestSchema.virtual('durationMinutes').get(function () {
  return Math.floor((this.endTime - this.startTime) / (1000 * 60));
});

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
