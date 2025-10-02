// Storage utilities for Lovable (Supabase first, with localStorage fallback)
import { supabase, hasSupabaseConfig } from '@/lib/supabase';

export interface DiaryEntry {
  id: string;
  coupleId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  mood?: string;
  attachments: string[]; // base64 image strings
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Photo {
  id: string;
  coupleId: string;
  uploaderId: string;
  uploaderName: string;
  data: string; // base64
  caption: string;
  createdAt: string;
}

export interface DailyQuestion {
  id: string;
  coupleId: string;
  questionText: string;
  answerByA?: { text: string; timestamp: string };
  answerByB?: { text: string; timestamp: string };
  date: string;
}

export interface Reminder {
  id: string;
  coupleId: string;
  creatorId: string;
  title: string;
  datetime: string;
  repeatRules?: string;
  notificationChannels: string[];
  completed: boolean;
}

export interface InsecurityEntry {
  id: string;
  coupleId: string;
  authorId: string;
  authorName: string;
  title?: string;
  content: string;
  attachments: string[]; // base64 for images/voice
  urgency: 'low' | 'medium' | 'high';
  visibility: 'sealed' | 'immediate' | 'scheduled';
  unlockAt?: string;
  allowReplies: boolean;
  tags: string[];
  status: 'sealed' | 'opened' | 'responded' | 'archived';
  openedBy?: string;
  openedAt?: string;
  createdAt: string;
  replies: InsecurityReply[];
}

export interface InsecurityReply {
  id: string;
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface InsecurityAudit {
  id: string;
  insecurityId: string;
  action: 'created' | 'opened' | 'reminded' | 'deleted' | 'commented' | 'flagged';
  actorId: string;
  actorName: string;
  createdAt: string;
}

export interface SongBucketItem {
  id: string;
  coupleId: string;
  addedById: string;
  addedByName: string;
  spotifyUri: string;
  note: string;
  createdAt: string;
}

export interface GameSession {
  id: string;
  coupleId: string;
  title: string;
  url: string;
  roomLink?: string;
  playedAt: string;
  gameKey?: 'papergames' | 'tanggle' | 'skribbl' | 'other';
  winnerId?: string;
  participants: string[];
}

export interface ChatMessage {
  id: string;
  coupleId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

// Diary Storage
export const getDiaryEntries = async (coupleId: string): Promise<DiaryEntry[]> => {
  if (hasSupabaseConfig) {
    const { data, error } = await (supabase as any)
      .from('diary_entries')
      .select('*')
      .eq('couple_id', coupleId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      coupleId: d.couple_id,
      authorId: d.author_id,
      authorName: d.author_name,
      title: d.title,
      content: d.content,
      mood: d.mood || undefined,
      attachments: d.attachments || [],
      isPrivate: !!d.is_private,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      deletedAt: d.deleted_at || undefined,
    }));
  }
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  return entries.filter((e: DiaryEntry) => e.coupleId === coupleId && !e.deletedAt);
};

export const saveDiaryEntry = async (entry: DiaryEntry) => {
  if (hasSupabaseConfig) {
    const payload = {
      id: entry.id,
      couple_id: entry.coupleId,
      author_id: entry.authorId,
      author_name: entry.authorName,
      title: entry.title,
      content: entry.content,
      mood: entry.mood || null,
      attachments: entry.attachments || [],
      is_private: entry.isPrivate,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
      deleted_at: entry.deletedAt || null,
    };
    await (supabase as any).from('diary_entries').upsert(payload);
    return;
  }
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  const index = entries.findIndex((e: DiaryEntry) => e.id === entry.id);
  if (index !== -1) entries[index] = entry; else entries.push(entry);
  localStorage.setItem('lovable_diary_entries', JSON.stringify(entries));
};

export const deleteDiaryEntry = async (entryId: string) => {
  if (hasSupabaseConfig) {
    await (supabase as any)
      .from('diary_entries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', entryId);
    return;
  }
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  const index = entries.findIndex((e: DiaryEntry) => e.id === entryId);
  
  if (index !== -1) {
    entries[index].deletedAt = new Date().toISOString();
    localStorage.setItem('lovable_diary_entries', JSON.stringify(entries));
  }
};

// Photo Storage
export const getPhotos = async (coupleId: string): Promise<Photo[]> => {
  if (hasSupabaseConfig) {
    const { data, error } = await (supabase as any)
      .from('photos')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((p: any) => ({
      id: p.id,
      coupleId: p.couple_id,
      uploaderId: p.uploader_id,
      uploaderName: p.uploader_name,
      data: p.data,
      caption: p.caption,
      createdAt: p.created_at,
    }));
  }
  const photos = JSON.parse(localStorage.getItem('lovable_photos') || '[]');
  return photos.filter((p: Photo) => p.coupleId === coupleId);
};

export const savePhoto = async (photo: Photo) => {
  if (hasSupabaseConfig) {
    const payload = {
      id: photo.id,
      couple_id: photo.coupleId,
      uploader_id: photo.uploaderId,
      uploader_name: photo.uploaderName,
      data: photo.data,
      caption: photo.caption,
      created_at: photo.createdAt,
    };
    await (supabase as any).from('photos').upsert(payload);
    return;
  }
  const photos = JSON.parse(localStorage.getItem('lovable_photos') || '[]');
  photos.push(photo);
  localStorage.setItem('lovable_photos', JSON.stringify(photos));
};

// Daily Questions
const DAILY_QUESTIONS = [
  "What made you smile today?",
  "One small thing I did that you appreciated?",
  "What can I do tomorrow to make your day easier?",
  "A childhood memory you love?",
  "Something new you'd like us to try this month?",
  "A fear I can support you with?",
  "Your favorite scent that reminds you of me?",
  "What song should we play tonight?",
  "A tiny habit of mine you secretly love?",
  "What's your favorite way to spend time together?",
  "Something I said recently that made you feel loved?",
  "What adventure should we go on next?",
  "A dream you have for our future?",
  "What's something you're grateful for today?",
  "How can I support you better?",
  "What's a random fact about me you find interesting?",
  "What's your favorite memory of us?",
  "What makes you feel most connected to me?",
  "What's something new you learned this week?",
  "What's a goal you're working towards?",
  "What's your love language?",
  "What tradition should we start together?",
  "What's your favorite thing about our relationship?",
  "What's something that always makes you laugh?",
  "What's a quality you admire in me?",
  "What's your ideal date night?",
  "What's a compliment you wish you heard more often?",
  "What's something you want to learn together?",
  "What's your favorite season and why?",
  "What's a small gesture that means a lot to you?"
];

export const getTodayQuestion = async (coupleId: string): Promise<DailyQuestion> => {
  const today = new Date().toISOString().split('T')[0];
  if (hasSupabaseConfig) {
    const { data: found } = await (supabase as any)
      .from('daily_questions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('date', today)
      .limit(1);
    let q = found && found[0];
    if (!q) {
      const dayIndex = Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % DAILY_QUESTIONS.length);
      const toInsert = {
        id: crypto.randomUUID(),
        couple_id: coupleId,
        question_text: DAILY_QUESTIONS[dayIndex],
        date: today,
        created_at: new Date().toISOString(),
      };
      const { data: inserted } = await (supabase as any)
        .from('daily_questions')
        .insert(toInsert)
        .select('*')
        .limit(1);
      q = inserted && inserted[0];
    }
    return {
      id: q.id,
      coupleId: q.couple_id,
      questionText: q.question_text,
      answerByA: q.answer_by_a || undefined,
      answerByB: q.answer_by_b || undefined,
      date: q.date,
    };
  }
  const questions = JSON.parse(localStorage.getItem('lovable_daily_questions') || '[]');
  let todayQuestion = questions.find((q: DailyQuestion) => q.coupleId === coupleId && q.date === today);
  if (!todayQuestion) {
    const dayIndex = Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % DAILY_QUESTIONS.length);
    todayQuestion = { id: crypto.randomUUID(), coupleId, questionText: DAILY_QUESTIONS[dayIndex], date: today };
    questions.push(todayQuestion);
    localStorage.setItem('lovable_daily_questions', JSON.stringify(questions));
  }
  return todayQuestion;
};

export const answerDailyQuestion = async (questionId: string, userId: string, answer: string, isPartnerA: boolean) => {
  if (hasSupabaseConfig) {
    const { data: rows } = await (supabase as any)
      .from('daily_questions')
      .select('answer_by_a,answer_by_b')
      .eq('id', questionId)
      .limit(1);
    const current = rows && rows[0];
    const answerData = { text: answer, timestamp: new Date().toISOString(), userId };
    const update: any = isPartnerA ? { answer_by_a: answerData } : { answer_by_b: answerData };
    await (supabase as any)
      .from('daily_questions')
      .update(update)
      .eq('id', questionId);
    return;
  }
  const questions = JSON.parse(localStorage.getItem('lovable_daily_questions') || '[]');
  const index = questions.findIndex((q: DailyQuestion) => q.id === questionId);
  if (index !== -1) {
    const answerData = { text: answer, timestamp: new Date().toISOString() };
    if (isPartnerA) questions[index].answerByA = answerData; else questions[index].answerByB = answerData;
    localStorage.setItem('lovable_daily_questions', JSON.stringify(questions));
  }
};

// Reminders
export const getReminders = async (coupleId: string): Promise<Reminder[]> => {
  if (hasSupabaseConfig) {
    const { data } = await (supabase as any)
      .from('reminders')
      .select('*')
      .eq('couple_id', coupleId)
      .order('datetime', { ascending: true });
    return (data || []).map((r: any) => ({
      id: r.id,
      coupleId: r.couple_id,
      creatorId: r.creator_id,
      title: r.title,
      datetime: r.datetime,
      repeatRules: r.repeat_rules || undefined,
      notificationChannels: r.notification_channels || [],
      completed: !!r.completed,
    }));
  }
  const reminders = JSON.parse(localStorage.getItem('lovable_reminders') || '[]');
  return reminders.filter((r: Reminder) => r.coupleId === coupleId);
};

export const saveReminder = async (reminder: Reminder) => {
  if (hasSupabaseConfig) {
    const payload = {
      id: reminder.id,
      couple_id: reminder.coupleId,
      creator_id: reminder.creatorId,
      title: reminder.title,
      datetime: reminder.datetime,
      repeat_rules: reminder.repeatRules || null,
      notification_channels: reminder.notificationChannels || [],
      completed: reminder.completed,
      created_at: new Date().toISOString(),
    };
    await (supabase as any).from('reminders').upsert(payload);
    return;
  }
  const reminders = JSON.parse(localStorage.getItem('lovable_reminders') || '[]');
  const index = reminders.findIndex((r: Reminder) => r.id === reminder.id);
  
  if (index !== -1) {
    reminders[index] = reminder;
  } else {
    reminders.push(reminder);
  }
  
  localStorage.setItem('lovable_reminders', JSON.stringify(reminders));
};

// Insecurity Vault
export const getInsecurities = async (coupleId: string): Promise<InsecurityEntry[]> => {
  if (hasSupabaseConfig) {
    const { data } = await (supabase as any)
      .from('insecurities')
      .select('*')
      .eq('couple_id', coupleId)
      .neq('status', 'archived')
      .order('created_at', { ascending: false });
    return (data || []).map((e: any) => ({
      id: e.id,
      coupleId: e.couple_id,
      authorId: e.author_id,
      authorName: e.author_name,
      title: e.title || undefined,
      content: e.content,
      attachments: e.attachments || [],
      urgency: e.urgency,
      visibility: e.visibility,
      unlockAt: e.unlock_at || undefined,
      allowReplies: e.allow_replies,
      tags: e.tags || [],
      status: e.status,
      openedBy: e.opened_by || undefined,
      openedAt: e.opened_at || undefined,
      createdAt: e.created_at,
      replies: [],
    }));
  }
  const entries = JSON.parse(localStorage.getItem('lovable_insecurities') || '[]');
  return entries.filter((e: InsecurityEntry) => e.coupleId === coupleId && e.status !== 'archived');
};

export const saveInsecurity = async (entry: InsecurityEntry) => {
  if (hasSupabaseConfig) {
    const payload = {
      id: entry.id,
      couple_id: entry.coupleId,
      author_id: entry.authorId,
      author_name: entry.authorName,
      title: entry.title || null,
      content: entry.content,
      attachments: entry.attachments || [],
      urgency: entry.urgency,
      visibility: entry.visibility,
      unlock_at: entry.unlockAt || null,
      allow_replies: entry.allowReplies,
      tags: entry.tags || [],
      status: entry.status,
      opened_by: entry.openedBy || null,
      opened_at: entry.openedAt || null,
      created_at: entry.createdAt,
    };
    await (supabase as any).from('insecurities').upsert(payload);
    return;
  }
  const entries = JSON.parse(localStorage.getItem('lovable_insecurities') || '[]');
  const index = entries.findIndex((e: InsecurityEntry) => e.id === entry.id);
  
  if (index !== -1) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem('lovable_insecurities', JSON.stringify(entries));
};

export const addInsecurityAudit = async (audit: InsecurityAudit) => {
  if (hasSupabaseConfig) {
    await (supabase as any).from('insecurity_replies').insert({
      id: audit.id,
      insecurity_id: audit.insecurityId,
      author_id: audit.actorId,
      author_name: audit.actorName,
      message: audit.action,
      created_at: audit.createdAt,
    });
    return;
  }
  const audits = JSON.parse(localStorage.getItem('lovable_insecurity_audits') || '[]');
  audits.push(audit);
  localStorage.setItem('lovable_insecurity_audits', JSON.stringify(audits));
};

export const getInsecurityAudits = async (insecurityId: string): Promise<InsecurityAudit[]> => {
  if (hasSupabaseConfig) {
    const { data } = await (supabase as any)
      .from('insecurity_replies')
      .select('*')
      .eq('insecurity_id', insecurityId)
      .order('created_at', { ascending: true });
    return (data || []).map((r: any) => ({
      id: r.id,
      insecurityId: r.insecurity_id,
      action: 'commented',
      actorId: r.author_id,
      actorName: r.author_name,
      createdAt: r.created_at,
    }));
  }
  const audits = JSON.parse(localStorage.getItem('lovable_insecurity_audits') || '[]');
  return audits.filter((a: InsecurityAudit) => a.insecurityId === insecurityId);
};

// Song Bucket
export const getSongBucket = async (coupleId: string): Promise<SongBucketItem[]> => {
  if (hasSupabaseConfig) {
    const { data } = await (supabase as any)
      .from('song_bucket')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });
    return (data || []).map((s: any) => ({
      id: s.id,
      coupleId: s.couple_id,
      addedById: s.added_by_id,
      addedByName: s.added_by_name,
      spotifyUri: s.spotify_uri,
      note: s.note,
      createdAt: s.created_at,
    }));
  }
  const songs = JSON.parse(localStorage.getItem('lovable_song_bucket') || '[]');
  return songs.filter((s: SongBucketItem) => s.coupleId === coupleId);
};

export const addSongToBucket = async (song: SongBucketItem) => {
  if (hasSupabaseConfig) {
    await (supabase as any).from('song_bucket').upsert({
      id: song.id,
      couple_id: song.coupleId,
      added_by_id: song.addedById,
      added_by_name: song.addedByName,
      spotify_uri: song.spotifyUri,
      note: song.note,
      created_at: song.createdAt,
    });
    return;
  }
  const songs = JSON.parse(localStorage.getItem('lovable_song_bucket') || '[]');
  songs.push(song);
  localStorage.setItem('lovable_song_bucket', JSON.stringify(songs));
};

// Partner mapping utilities
export const setPartnerMap = (coupleId: string, partnerIds: string[]) => {
  if (hasSupabaseConfig) {
    // For Supabase, we don't need to store partner mappings separately
    // as they're already in the couples table
    return;
  }
  
  // For localStorage, store the partner mapping for easy lookup
  const partnerMaps = JSON.parse(localStorage.getItem('lovable_partner_maps') || '{}');
  partnerMaps[coupleId] = partnerIds;
  localStorage.setItem('lovable_partner_maps', JSON.stringify(partnerMaps));
};

export const getPartnerMap = (coupleId: string): string[] => {
  if (hasSupabaseConfig) {
    // For Supabase, partner IDs should be retrieved from couples table
    return [];
  }
  
  const partnerMaps = JSON.parse(localStorage.getItem('lovable_partner_maps') || '{}');
  return partnerMaps[coupleId] || [];
};

// Game Sessions
export const getGameSessions = async (coupleId: string): Promise<GameSession[]> => {
  if (hasSupabaseConfig) {
    const { data, error } = await (supabase as any)
      .from('game_sessions')
      .select('*')
      .eq('couple_id', coupleId)
      .order('played_at', { ascending: false });
    if (error) return [];
    return (data || []).map((g: any) => ({
      id: g.id,
      coupleId: g.couple_id,
      title: g.title,
      url: g.url,
      roomLink: g.room_link || undefined,
      playedAt: g.played_at,
      gameKey: g.game_key || undefined,
      winnerId: g.winner_id || undefined,
      participants: g.participants || [],
    }));
  }
  const sessions = JSON.parse(localStorage.getItem('lovable_game_sessions') || '[]');
  return sessions.filter((s: GameSession) => s.coupleId === coupleId);
};

export const saveGameSession = async (session: GameSession) => {
  if (hasSupabaseConfig) {
    const payload = {
      id: session.id,
      couple_id: session.coupleId,
      title: session.title,
      url: session.url,
      room_link: session.roomLink || null,
      played_at: session.playedAt,
      game_key: session.gameKey || null,
      winner_id: session.winnerId || null,
      participants: session.participants || [],
      created_at: new Date().toISOString(),
    };
    await (supabase as any).from('game_sessions').upsert(payload);
    return;
  }
  const sessions = JSON.parse(localStorage.getItem('lovable_game_sessions') || '[]');
  const index = sessions.findIndex((s: GameSession) => s.id === session.id);
  if (index !== -1) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem('lovable_game_sessions', JSON.stringify(sessions));
};

export const deleteGameSession = async (sessionId: string) => {
  if (hasSupabaseConfig) {
    await (supabase as any)
      .from('game_sessions')
      .delete()
      .eq('id', sessionId);
    return;
  }
  const sessions = JSON.parse(localStorage.getItem('lovable_game_sessions') || '[]');
  const filtered = sessions.filter((s: GameSession) => s.id !== sessionId);
  localStorage.setItem('lovable_game_sessions', JSON.stringify(filtered));
};

// Chat Messages
export const getLocalMessages = async (coupleId: string): Promise<ChatMessage[]> => {
  console.log('getLocalMessages called for coupleId:', coupleId);
  
  // Always check localStorage for messages (even with Supabase for offline support)
  const messages = JSON.parse(localStorage.getItem('lovable_chat_messages') || '[]');
  const filteredMessages = messages.filter((m: ChatMessage) => m.coupleId === coupleId);
  
  console.log('Found messages in localStorage:', filteredMessages.length);
  return filteredMessages;
};

export const saveLocalMessage = async (message: ChatMessage) => {
  console.log('saveLocalMessage called with:', message);
  
  // Always save to localStorage for the chat widget to work
  // even if Supabase is configured (for offline support)
  const messages = JSON.parse(localStorage.getItem('lovable_chat_messages') || '[]');
  messages.push(message);
  localStorage.setItem('lovable_chat_messages', JSON.stringify(messages));
  
  console.log('Message saved to localStorage, total messages:', messages.length);
};
