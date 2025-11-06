import { createSignal, onCleanup } from "solid-js"
import styles from "./CountdownClient.module.css"

const CountdownClient = props => {
  const [timeRemaining, setTimeRemaining] = createSignal({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  const [isFirstLoad, setIsFirstLoad] = createSignal(true)

  const calculateTimeDifference = target => {
    const now = new Date()
    const difference = target.getTime() - now.getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isComplete: false }
  }

  const updateCountdown = () => {
    const targetDate = new Date(props.targetDate)
    const newTime = calculateTimeDifference(targetDate)
    setTimeRemaining(newTime)
  }

  // Update immediately
  updateCountdown()

  // Mark first load as complete after animation
  setTimeout(() => setIsFirstLoad(false), 1200)

  // Then update every second
  const timer = setInterval(updateCountdown, 1000)

  onCleanup(() => {
    clearInterval(timer)
  })

  return (
    <div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        <div
          class={`flex flex-col items-center ${isFirstLoad() ? styles.digitContainer : ""}`}
        >
          <div
            class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-primary font-bold tracking-tight ${
              isFirstLoad() ? styles.digit : ""
            }`}
          >
            {timeRemaining().days}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.days}
          </div>
        </div>

        <div
          class={`flex flex-col items-center ${isFirstLoad() ? styles.digitContainer : ""}`}
        >
          <div
            class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-primary font-bold tracking-tight ${
              isFirstLoad() ? styles.digit : ""
            }`}
          >
            {String(timeRemaining().hours).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.hours}
          </div>
        </div>

        <div
          class={`flex flex-col items-center ${isFirstLoad() ? styles.digitContainer : ""}`}
        >
          <div
            class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-primary font-bold tracking-tight ${
              isFirstLoad() ? styles.digit : ""
            }`}
          >
            {String(timeRemaining().minutes).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.minutes}
          </div>
        </div>

        <div
          class={`flex flex-col items-center ${isFirstLoad() ? styles.digitContainer : ""}`}
        >
          <div
            class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-primary font-bold tracking-tight ${
              isFirstLoad() ? styles.digit : ""
            }`}
          >
            {String(timeRemaining().seconds).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.seconds}
          </div>
        </div>
      </div>

      {timeRemaining().isComplete && (
        <div class="text-xl md:text-2xl font-bold text-brand-primary mt-8 text-center animate-bounce">
          <span role="img" aria-label="celebration">
            🎉
          </span>{" "}
          {props.translations.completed}{" "}
          <span role="img" aria-label="celebration">
            🎉
          </span>
        </div>
      )}
    </div>
  )
}

export default CountdownClient
