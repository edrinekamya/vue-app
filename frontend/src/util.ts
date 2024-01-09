export function secondsToTimeFormat(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  seconds %= 3600 * 24
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return [days, hours, minutes, secs]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':')
}

export function formatTime(str: string) {
  const date = new Date(str)
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}
