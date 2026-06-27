import { create } from 'zustand'

export interface Player {
  sid: string
  user_id: string
  name: string
  avatar_url?: string
  is_host: boolean
  is_connected: boolean
  total_score: number
  correct_count: number
  wrong_count: number
  time_limit?: number
}

export interface Question {
  question_number: number
  question_text: string
  options: { id: string; text: string }[]
  correct_option?: string
  explanation?: string
  time_limit?: number
}

interface GameState {
  isConnected: boolean
  roomCode: string | null
  mode: 'PRACTICE' | 'BATTLE' | null
  subject: string | null
  difficulty: string | null
  status: string
  players: Player[]
  isHost: boolean
  currentQuestion: number
  totalQuestions: number
  questions: Question[]
  timeRemaining: number
  selectedOption: string | null
  hasAnswered: boolean
  questionResults: any | null
  leaderboard: any[] | null
  finalRankings: any[] | null

  setConnected: (connected: boolean) => void
  setRoom: (room: any) => void
  setPlayers: (players: Player[]) => void
  setQuestion: (q: Question, total: number) => void
  setTimeRemaining: (time: number) => void
  setSelectedOption: (option: string | null) => void
  setHasAnswered: (answered: boolean) => void
  setQuestionResults: (results: any) => void
  setLeaderboard: (lb: any[]) => void
  setFinalRankings: (rankings: any[]) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  isConnected: false,
  roomCode: null,
  mode: null,
  subject: null,
  difficulty: null,
  status: 'WAITING',
  players: [],
  isHost: false,
  currentQuestion: 0,
  totalQuestions: 5,
  questions: [],
  timeRemaining: 60,
  selectedOption: null,
  hasAnswered: false,
  questionResults: null,
  leaderboard: null,
  finalRankings: null,

  setConnected: (connected) => set({ isConnected: connected }),

  setRoom: (room) => {
    if (!room) {
      set({
        roomCode: null,
        mode: null,
        subject: null,
        difficulty: null,
        status: 'WAITING',
        isHost: false,
        players: [],
      });
      return;
    }
    set({
      roomCode: room.room_code,
      mode: room.mode,
      subject: room.subject,
      difficulty: room.difficulty,
      status: room.status,
      isHost: room.is_host,
      players: room.players || [],
    });
  },

  setPlayers: (players) => set({ players }),

  setQuestion: (q, total) => set(() => ({
    currentQuestion: q.question_number,
    totalQuestions: total,
    questions: [q],
    timeRemaining: q.time_limit || 60,
    selectedOption: null,
    hasAnswered: false,
    questionResults: null,
  })),

  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setHasAnswered: (answered) => set({ hasAnswered: answered }),
  setQuestionResults: (results) => set({ questionResults: results }),
  setLeaderboard: (lb) => set({ leaderboard: lb }),
  setFinalRankings: (rankings) => set({ finalRankings: rankings }),

  resetGame: () => set({
    isConnected: false,
    roomCode: null,
    mode: null,
    subject: null,
    difficulty: null,
    status: 'WAITING',
    players: [],
    isHost: false,
    currentQuestion: 0,
    totalQuestions: 5,
    questions: [],
    timeRemaining: 60,
    selectedOption: null,
    hasAnswered: false,
    questionResults: null,
    leaderboard: null,
    finalRankings: null,
  }),
}))