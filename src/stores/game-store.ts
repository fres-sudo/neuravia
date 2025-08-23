import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Import del tuo store completo
export type GameType =
	| "scene-crasher"
	| "hawk-eye"
	| "todo-list"
	| "flashing-memory";
export type GameMode = "short" | "long";
export type DifficultyLevel = "mild" | "moderate" | "severe";

export interface GameSession {
	mode: GameMode;
	currentGameIndex: number;
	currentRound: number;
	totalRounds: number;
	score: number;
	startTime: Date;
	gamesCompleted: GameType[];
}

export interface PlayerProfile {
	profession: string;
	difficultyLevel: DifficultyLevel;
	customAssets: {
		[key in GameType]: {
			background: string;
			items: string[];
		};
	};
}

export interface GameSettings {
	timerDuration: number;
	itemCount: number;
	showInstructions: boolean;
}

interface GameStore {
	session: GameSession | null;
	profile: PlayerProfile | null;
	currentGame: GameType | null;
	isPlaying: boolean;
	showWelcome: boolean;
	showInstructions: boolean;
	timeRemaining: number;
	timerActive: boolean;
	gameSettings: GameSettings;
	startSession: (mode: GameMode, profile: PlayerProfile) => void;
	endSession: () => void;
	startGame: (gameType: GameType) => void;
	completeGame: (score: number) => void;
	nextGame: () => void;
	startTimer: (duration: number) => void;
	stopTimer: () => void;
	tick: () => void;
	updateGameSettings: (level: DifficultyLevel, gameType: GameType) => void;
	showGameInstructions: (gameType: GameType) => void;
	hideInstructions: () => void;
}

const useGameStore = create<GameStore>()(
	devtools(
		(set, get) => ({
			session: null,
			profile: null,
			currentGame: null,
			isPlaying: false,
			showWelcome: true,
			showInstructions: false,
			timeRemaining: 0,
			timerActive: false,
			gameSettings: {
				timerDuration: 10,
				itemCount: 4,
				showInstructions: true,
			},
			startSession: (mode, profile) => {
				const totalRounds = mode === "short" ? 4 : 16;
				set({
					session: {
						mode,
						currentGameIndex: 0,
						currentRound: 1,
						totalRounds,
						score: 0,
						startTime: new Date(),
						gamesCompleted: [],
					},
					profile,
					showWelcome: false,
					isPlaying: true,
				});
				// Avvia automaticamente il primo gioco
				const gameOrder: GameType[] = [
					"scene-crasher",
					"hawk-eye",
					"todo-list",
					"flashing-memory",
				];
				get().startGame(gameOrder[0]!);
			},
			endSession: () => {
				set({
					session: null,
					currentGame: null,
					isPlaying: false,
					showWelcome: true,
					timerActive: false,
					showInstructions: false,
				});
			},
			startGame: (gameType) => {
				const { profile } = get();
				if (!profile) return;
				set({ currentGame: gameType });
				get().updateGameSettings(profile.difficultyLevel, gameType);
				const firstTime = !get().session?.gamesCompleted.includes(gameType);
				if (firstTime) {
					get().showGameInstructions(gameType);
				}
			},
			completeGame: (gameScore) => {
				const { session, currentGame } = get();
				if (!session || !currentGame) return;
				set(() => ({
					session: {
						...session,
						score: session.score + gameScore,
						gamesCompleted: [...session.gamesCompleted, currentGame],
					},
				}));
			},
			nextGame: () => {
				const { session } = get();
				if (!session) return;
				const gameOrder: GameType[] = [
					"scene-crasher",
					"hawk-eye",
					"todo-list",
					"flashing-memory",
				];
				const nextIndex = (session.currentGameIndex + 1) % gameOrder.length;
				const nextRound =
					nextIndex === 0 ? session.currentRound + 1 : session.currentRound;
				if (nextRound > session.totalRounds) {
					get().endSession();
					return;
				}
				set((state) => ({
					session: {
						...session,
						currentGameIndex: nextIndex,
						currentRound: nextRound,
					},
				}));
				get().startGame(gameOrder[nextIndex]!);
			},
			startTimer: (duration) => {
				set({
					timeRemaining: duration,
					timerActive: true,
				});
			},
			stopTimer: () => {
				set({ timerActive: false, timeRemaining: 0 });
			},
			tick: () => {
				const { timeRemaining, timerActive } = get();
				if (!timerActive || timeRemaining <= 0) {
					set({ timerActive: false });
					return;
				}
				const newTime = timeRemaining - 1;
				set({ timeRemaining: newTime });
				if (newTime <= 0) {
					set({ timerActive: false });
				}
			},
			updateGameSettings: (level, _) => {
				const settingsMap = {
					mild: { timerDuration: 15, itemCount: 4 },
					moderate: { timerDuration: 10, itemCount: 3 },
					severe: { timerDuration: 20, itemCount: 2 },
				};
				set({
					gameSettings: {
						...settingsMap[level],
						showInstructions: true,
					},
				});
			},
			showGameInstructions: (gameType) => {
				set({ showInstructions: true });
			},
			hideInstructions: () => {
				set({ showInstructions: false });
			},
		}),
		{ name: "alzheimer-game-store" }
	)
);

// Hook personalizzati
const useGameSession = () => {
	const session = useGameStore((state) => state.session);
	const startSession = useGameStore((state) => state.startSession);
	const endSession = useGameStore((state) => state.endSession);
	return { session, startSession, endSession };
};

const useGameTimer = () => {
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const startTimer = useGameStore((state) => state.startTimer);
	const stopTimer = useGameStore((state) => state.stopTimer);
	const tick = useGameStore((state) => state.tick);
	return { timeRemaining, timerActive, startTimer, stopTimer, tick };
};

const useGameProgress = () => {
	const session = useGameStore((state) => state.session);
	const currentGame = useGameStore((state) => state.currentGame);
	const progress = session
		? (session.currentRound - 1) / session.totalRounds
		: 0;
	const currentStep = session?.currentRound || 0;
	const totalSteps = session?.totalRounds || 0;
	const score = session?.score || 0;
	return { progress, currentStep, totalSteps, score, currentGame };
};

export { useGameSession, useGameTimer, useGameProgress, useGameStore };
