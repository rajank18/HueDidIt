import { AnimatePresence } from 'framer-motion'
import MatchPhase from './components/MatchPhase'
import MemorizePhase from './components/MemorizePhase'
import ScorePhase from './components/ScorePhase'
import StartPhase from './components/StartPhase'
import { useGameState } from './hooks/useGameState'
import './App.css'

function App() {
  const {
    phase,
    roundId,
    targetColor,
    guessColor,
    scoreData,
    startGame,
    setGuessValue,
    startMatchPhase,
    submitGuess,
    playAgain,
    goToStart,
  } = useGameState()

  const gameNumber = Math.max(1, roundId)
  const matchDurationMs = gameNumber > 5 ? 5000 : 10000
  const tintStrength = phase === 'start' ? 0.015 : 0.04
  const shellStyle = {
    '--accent-h': targetColor.h,
    '--accent-s': `${targetColor.s}%`,
    '--accent-l': '50%',
    '--accent-soft-alpha': tintStrength,
  }

  return (
    <main
      className="app-shell"
      style={shellStyle}
    >
      <div className="game-shell">
        <header className="top-bar">
          <button
            type="button"
            className="wordmark story-script-regular wordmark-button"
            onClick={goToStart}
          >
            HUE DID IT
          </button>
          <p className="game-counter">Game #{gameNumber}</p>
        </header>

        <section className="phase-view">
          <AnimatePresence mode="wait">
            {phase === 'start' && <StartPhase onStart={startGame} />}

            {phase === 'memorize' && (
              <MemorizePhase
                targetColor={targetColor}
                onComplete={startMatchPhase}
                roundId={roundId}
              />
            )}

            {phase === 'match' && (
              <MatchPhase
                guessColor={guessColor}
                onGuessChange={setGuessValue}
                onComplete={submitGuess}
                roundId={roundId}
                durationMs={matchDurationMs}
              />
            )}

            {phase === 'score' && (
              <ScorePhase
                targetColor={targetColor}
                guessColor={guessColor}
                scoreData={scoreData}
                onPlayAgain={playAgain}
                roundId={roundId}
              />
            )}
          </AnimatePresence>
        </section>

        <footer className="footer-credit">
          <span>Created with ‪‪❤︎‬ By </span>
          <a
            className="creator-link"
            href="https://instagram.com/whyrajan"
            target="_blank"
            rel="noreferrer"
          >
            Rajan.☘︎ ݁˖
          </a>
        </footer>
      </div>
    </main>
  )
}

export default App
