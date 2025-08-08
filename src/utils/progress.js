export function updateProgress(update) {
    const current = JSON.parse(localStorage.getItem("userProgress")) || {
      totalTime: 0,
      modulesCompleted: 0,
      entries: 0,
      feelingsLogged: 0,
      timeline: []
    };
  
    const newData = {
      totalTime: current.totalTime + (update.totalTime || 0),
      modulesCompleted: Math.max(current.modulesCompleted, update.modulesCompleted || 0),
      entries: current.entries + (update.entries || 0),
      feelingsLogged: current.feelingsLogged + (update.feelingsLogged || 0),
      timeline: update.timeline
        ? [...current.timeline, { ...update.timeline, date: new Date().toISOString() }]
        : current.timeline
    };
  
    localStorage.setItem("userProgress", JSON.stringify(newData));
  }
  