import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, CornerDownRight, ThumbsUp } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function RealtimeDiscussion({ lessonId, courseId }) {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [discussions, setDiscussions] = useState([]);
  const [activeViewers, setActiveViewers] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial discussions from API
  useEffect(() => {
    if (!lessonId) return;

    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/discussions/lesson/${lessonId}`);
        if (res.data.success) {
          setDiscussions(res.data.discussions);
        }
      } catch (err) {
        console.error('Failed to load discussions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [lessonId]);

  // Socket.io room connection and real-time event listeners
  useEffect(() => {
    if (!socket || !lessonId) return;

    // Join room
    socket.emit('join_lesson', { lessonId, user });

    // Listen for viewer count
    socket.on('lesson_viewer_update', ({ count }) => {
      setActiveViewers(count);
    });

    // Listen for new incoming discussions
    socket.on('receive_discussion_message', (discussion) => {
      setDiscussions((prev) => [discussion, ...prev]);
    });

    // Listen for incoming replies
    socket.on('receive_discussion_reply', ({ discussionId, reply, discussion }) => {
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? discussion : d))
      );
    });

    return () => {
      socket.emit('leave_lesson', { lessonId });
      socket.off('lesson_viewer_update');
      socket.off('receive_discussion_message');
      socket.off('receive_discussion_reply');
    };
  }, [socket, lessonId, user]);

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !lessonId) return;

    try {
      const res = await api.post(`/discussions/lesson/${lessonId}`, {
        courseId,
        message: newMessage.trim(),
      });

      if (res.data.success) {
        const createdDiscussion = res.data.discussion;
        setDiscussions((prev) => [createdDiscussion, ...prev]);
        setNewMessage('');

        // Broadcast to other peers via Socket.io
        if (socket) {
          socket.emit('send_discussion_message', {
            lessonId,
            discussion: createdDiscussion,
          });
        }
      }
    } catch (err) {
      console.error('Failed to post discussion message:', err);
    }
  };

  const handlePostReply = async (discussionId) => {
    const text = replyTextMap[discussionId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post(`/discussions/${discussionId}/reply`, {
        message: text.trim(),
      });

      if (res.data.success) {
        const updated = res.data.discussion;
        setDiscussions((prev) =>
          prev.map((d) => (d._id === discussionId ? updated : d))
        );
        setReplyTextMap((prev) => ({ ...prev, [discussionId]: '' }));
        setActiveReplyId(null);

        // Broadcast via Socket.io
        if (socket) {
          socket.emit('send_discussion_reply', {
            lessonId,
            discussionId,
            discussion: updated,
          });
        }
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with live presence indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-500" />
            Live Q&A & Discussion Thread
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask questions, exchange insights, and get instant answers from peers and instructors.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Users className="w-3.5 h-3.5" />
          <span>{activeViewers} studying now</span>
        </div>
      </div>

      {/* Post new question */}
      <form onSubmit={handlePostMessage} className="flex gap-3">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-brand-500/20"
        />
        <div className="flex-1 relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Got a question or insight on this lesson? Ask here in real-time..."
            rows={2}
            className="w-full pl-4 pr-12 py-2.5 rounded-2xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none shadow-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-3 bottom-3 p-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-all shadow-md shadow-brand-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Thread list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading discussions...</div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No questions posted for this lesson yet.
            </p>
            <p className="text-[11px] text-slate-400">Be the first to start the discussion!</p>
          </div>
        ) : (
          discussions.map((d) => (
            <div
              key={d._id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-dark-850/60 space-y-3"
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={d.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={d.user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {d.user?.name || 'Anonymous Student'}
                      </span>
                      {d.user?.role === 'instructor' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-brand-500 text-white">
                          Instructor
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === d._id ? null : d._id)}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  {activeReplyId === d._id ? 'Cancel' : 'Reply'}
                </button>
              </div>

              {/* Message text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                {d.message}
              </p>

              {/* Nested Replies */}
              {d.replies && d.replies.length > 0 && (
                <div className="pl-9 space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {d.replies.map((reply, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-dark-900/60 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-2.5"
                    >
                      <img
                        src={reply.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={reply.user?.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {reply.user?.name}
                          </span>
                          {reply.user?.role === 'instructor' && (
                            <span className="px-1 py-0.2 rounded text-[9px] font-bold uppercase bg-indigo-500 text-white">
                              Instructor
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {activeReplyId === d._id && (
                <div className="pl-9 pt-2 flex gap-2">
                  <input
                    type="text"
                    value={replyTextMap[d._id] || ''}
                    onChange={(e) =>
                      setReplyTextMap({ ...replyTextMap, [d._id]: e.target.value })
                    }
                    placeholder="Write a helpful reply..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={() => handlePostReply(d._id)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
