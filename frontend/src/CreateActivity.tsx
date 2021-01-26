import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { Activity, Link, LiveSession } from '../../types/Types';
import Button from '@material-ui/core/Button';
import { DialogContent, IconButton, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import DeleteIcon from '@material-ui/icons/Delete';
import './CreateActivity.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type CreateActivityProps = {
  isOpen: boolean,
  close: () => void,
  addActivity: (activity: Activity) => void,
}

const CreateActivity = ({ isOpen, close, addActivity }: CreateActivityProps) => {
  const [name, setName] = useState("");

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [url, setURL] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [otherLinks, setOtherLinks] = useState<Link[]>([]);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");

  const parseHour = (time: string) => {
    return parseInt(time.substring(0, time.indexOf(":")));
  }
  const parseMin = (time: string) => {
    return parseInt(time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3));
  }

  const addSession = () => {
    if (startTime !== "" && endTime !== "") {
      const newSession: LiveSession = {
        name: name,
        url: url,
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
    setOtherLinks([...otherLinks, newLink]);
  }

  const deleteSession = (index: number) => {
    const sessionsCopy = [...liveSessions];
    sessionsCopy.splice(index, 1);
    setLiveSessions(sessionsCopy);
  }

  const deleteLink = (index: number) => {
    const linksCopy = [...otherLinks];
    linksCopy.splice(index, 1);
    setOtherLinks(linksCopy);
  }

  const clearInputs = () => {
    setName("");
    setLiveSessions([]);
    setURL("");
    setSessionName("");
    setWeekday(1);
    setStartTime("");
    setEndTime("");
    setOtherLinks([]);
    setLinkName("");
    setLinkURL("");
  }

  const clearAndClose = () => {
    clearInputs();
    close();
  }

  const activity: Activity = {
    name: name,
    liveSessions: liveSessions,
    links: otherLinks
  }

  return <Dialog open={isOpen} onClose={clearAndClose} maxWidth="lg" >
    <DialogContent style={{ padding: 36 }}>
      <h1>Create a new activity</h1>

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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {liveSessions.map((session, index) =>
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
                <a href={session.url}>(link)</a>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => { deleteSession(index) }}
                  style={{ display: "inline" }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>
              <TextField
                variant="outlined"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. Lecture, discussion, lab"
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
                value={url}
                onChange={(e) => setURL(e.target.value)}
                placeholder="e.g. https://zoom.cornell.us/12345"
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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
      </Table>
      {otherLinks.map((link, index) =>
        <TableRow key={index} >
          <TableCell>
            <p style={{ display: "inline" }}>{link.name + " "}</p>
          </TableCell>
          <TableCell>
            <a href={link.url} style={{ display: "inline" }}>(link)</a>

          </TableCell>
          <TableCell>
            <IconButton onClick={() => { deleteLink(index) }}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell>
          <TextField
            variant="outlined"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="e.g. Canvas discussions page"
          />
        </TableCell>
        <TableCell>
          <TextField
            variant="outlined"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
            placeholder="e.g. https://www.canvas.infrastructure.com"
          />
        </TableCell>
        <TableCell>
          <Button onClick={addLink}>
            Add
          </Button>
        </TableCell>
      </TableRow>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          addActivity(activity);
          clearAndClose();
        }}
        style={{ marginTop: 16, marginRight: 16 }}>
        Create activity
      </Button>
      <Button
        onClick={clearAndClose}
        style={{ marginTop: 16 }}>
        Cancel
      </Button>
    </DialogContent>
  </Dialog >

}

export default CreateActivity;