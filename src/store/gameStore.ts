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

