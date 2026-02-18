import cron from 'node-cron';
import Contest from '../models/Contest.js';

export const startContestStateManager = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Update upcoming contests to live
      const upcomingContests = await Contest.find({
        status: 'upcoming',
        startTime: { $lte: now },
      });

      for (const contest of upcomingContests) {
        contest.status = 'live';
        await contest.save();
        
        console.log(`📢 Contest "${contest.title}" is now LIVE`);
        
        // Emit Socket.io event
        const io = global.io;
        if (io) {
          io.to(`contest-${contest._id}`).emit('contestStatusChange', {
            contestId: contest._id,
            status: 'live',
          });
        }
      }

      // Update live contests to ended
      const liveContests = await Contest.find({
        status: 'live',
        endTime: { $lte: now },
      });

      for (const contest of liveContests) {
        contest.status = 'ended';
        await contest.save();
        
        console.log(`🏁 Contest "${contest.title}" has ENDED`);
        
        // Emit Socket.io event
        const io = global.io;
        if (io) {
          io.to(`contest-${contest._id}`).emit('contestStatusChange', {
            contestId: contest._id,
            status: 'ended',
          });
        }
      }
    } catch (error) {
      console.error('Contest state manager error:', error);
    }
  });

  console.log('⏰ Contest state manager started');
};
