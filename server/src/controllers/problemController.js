import Problem from '../models/Problem.js';
import Contest from '../models/Contest.js';
import { AppError } from '../middleware/errorHandler.js';

export const createProblem = async (req, res, next) => {
  try {
    const problemData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const problem = await Problem.create(problemData);

    // Add problem to contest
    await Contest.findByIdAndUpdate(req.body.contestId, {
      $push: { problems: problem._id },
    });

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: { problem },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Only creator or admin can update
    if (problem.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this problem', 403);
    }

    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: { problem: updatedProblem },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Only creator or admin can delete
    if (problem.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this problem', 403);
    }

    // Remove from contest
    await Contest.findByIdAndUpdate(problem.contestId, {
      $pull: { problems: problem._id },
    });

    await Problem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemsByContest = async (req, res, next) => {
  try {
    const { contestId } = req.params;

    const problems = await Problem.find({ contestId })
      .select('-testCases') // Hide test cases initially
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: { problems },
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .select('-testCases.expectedOutput'); // Hide expected outputs

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Only show sample test cases to participants
    const sampleTestCases = problem.testCases?.filter((tc) => tc.isSample) || [];

    const problemData = problem.toObject();
    problemData.sampleTestCases = sampleTestCases;
    delete problemData.testCases;

    res.status(200).json({
      success: true,
      data: { problem: problemData },
    });
  } catch (error) {
    next(error);
  }
};
