function numericScore(value) {
  if (value === '' || value == null) return 0
  const score = Number(value)
  return Number.isFinite(score) ? score : 0
}

export function calculateTeamPoints(events, teamId) {
  return (Array.isArray(events) ? events : []).reduce(
    (total, event) => total + numericScore(event?.details?.results?.[teamId]?.score),
    0
  )
}

export function applyCalculatedTeamPoints(state) {
  if (!state?.settings || !Array.isArray(state.settings.teams)) return state
  return {
    ...state,
    settings: {
      ...state.settings,
      teams: state.settings.teams.map(team => ({
        ...team,
        points: calculateTeamPoints(state.events, team.id)
      }))
    }
  }
}
