import React, { useState } from 'react';
import './App.css';
import ActivityCard from './ActivityCard';
import Grid from '@material-ui/core/Grid';
import { Activity } from './Types';
import StyledButton from './StyledButton';
import CreateActivity from './CreateActivity';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#4300b8"
      },
      secondary: {
        main: "#2d007a"
      }
    }
  });
  const tempActivities: Activity[] = [
    {
      name: "CS 4450",
      liveSessions: [
        {
          name: "Lecture",
          weekday: 1,
          startHour: 19,
          startMinute: 30,
          endHour: 20,
          endMinute: 45,
          url: "http://www.google.com"
        }
      ],
      links: [
        {
          name: "Canvas",
          url: "http://www.google.com"
        }
      ]
    },
    {
      name: "CS 3420",
      liveSessions: [
        {
          name: "Lecture",
          url: "http://www.google.com",
          weekday: 2,
          startHour: 13,
          startMinute: 0,
          endHour: 14,
          endMinute: 15
        }
      ],
      links: []
    }
  ];

  const [activities, setActivities] = useState<Activity[]>(tempActivities);

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
  }

  const [creatingCard, setCreatingCard] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        {creatingCard && <CreateActivity isOpen={creatingCard} close={() => setCreatingCard(false)} addActivity={addActivity} />}
        <StyledButton
          onClick={() => { setCreatingCard(true); }}
        >
          Add a card
      </StyledButton>
        <Grid container spacing={2}>
          {activities.map((course, index) => <Grid key={index} item lg={3} md={4} sm={6} xs={12}><ActivityCard {...course} /></Grid>)}
        </Grid>
      </div>
    </MuiThemeProvider>

  );
}

export default App;
