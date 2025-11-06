import { createSignal, onCleanup } from "solid-js"

const CountdownClient = (props) => {
  const [timeRemaining, setTimeRemaining] = createSignal({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })
  
  const [animatingDigits, setAnimatingDigits] = createSignal({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
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
    const newTime = calculateTimeDifference(targetDate)
    const oldTime = timeRemaining()
    
    // Trigger animation for changed values
    const changes = {}
    if (newTime.days !== oldTime.days) changes.days = true
    if (newTime.hours !== oldTime.hours) changes.hours = true
    if (newTime.minutes !== oldTime.minutes) changes.minutes = true
    if (newTime.seconds !== oldTime.seconds) changes.seconds = true
    
    if (Object.keys(changes).length > 0) {
      setAnimatingDigits(changes)
      setTimeout(() => {
        setAnimatingDigits({ days: false, hours: false, minutes: false, seconds: false })
      }, 400)
    }
    
    setTimeRemaining(newTime)
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
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        <div class="flex flex-col items-center">
          <div class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-secondary font-bold tracking-tight ${animatingDigits().days ? 'animate-digit-flip' : ''}`}>
            {timeRemaining().days}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.days}
          </div>
        </div>
        
        <div class="flex flex-col items-center">
          <div class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-secondary font-bold tracking-tight ${animatingDigits().hours ? 'animate-digit-flip' : ''}`}>
            {String(timeRemaining().hours).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.hours}
          </div>
        </div>
        
        <div class="flex flex-col items-center">
          <div class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-secondary font-bold tracking-tight ${animatingDigits().minutes ? 'animate-digit-flip' : ''}`}>
            {String(timeRemaining().minutes).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.minutes}
          </div>
        </div>
        
        <div class="flex flex-col items-center">
          <div class={`font-mono text-5xl md:text-6xl lg:text-7xl text-brand-secondary font-bold tracking-tight ${animatingDigits().seconds ? 'animate-digit-flip' : ''}`}>
            {String(timeRemaining().seconds).padStart(2, "0")}
          </div>
          <div class="font-sans text-xs md:text-sm uppercase tracking-wide text-text-secondary mt-2">
            {props.translations.labels.seconds}
          </div>
        </div>
      </div>
      
      {timeRemaining().isComplete && (
        <div class="text-2xl font-bold text-brand-secondary mt-8 text-center animate-bounce">
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
