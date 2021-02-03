import StyledButton from './StyledButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import React, { useState } from 'react';
import { Activity, LiveSession } from '../../types/Types';
import zoomLogo from './images/zoom-logo.png';
import { DateTime } from 'luxon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

type LiveSessionInstance = {
  session: LiveSession,
  startTime: DateTime,
  endTime: DateTime
}

type ActivityCardProps = {
  activity: Activity,
  startDelete: () => void,
  startEdit: () => void
}

const ActivityCard = ({ activity, startDelete, startEdit }: ActivityCardProps) => {
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

  return <div>
    <Card style={{ textAlign: "center" }}>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>{name}</h1>

      {nextSession && (haveSessionToday ?
        <p>{`${nextSession.session.name} today at ${nextSession.startTime.toLocaleString(DateTime.TIME_SIMPLE)}`}</p> :
        <p>{`Next session: ${nextSession.session.name} on ${nextSession.startTime.toLocaleString({ weekday: 'long' })}`}</p>)
      }

      {nextSession &&
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
      {otherLinks.length > 0 && <h2>Links</h2>}
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
      <br />
      <CardActions disableSpacing>
        <IconButton onClick={e => { startEdit(); }}>
          <EditIcon />
        </IconButton >
        <IconButton onClick={e => { startDelete(); }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  </div>

}

export default ActivityCard;