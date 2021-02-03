import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { Activity, Link, LiveSession } from '../../types/Types';
import Button from '@material-ui/core/Button';
import { DialogContent, IconButton, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import './ActivityDialog.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type SessionRowProps = {
  session: LiveSession,
  index: number,
  deleteSession: (index: number) => void,
  editing: boolean,
  setEditing: (index: number, editing: boolean) => void
}

type LinkRowProps = {
  link: Link,
  index: number,
  deleteLink: (index: number) => void,
  editing: boolean,
  setEditing: (index: number, editing: boolean) => void
}

type ActivityDialogProps = {
  creating: boolean,
  originalActivity?: Activity,
  isOpen: boolean,
  close: () => void,
  addActivity?: (activity: Activity) => void,
  updateActivity?: (originalActivity: Activity, newActivity: Activity) => void,
}

const ActivityDialog = ({ creating, originalActivity, isOpen, close, addActivity, updateActivity }: ActivityDialogProps) => {
  const [name, setName] = useState(creating ? "" : originalActivity?.name as string);

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(creating ? [] : originalActivity?.liveSessions as LiveSession[]);
  const [sessionURL, setURL] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [links, setLinks] = useState<Link[]>(creating ? [] : originalActivity?.links as Link[]);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");

  const [editingSessions, setEditingSessions] = useState<boolean[]>(Array(liveSessions.length).fill(false));
  const [editingLinks, setEditingLinks] = useState<boolean[]>(Array(links.length).fill(false));

  const SessionRow = ({ session, index, deleteSession, editing, setEditing }: SessionRowProps) => {
    const [newURL, setNewURL] = useState(session.url);
    const [newSessionName, setNewSessionName] = useState(session.name);
    const [newWeekday, setNewWeekday] = useState(session.weekday);
    const [newStartTime, setNewStartTime] = useState(
      DateTime.local().set({ hour: session.startHour, minute: session.startMinute }).toLocaleString({ hour: "numeric", minute: "numeric", hour12: false })
    );
    const [newEndTime, setNewEndTime] = useState(
      DateTime.local().set({ hour: session.endHour, minute: session.endMinute }).toLocaleString({ hour: "numeric", minute: "numeric", hour12: false })
    );

    const updateSession = (index: number) => {
      if (newSessionName !== "" && newURL !== "" && newStartTime !== "" && newEndTime !== "") {
        const newSession: LiveSession = {
          name: newSessionName,
          url: newURL,
          weekday: newWeekday,
          startHour: parseHour(newStartTime),
          startMinute: parseMin(newStartTime),
          endHour: parseHour(newEndTime),
          endMinute: parseMin(newEndTime)
        }
        let sessionsCopy = [...liveSessions];
        sessionsCopy[index] = newSession;
        setLiveSessions(sessionsCopy);
        setEditing(index, false);
      }
    }

    return editing ?
      <TableRow>
        <TableCell>
          <TextField
            variant="outlined"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <Select
            id="end"
            type="time"
            value={newWeekday}
            onChange={(e) => setNewWeekday(e.target.value as number)}
          >
            <MenuItem value={1}>Monday</MenuItem>
            <MenuItem value={2}>Tuesday</MenuItem>
            <MenuItem value={3}>Wednesday</MenuItem>
            <MenuItem value={4}>Thursday</MenuItem>
            <MenuItem value={5}>Friday</MenuItem>
            <MenuItem value={6}>Saturday</MenuItem>
            <MenuItem value={7}>Sunday</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <input
            id="start"
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <input
            id="end"
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <TextField
            variant="outlined"
            value={newURL}
            onChange={(e) => setNewURL(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateSession(index);
              }
            }}
            placeholder="e.g. https://cornell.zoom.us/j/123?pwd=123"
          />
        </TableCell>
        <TableCell>
          <Button
            onClick={() => { updateSession(index); }}
            style={{ display: "inline" }}
          >
            Save Edits
          </Button>
        </TableCell>
      </TableRow> :
      <TableRow key={index}>
        <TableCell>
          {<p>{session.name}</p>}
        </TableCell>
        <TableCell>
          {DateTime.local().set({ weekday: session.weekday }).toLocaleString({ weekday: "long" })}
        </TableCell>
        <TableCell>
          {DateTime.local().set({ hour: session.startHour, minute: session.startMinute }).toLocaleString({ hour: "numeric", minute: "numeric" })}
        </TableCell>
        <TableCell>
          {DateTime.local().set({ hour: session.endHour, minute: session.endMinute }).toLocaleString({ hour: "numeric", minute: "numeric" })}
        </TableCell>
        <TableCell>
          <a href={session.url}>{session.url}</a>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => { setEditing(index, true); }} style={{ display: "inline" }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => { deleteSession(index) }} style={{ display: "inline" }}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
  }

  const LinkRow = ({ link, index, deleteLink, editing, setEditing }: LinkRowProps) => {
    const [newLinkName, setNewLinkName] = useState(link.name);
    const [newLinkURL, setNewLinkURL] = useState(link.url);

    const updateLink = (index: number) => {
      if (newLinkName !== "" && newLinkURL !== "") {
        const newLink: Link = {
          name: newLinkName,
          url: newLinkURL,
        }
        let linksCopy = [...links];
        linksCopy[index] = newLink;
        setLinks(linksCopy);
        setEditing(index, false);
      }
    }

    return editing ?
      <TableRow>
        <TableCell>
          <TextField
            variant="outlined"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
            placeholder="e.g. Canvas discussions"
          />
        </TableCell>
        <TableCell>
          <TextField
            variant="outlined"
            value={newLinkURL}
            onChange={(e) => setNewLinkURL(e.target.value)}
            placeholder="e.g. https://canvas.cornell.edu/"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateLink(index);
              }
            }}
          />
        </TableCell>
        <TableCell>
          <Button onClick={() => { updateLink(index); }}>
            Save Edits
          </Button>
        </TableCell>
      </TableRow> :
      <TableRow key={index} >
        <TableCell>
          <p style={{ display: "inline" }}>{link.name + " "}</p>
        </TableCell>
        <TableCell>
          <a href={link.url} style={{ display: "inline" }}>{link.url}</a>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => { setEditingLinkRow(index, true); }} style={{ display: "inline" }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => { deleteLink(index) }}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
  }

  const parseHour = (time: string) => {
    return parseInt(time.substring(0, time.indexOf(":")));
  }
  const parseMin = (time: string) => {
    return parseInt(time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3));
  }

  const addSession = () => {
    if (sessionName !== "" && sessionURL !== "" && startTime !== "" && endTime !== "") {
      const newSession: LiveSession = {
        name: sessionName,
        url: sessionURL,
        weekday: weekday,
        startHour: parseHour(startTime),
        startMinute: parseMin(startTime),
        endHour: parseHour(endTime),
        endMinute: parseMin(endTime)
      }
      setLiveSessions([...liveSessions, newSession]);
    }
  }

  const addLink = () => {
    const newLink: Link = {
      name: linkName,
      url: linkURL
    }
    setLinks([...links, newLink]);
  }

  const deleteSession = (index: number) => {
    const sessionsCopy = [...liveSessions];
    sessionsCopy.splice(index, 1);
    setLiveSessions(sessionsCopy);
  }

  const deleteLink = (index: number) => {
    const linksCopy = [...links];
    linksCopy.splice(index, 1);
    setLinks(linksCopy);
  }

  const clearInputs = () => {
    setName("");
    setLiveSessions([]);
    setURL("");
    setSessionName("");
    setWeekday(1);
    setStartTime("");
    setEndTime("");
    setLinks([]);
    setLinkName("");
    setLinkURL("");
  }

  const clearAndClose = () => {
    clearInputs();
    close();
  }

  const setEditingSessionRow = (index: number, bool: boolean) => {
    const editingRowsCopy = [...editingSessions];
    editingRowsCopy[index] = bool;
    setEditingSessions(editingRowsCopy);
  }

  const setEditingLinkRow = (index: number, bool: boolean) => {
    const editingRowsCopy = [...editingLinks];
    editingRowsCopy[index] = bool;
    setEditingLinks(editingRowsCopy);
  }

  const activity: Activity = {
    name: name,
    liveSessions: liveSessions,
    links: links,
    docID: creating ? "TEMP" : originalActivity ? originalActivity.docID : "ERROR"
  }

  return <Dialog open={isOpen} onClose={clearAndClose} maxWidth="lg" >
    <DialogContent style={{ padding: 36 }}>
      <h1>{creating ? "Create a new activity" : "Edit " + originalActivity?.name}</h1>

      <h2>Name</h2>
      <TextField
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. CS 3110"
      />

      <h2>Live Sessions</h2>
      <Table aria-label="live session table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Meeting link</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {liveSessions.map((session, index) =>
            <SessionRow key={session.name + session.weekday + session.startHour + session.startMinute + session.endHour + session.endMinute + session.url} session={session} index={index} deleteSession={deleteSession} editing={editingSessions[index]} setEditing={setEditingSessionRow} />
          )}
          <TableRow>
            <TableCell>
              <TextField
                variant="outlined"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. Lecture"
              />
            </TableCell>
            <TableCell>
              <Select
                id="end"
                type="time"
                value={weekday}
                onChange={(e) => setWeekday(e.target.value as number)}
              >
                <MenuItem value={1}>Monday</MenuItem>
                <MenuItem value={2}>Tuesday</MenuItem>
                <MenuItem value={3}>Wednesday</MenuItem>
                <MenuItem value={4}>Thursday</MenuItem>
                <MenuItem value={5}>Friday</MenuItem>
                <MenuItem value={6}>Saturday</MenuItem>
                <MenuItem value={7}>Sunday</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <input
                id="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <input
                id="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                variant="outlined"
                value={sessionURL}
                onChange={(e) => setURL(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSession();
                  }
                }}
                placeholder="e.g. https://cornell.zoom.us/j/123?pwd=123"
              />
            </TableCell>
            <TableCell>
              <Button
                onClick={addSession}
                style={{ display: "inline" }}
              >
                Add
            </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2>Links</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        {links.map((link, index) =>
          <LinkRow key={name + link} link={link} index={index} editing={editingLinks[index]} setEditing={setEditingLinkRow} deleteLink={deleteLink} />
        )}
        <TableBody>
          <TableRow>
            <TableCell>
              <TextField
                variant="outlined"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="e.g. Canvas discussions"
              />
            </TableCell>
            <TableCell>
              <TextField
                variant="outlined"
                value={linkURL}
                onChange={(e) => setLinkURL(e.target.value)}
                placeholder="e.g. https://canvas.cornell.edu/"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <Button onClick={addLink}>
                Add
          </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (creating && addActivity) {
            addActivity(activity);
          }
          else if (!creating && originalActivity && updateActivity) {
            updateActivity(originalActivity, activity);
          }
          clearAndClose();
        }}
        style={{ marginTop: 16, marginRight: 16 }}>
        {creating ? "Create activity" : "Finish editing"}
      </Button>
      <Button
        onClick={clearAndClose}
        style={{ marginTop: 16 }}>
        Close
      </Button>
    </DialogContent>
  </Dialog >

}

export default ActivityDialog;