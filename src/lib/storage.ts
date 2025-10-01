// localStorage utilities for Lovable

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
  content: string;
  status: 'sealed' | 'opened' | 'responded';
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  openedAt?: string;
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

// Diary Storage
export const getDiaryEntries = (coupleId: string): DiaryEntry[] => {
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  return entries.filter((e: DiaryEntry) => e.coupleId === coupleId && !e.deletedAt);
};

export const saveDiaryEntry = (entry: DiaryEntry) => {
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  const index = entries.findIndex((e: DiaryEntry) => e.id === entry.id);
  
  if (index !== -1) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem('lovable_diary_entries', JSON.stringify(entries));
};

export const deleteDiaryEntry = (entryId: string) => {
  const entries = JSON.parse(localStorage.getItem('lovable_diary_entries') || '[]');
  const index = entries.findIndex((e: DiaryEntry) => e.id === entryId);
  
  if (index !== -1) {
    entries[index].deletedAt = new Date().toISOString();
    localStorage.setItem('lovable_diary_entries', JSON.stringify(entries));
  }
};

// Photo Storage
export const getPhotos = (coupleId: string): Photo[] => {
  const photos = JSON.parse(localStorage.getItem('lovable_photos') || '[]');
  return photos.filter((p: Photo) => p.coupleId === coupleId);
};

export const savePhoto = (photo: Photo) => {
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

export const getTodayQuestion = (coupleId: string): DailyQuestion => {
  const today = new Date().toISOString().split('T')[0];
  const questions = JSON.parse(localStorage.getItem('lovable_daily_questions') || '[]');
  
  let todayQuestion = questions.find((q: DailyQuestion) => 
    q.coupleId === coupleId && q.date === today
  );

  if (!todayQuestion) {
    const dayIndex = Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % DAILY_QUESTIONS.length);
    todayQuestion = {
      id: crypto.randomUUID(),
      coupleId,
      questionText: DAILY_QUESTIONS[dayIndex],
      date: today
    };
    questions.push(todayQuestion);
    localStorage.setItem('lovable_daily_questions', JSON.stringify(questions));
  }

  return todayQuestion;
};

export const answerDailyQuestion = (questionId: string, userId: string, answer: string, isPartnerA: boolean) => {
  const questions = JSON.parse(localStorage.getItem('lovable_daily_questions') || '[]');
  const index = questions.findIndex((q: DailyQuestion) => q.id === questionId);
  
  if (index !== -1) {
    const answerData = { text: answer, timestamp: new Date().toISOString() };
    if (isPartnerA) {
      questions[index].answerByA = answerData;
    } else {
      questions[index].answerByB = answerData;
    }
    localStorage.setItem('lovable_daily_questions', JSON.stringify(questions));
  }
};

// Reminders
export const getReminders = (coupleId: string): Reminder[] => {
  const reminders = JSON.parse(localStorage.getItem('lovable_reminders') || '[]');
  return reminders.filter((r: Reminder) => r.coupleId === coupleId);
};

export const saveReminder = (reminder: Reminder) => {
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
export const getInsecurities = (coupleId: string): InsecurityEntry[] => {
  const entries = JSON.parse(localStorage.getItem('lovable_insecurities') || '[]');
  return entries.filter((e: InsecurityEntry) => e.coupleId === coupleId);
};

export const saveInsecurity = (entry: InsecurityEntry) => {
  const entries = JSON.parse(localStorage.getItem('lovable_insecurities') || '[]');
  const index = entries.findIndex((e: InsecurityEntry) => e.id === entry.id);
  
  if (index !== -1) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem('lovable_insecurities', JSON.stringify(entries));
};

// Song Bucket
export const getSongBucket = (coupleId: string): SongBucketItem[] => {
  const songs = JSON.parse(localStorage.getItem('lovable_song_bucket') || '[]');
  return songs.filter((s: SongBucketItem) => s.coupleId === coupleId);
};

export const addSongToBucket = (song: SongBucketItem) => {
  const songs = JSON.parse(localStorage.getItem('lovable_song_bucket') || '[]');
  songs.push(song);
  localStorage.setItem('lovable_song_bucket', JSON.stringify(songs));
};
