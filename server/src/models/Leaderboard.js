import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    penaltyTime: {
      type: Number, // in minutes
      default: 0,
    },
    lastSubmissionTime: {
      type: Date,
      default: null,
    },
    rank: {
      type: Number,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    submissions: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Problem',
        },
        attempts: {
          type: Number,
          default: 0,
        },
        solved: {
          type: Boolean,
          default: false,
        },
        solvedAt: {
          type: Date,
          default: null,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index to ensure one entry per user per contest
leaderboardSchema.index({ contestId: 1, userId: 1 }, { unique: true });

// Index for efficient ranking queries
leaderboardSchema.index({ 
  contestId: 1, 
  problemsSolved: -1, 
  penaltyTime: 1, 
  lastSubmissionTime: 1 
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
