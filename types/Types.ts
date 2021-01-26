export type Link = {
  name: string,
  url: string
}

export type LiveSession = {
  name: string,
  weekday: number,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  url: string
}

export type Contact = {
  name: string,
  email: string
}

export type Activity = {
  name: string,
  liveSessions: LiveSession[]
  links: Link[]
}
