import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'participant').default('participant'),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createContest: Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(2000).required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
    settings: Joi.object({
      duration: Joi.number().min(1).required(),
      penaltyTime: Joi.number().min(0).default(10),
      maxParticipants: Joi.number().min(1).allow(null).default(null),
      isPublic: Joi.boolean().default(true),
    }),
    rules: Joi.string().max(1000).optional(),
  }),

  createProblem: Joi.object({
    title: Joi.string().max(150).required(),
    description: Joi.string().required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
    tags: Joi.array().items(Joi.string()).default([]),
    constraints: Joi.string().required(),
    inputFormat: Joi.string().required(),
    outputFormat: Joi.string().required(),
    testCases: Joi.array().items(
      Joi.object({
        input: Joi.string().required(),
        expectedOutput: Joi.string().required(),
        isSample: Joi.boolean().default(false),
        points: Joi.number().min(1).default(1),
      })
    ).min(1).required(),
    limits: Joi.object({
      timeLimit: Joi.number().min(0.1).max(10).default(2),
      memoryLimit: Joi.number().min(64).max(1024).default(256),
    }),
    contestId: Joi.string().required(),
    order: Joi.number().min(0).default(0),
    points: Joi.number().min(1).default(100),
  }),

  submitCode: Joi.object({
    problemId: Joi.string().required(),
    contestId: Joi.string().required(),
    code: Joi.string().required(),
    language: Joi.string().valid('cpp', 'java', 'python', 'javascript', 'c', 'go', 'rust').required(),
  }),
};
