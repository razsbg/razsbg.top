import { createSignal, onCleanup } from "solid-js"

const CountdownClient = (props) => {
  const [timeRemaining, setTimeRemaining] = createSignal({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  })

  const calculateTimeDifference = (target) => {
    const now = new Date()
    const difference = target.getTime() - now.getTime()
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    
    return { days, hours, minutes, seconds, isComplete: false }
  }

  const updateCountdown = () => {
    const targetDate = new Date(props.targetDate)
    setTimeRemaining(calculateTimeDifference(targetDate))
  }

  // Update immediately
  updateCountdown()

  // Then update every second
  const timer = setInterval(updateCountdown, 1000)

  onCleanup(() => {
    clearInterval(timer)
  })

  return (
    <div>
      <div class="countdown-display">
        <div class="time-block">
          <div class="time-value">{timeRemaining().days}</div>
          <div class="time-label">Days</div>
        </div>
        <div class="time-separator">:</div>
        <div class="time-block">
          <div class="time-value">{String(timeRemaining().hours).padStart(2, '0')}</div>
          <div class="time-label">Hours</div>
        </div>
        <div class="time-separator">:</div>
        <div class="time-block">
          <div class="time-value">{String(timeRemaining().minutes).padStart(2, '0')}</div>
          <div class="time-label">Minutes</div>
        </div>
        <div class="time-separator">:</div>
        <div class="time-block">
          <div class="time-value">{String(timeRemaining().seconds).padStart(2, '0')}</div>
          <div class="time-label">Seconds</div>
        </div>
      </div>
      
      {timeRemaining().isComplete && (
        <div class="countdown-message">
          <span role="img" aria-label="celebration">
            🎉
          </span>{" "}
          The party has started!{" "}
          <span role="img" aria-label="celebration">
            🎉
          </span>
        </div>
      )}
    </div>
  )
}

export default CountdownClient
