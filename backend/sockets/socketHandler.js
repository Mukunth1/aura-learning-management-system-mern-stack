export const initSocket = (io) => {
  // Store room active viewer counts
  const roomViewers = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join lesson room for real-time discussions & presence
    socket.on('join_lesson', ({ lessonId, user }) => {
      socket.join(`lesson_${lessonId}`);
      console.log(`[Socket.io] User ${user?.name || socket.id} joined lesson room: lesson_${lessonId}`);

      const currentCount = (roomViewers.get(lessonId) || 0) + 1;
      roomViewers.set(lessonId, currentCount);

      // Broadcast active viewers in this lesson
      io.to(`lesson_${lessonId}`).emit('lesson_viewer_update', { count: currentCount });
    });

    // Leave lesson room
    socket.on('leave_lesson', ({ lessonId }) => {
      socket.leave(`lesson_${lessonId}`);
      const currentCount = Math.max(0, (roomViewers.get(lessonId) || 1) - 1);
      roomViewers.set(lessonId, currentCount);
      io.to(`lesson_${lessonId}`).emit('lesson_viewer_update', { count: currentCount });
    });

    // Send new discussion message to room
    socket.on('send_discussion_message', (data) => {
      // data: { lessonId, discussion }
      io.to(`lesson_${data.lessonId}`).emit('receive_discussion_message', data.discussion);
    });

    // Send new discussion reply to room
    socket.on('send_discussion_reply', (data) => {
      // data: { lessonId, discussionId, reply, discussion }
      io.to(`lesson_${data.lessonId}`).emit('receive_discussion_reply', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
