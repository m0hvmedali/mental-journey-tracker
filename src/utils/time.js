export function formatDuration(ms) {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const days = Math.floor(hr / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(months / 12);
  
    const remMonths = months % 12;
    const remDays = days % 30;
    const remHours = hr % 24;
    const remMinutes = min % 60;
  
    return `${years > 0 ? years + 'y ' : ''}${remMonths}m ${remDays}d ${remHours}h ${remMinutes}m`;
  }
  