export async function getAppTaskListId(token: string) {
  const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: token }
  });
  if (!listsRes.ok) throw new Error('Failed to fetch task lists');
  const listsData = await listsRes.json();
  let appList = listsData.items?.find((l: any) => l.title === 'Growth Tree Tasks');
  
  if (!appList) {
    const createRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Growth Tree Tasks' })
    });
    if (!createRes.ok) throw new Error('Failed to create task list');
    appList = await createRes.json();
  }
  return appList.id;
}

export async function createGoogleTaskAndEvent(token: string, data: { title: string, notes?: string, due?: string, reminderMinutesBefore?: number, durationMinutes?: number }) {
  const { title, notes, due, reminderMinutesBefore = 10, durationMinutes = 15 } = data;
  
  const listId = await getAppTaskListId(token);

  const gTaskRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      notes,
      due: due ? new Date(due).toISOString() : undefined
    })
  });
  
  if (gTaskRes.status === 401 || gTaskRes.status === 403) {
     const err: any = new Error('Google Auth Error');
     err.status = gTaskRes.status;
     throw err;
  }
  const gTask = await gTaskRes.json();

  const startDate = due ? new Date(due) : new Date();
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const gCalRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: title,
      description: `${notes || ''}\n\nLink to app: https://ourapp.com/tasks`,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: reminderMinutesBefore }]
      }
    })
  });
  const gCalEvent = await gCalRes.json();

  return {
    id: `task_${Date.now()}`,
    title,
    notes,
    due,
    gTaskId: gTask.id,
    gTaskListId: listId,
    gCalEventId: gCalEvent.id,
    createdAt: Date.now()
  };
}

// Function exposed for the AI assistant to use
export async function createTaskFromAssistant(token: string, data: { title: string, due?: string, reminderMinutesBefore?: number }) {
  return await createGoogleTaskAndEvent(token, data);
}
