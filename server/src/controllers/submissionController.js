import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import Contest from '../models/Contest.js';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import judgeService, { LANGUAGE_IDS } from '../services/judgeService.js';
import { AppError } from '../middleware/errorHandler.js';

export const submitCode = async (req, res, next) => {
  try {
    const { problemId, contestId, code, language } = req.body;

    // Verify problem and contest exist
    const problem = await Problem.findById(problemId);
    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    // Check if contest is live
    if (contest.status !== 'live') {
      throw new AppError('Contest is not live', 400);
    }

    // Check if user has joined the contest
    const hasJoined = contest.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!hasJoined) {
      throw new AppError('You must join the contest first', 400);
    }

    // Get language ID
    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      throw new AppError('Unsupported language', 400);
    }

    // Create submission record
    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      contestId,
      code,
      language,
      languageId,
      status: 'processing',
    });

    // Execute test cases asynchronously
    executeTestCases(submission._id, problem, code, languageId);

    res.status(201).json({
      success: true,
      message: 'Code submitted successfully',
      data: { submissionId: submission._id },
    });
  } catch (error) {
    next(error);
  }
};

// Async function to execute test cases
async function executeTestCases(submissionId, problem, code, languageId) {
  try {
    const submission = await Submission.findById(submissionId);
    
    const testResults = await judgeService.executeTestCases(
      code,
      languageId,
      problem.testCases,
      problem.limits.timeLimit,
      problem.limits.memoryLimit
    );

    const verdict = judgeService.determineVerdict(testResults);
    const allPassed = testResults.every((r) => r.passed);

    // Calculate execution stats
    const maxExecutionTime = Math.max(...testResults.map((r) => r.executionTime || 0));
    const maxMemory = Math.max(...testResults.map((r) => r.memory || 0));

    // Update submission
    submission.status = 'completed';
    submission.verdict = verdict;
    submission.testResults = testResults;
    submission.executionTime = maxExecutionTime;
    submission.memory = maxMemory;
    submission.points = allPassed ? problem.points : 0;
    await submission.save();

    // Update problem stats
    problem.stats.totalSubmissions += 1;
    if (verdict === 'Accepted') {
      problem.stats.acceptedSubmissions += 1;
    }
    await problem.save();

    // Update user stats
    await User.findByIdAndUpdate(submission.userId, {
      $inc: { 'stats.totalSubmissions': 1 },
    });

    // Update leaderboard
    await updateLeaderboard(submission, problem, allPassed);

    // Emit Socket.io event for real-time update
    const io = global.io;
    if (io) {
      io.to(`contest-${submission.contestId}`).emit('submissionUpdate', {
        submissionId: submission._id,
        userId: submission.userId,
        problemId: submission.problemId,
        verdict: submission.verdict,
      });
    }
  } catch (error) {
    console.error('Test execution error:', error);
    await Submission.findByIdAndUpdate(submissionId, {
      status: 'error',
      verdict: 'Internal Error',
    });
  }
}

async function updateLeaderboard(submission, problem, solved) {
  try {
    let leaderboard = await Leaderboard.findOne({
      contestId: submission.contestId,
      userId: submission.userId,
    });

    if (!leaderboard) {
      leaderboard = await Leaderboard.create({
        contestId: submission.contestId,
        userId: submission.userId,
        submissions: [],
      });
    }

    // Find or create problem submission entry
    let problemSubmission = leaderboard.submissions.find(
      (s) => s.problemId.toString() === submission.problemId.toString()
    );

    if (!problemSubmission) {
      problemSubmission = {
        problemId: submission.problemId,
        attempts: 0,
        solved: false,
        solvedAt: null,
        points: 0,
      };
      leaderboard.submissions.push(problemSubmission);
    }

    problemSubmission.attempts += 1;

    // If solved for the first time
    if (solved && !problemSubmission.solved) {
      problemSubmission.solved = true;
      problemSubmission.solvedAt = submission.submittedAt;
      problemSubmission.points = problem.points;

      leaderboard.problemsSolved += 1;
      leaderboard.totalPoints += problem.points;
      leaderboard.lastSubmissionTime = submission.submittedAt;

      // Calculate penalty time (wrong attempts * penalty)
      const contest = await Contest.findById(submission.contestId);
      const wrongAttempts = problemSubmission.attempts - 1;
      leaderboard.penaltyTime += wrongAttempts * (contest.settings.penaltyTime || 10);

      // Update user stats
      await User.findByIdAndUpdate(submission.userId, {
        $inc: { 'stats.problemsSolved': 1 },
      });
    }

    await leaderboard.save();

    // Recalculate ranks
    await recalculateRanks(submission.contestId);
  } catch (error) {
    console.error('Leaderboard update error:', error);
  }
}

async function recalculateRanks(contestId) {
  const leaderboards = await Leaderboard.find({ contestId })
    .sort({ problemsSolved: -1, penaltyTime: 1, lastSubmissionTime: 1 })
    .populate('userId', 'username');

  for (let i = 0; i < leaderboards.length; i++) {
    leaderboards[i].rank = i + 1;
    await leaderboards[i].save();
  }

  // Emit real-time leaderboard update
  const io = global.io;
  if (io) {
    io.to(`contest-${contestId}`).emit('leaderboardUpdate', {
      leaderboard: leaderboards,
    });
  }
}

export const getSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate('problemId', 'title')
      .populate('userId', 'username');

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubmissions = async (req, res, next) => {
  try {
    const { contestId, problemId } = req.query;

    const query = { userId: req.user._id };
    if (contestId) query.contestId = contestId;
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .populate('problemId', 'title')
      .sort({ submittedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: { submissions },
    });
  } catch (error) {
    next(error);
  }
};

export const getContestLeaderboard = async (req, res, next) => {
  try {
    const { contestId } = req.params;

    const leaderboard = await Leaderboard.find({ contestId })
      .populate('userId', 'username profile.avatar')
      .sort({ rank: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: { leaderboard },
    });
  } catch (error) {
    next(error);
  }
};
