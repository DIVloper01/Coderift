import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import { AppError } from '../middleware/errorHandler.js';

export const createContest = async (req, res, next) => {
  try {
    const contestData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const contest = await Contest.create(contestData);

    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      data: { contest },
    });
  } catch (error) {
    next(error);
  }
};

export const updateContest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findById(id);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    // Only creator or admin can update
    if (contest.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this contest', 403);
    }

    const updatedContest = await Contest.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Contest updated successfully',
      data: { contest: updatedContest },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findById(id);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    // Only creator or admin can delete
    if (contest.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this contest', 403);
    }

    await Contest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Contest deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const contests = await Contest.find(query)
      .populate('createdBy', 'username')
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        contests,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findById(id)
      .populate('createdBy', 'username email')
      .populate('problems');

    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { contest },
    });
  } catch (error) {
    next(error);
  }
};

export const joinContest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findById(id);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    // Check if contest is live or upcoming
    if (contest.status === 'ended') {
      throw new AppError('Cannot join an ended contest', 400);
    }

    // Check if already joined
    const alreadyJoined = contest.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      throw new AppError('Already joined this contest', 400);
    }

    // Check max participants
    if (contest.settings.maxParticipants && 
        contest.participants.length >= contest.settings.maxParticipants) {
      throw new AppError('Contest is full', 400);
    }

    contest.participants.push({ user: req.user._id });
    await contest.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the contest',
      data: { contest },
    });
  } catch (error) {
    next(error);
  }
};
