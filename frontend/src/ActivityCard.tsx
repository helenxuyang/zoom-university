import StyledButton from './StyledButton';
import Card from '@material-ui/core/Card';
import React from 'react';
import { Activity, LiveSession } from '../../types/Types';
import zoomLogo from './images/zoom-logo.png';
import { DateTime } from 'luxon';

type LiveSessionInstance = {
  session: LiveSession,
  startTime: DateTime,
  endTime: DateTime
}

const ActivityCard = (activity: Activity) => {
  const { name, liveSessions, links: otherLinks } = activity;
  const now = DateTime.local();
  const weekdays = liveSessions.map((session) => session.weekday);

  const nextSessionOnWeekday = (weekday: number): LiveSession => {
    return liveSessions.filter((session) => session.weekday === weekday)
      .sort((s1, s2) => {
        if (s1.startHour === s2.startHour) {
          return s1.startMinute - s2.startMinute;
        }
        else {
          return s1.startHour - s2.startHour;
        }
      })[0];
  }

  const getNextSession = (currentDay: DateTime): LiveSessionInstance => {
    let daysUntilNextSession = 0;
    let nextSessionDate = currentDay;
    let nextSessionWeekday = nextSessionDate.weekday;
    while (!weekdays.includes(nextSessionWeekday)) {
      daysUntilNextSession++;
      nextSessionDate = currentDay.plus({ days: daysUntilNextSession });
      nextSessionWeekday = nextSessionDate.weekday;
    }
    const session = nextSessionOnWeekday(nextSessionWeekday);
    return {
      session: session,
      startTime: nextSessionDate.set({ hour: session.startHour, minute: session.startMinute }),
      endTime: nextSessionDate.set({ hour: session.endHour, minute: session.endMinute })
    };
  }

  const haveSessionToday = weekdays.includes(now.weekday);

  const nextSession = liveSessions.length > 0 ? getNextSession(now) : null;

  return <Card style={{ padding: 16 }}>
    <h1>{name}</h1>
    {nextSession && (haveSessionToday ?
      <p>{`Meets today at ${nextSession.startTime.toLocaleString(DateTime.TIME_SIMPLE)}`}</p> :
      <p>{`Next meeting on ${nextSession.startTime.toLocaleString({ weekday: 'long' })}`}</p>)
    }

    {nextSession && haveSessionToday &&
      <StyledButton
        variant="outlined"
        color="primary"
        target="_blank"
        href={nextSession.session.url}>
        <img src={zoomLogo} alt={"zoom logo"} width={24} style={{ marginRight: 8 }} />
        Join on Zoom
      </StyledButton>
    }
    <br />
    {otherLinks.map((link, index) =>
      <StyledButton
        key={index}
        variant="outlined"
        color="secondary"
        target="_blank"
        href={link.url}>
        {link.name}
      </StyledButton>)
    }
  </Card>

}

export default ActivityCard;