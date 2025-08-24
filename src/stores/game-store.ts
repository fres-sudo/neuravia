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
	rawData: {
		[gameType: string]: {
			rounds: Array<{
				roundNumber: number;
				score: number;
				timeSpent: number;
				errors: number;
				correctAnswers: number;
				totalAttempts: number;
				details: any;
			}>;
		};
	};
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
	gameplayStarted: boolean;
	timeRemaining: number;
	timerActive: boolean;
	gameSettings: GameSettings;
	patientId?: string;
	startSession: (
		mode: GameMode,
		profile: PlayerProfile,
		patientId?: string
	) => void;
	endSession: () => void;
	startGame: (gameType: GameType) => void;
	startActualGameplay: () => void;
	completeGame: (score: number, rawData?: any) => void;
	nextGame: () => void;
	startTimer: (duration: number) => void;
	stopTimer: () => void;
	tick: () => void;
	updateGameSettings: (level: DifficultyLevel, gameType: GameType) => void;
	showGameInstructions: () => void;
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
			gameplayStarted: false,
			timeRemaining: 0,
			timerActive: false,
			gameSettings: {
				timerDuration: 10,
				itemCount: 4,
				showInstructions: true,
			},
			startSession: (mode, profile, patientId) => {
				const totalRounds = mode === "short" ? 12 : 40; // 4 games × 3 or 10 rounds
				set({
					session: {
						mode,
						currentGameIndex: 0, // Start with first game (scene-crasher)
						currentRound: 1, // Start with round 1
						totalRounds,
						score: 0,
						startTime: new Date(),
						gamesCompleted: [],
						rawData: {},
					},
					profile,
					patientId,
					showWelcome: false,
					isPlaying: true,
				});
				// Start the first game
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
					gameplayStarted: false,
					patientId: undefined,
				});
			},
			startGame: (gameType) => {
				const { profile } = get();
				if (!profile) return;
				set({ currentGame: gameType, gameplayStarted: false });
				get().updateGameSettings(profile.difficultyLevel, gameType);
				const firstTime = !get().session?.gamesCompleted.includes(gameType);
				if (firstTime) {
					get().showGameInstructions();
				} else {
					set({ gameplayStarted: true });
				}
			},
			startActualGameplay: () => {
				set({ gameplayStarted: true });
			},
			completeGame: (gameScore, rawData) => {
				const { session, currentGame } = get();
				if (!session || !currentGame) return;

				// Store raw data for this game
				const updatedRawData = {
					...session.rawData,
					[currentGame]: {
						rounds: [
							...(session.rawData[currentGame]?.rounds || []),
							{
								roundNumber: session.currentRound,
								score: gameScore,
								timeSpent: 0, // Will be calculated from timer
								errors: 0, // Will be calculated from raw data
								correctAnswers: 0, // Will be calculated from raw data
								totalAttempts: 0, // Will be calculated from raw data
								details: rawData || {},
							},
						],
					},
				};

				set(() => ({
					session: {
						...session,
						score: session.score + gameScore,
						gamesCompleted: [...session.gamesCompleted, currentGame],
						rawData: updatedRawData,
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

				// Calculate rounds per game based on session type
				const roundsPerGame = session.mode === "short" ? 3 : 10;
				const totalGames = 4;

				// Calculate which game we should be on and which round within that game
				const nextRound = session.currentRound + 1;
				const nextGameType = Math.floor((nextRound - 1) / roundsPerGame);

				// Check if session is complete
				if (nextRound > session.totalRounds) {
					get().endSession();
					return;
				}

				// Update session state
				set({
					session: {
						...session,
						currentGameIndex: Math.min(nextGameType, totalGames - 1),
						currentRound: nextRound,
					},
				});

				// Start the appropriate game
				const gameToStart = gameOrder[Math.min(nextGameType, totalGames - 1)]!;
				get().startGame(gameToStart);
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
					mild: { timerDuration: 5, itemCount: 4 },
					moderate: { timerDuration: 8, itemCount: 3 },
					severe: { timerDuration: 12, itemCount: 2 },
				};
				set({
					gameSettings: {
						...settingsMap[level],
						showInstructions: true,
					},
				});
			},
			showGameInstructions: () => {
				set({ showInstructions: true });
			},
			hideInstructions: () => {
				set({ showInstructions: false });
				get().startActualGameplay();
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
