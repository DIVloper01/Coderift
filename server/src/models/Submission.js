import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp', 'java', 'python', 'javascript', 'c', 'go', 'rust'],
    },
    languageId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'error'],
      default: 'pending',
    },
    verdict: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Runtime Error',
        'Compilation Error',
        'Internal Error',
        'Pending',
      ],
      default: 'Pending',
    },
    executionTime: {
      type: Number, // in milliseconds
      default: null,
    },
    memory: {
      type: Number, // in KB
      default: null,
    },
    testResults: [
      {
        testCaseId: mongoose.Schema.Types.ObjectId,
        passed: Boolean,
        executionTime: Number,
        memory: Number,
        output: String,
        error: String,
      },
    ],
    judge0Token: {
      type: String,
      default: null,
    },
    points: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
submissionSchema.index({ contestId: 1, userId: 1, problemId: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ problemId: 1, verdict: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
