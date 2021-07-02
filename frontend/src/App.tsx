import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import CardGrid from './CardGrid';
import { Activity } from '../../types/Types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import ActivityDialog from './ActivityDialog';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import QuickBar from './QuickBar';

const firebaseConfig = {
  apiKey: "AIzaSyAGNR6HoL7JASA9Vd0oJkcVyepO3W17g0g",
  authDomain: "zoom-university-e7cbf.firebaseapp.com",
  projectId: "zoom-university-e7cbf",
  storageBucket: "zoom-university-e7cbf.appspot.com",
  messagingSenderId: "764889462096",
  appId: "1:764889462096:web:0f3ac059e9b6ab5df66855",
  measurementId: "G-64ZHVN2S3L"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Authenticated = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };

  const onAuthStateChange = () => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        const fetchActivites = async () => {
          axios.get<Activity[]>(`/activities/${user.uid}`)
            .catch((error) => console.log("Error when getting user's activities: " + error))
            .then((res) => {
              if (res) {
                setActivities(res.data);
              }
            });
        }

        const userExists = await axios.get<boolean>(`users/${user.uid}`);
        if (userExists) {
          await fetchActivites();
        }
        else {
          axios.post(`users/${user.uid}`)
            .catch((error) => console.log("Error when creating user: " + error))
            .then((res) => {
              fetchActivites();
            })
        }
      }
    });
  }

  useEffect(() => onAuthStateChange(), []);

  const addActivity = async (activity: Activity) => {
    axios.post<string>(`/activities/${user?.uid}`, activity)
      .catch(error => console.log('Error when adding activity: ' + error))
      .then((res) => {
        if (res) {
          const newID: string = res.data;
          activity.docID = newID;
          setActivities([...activities, activity]);
        }
      });
  }

  const updateActivity = async (originalActivity: Activity, newActivity: Activity) => {
    axios.put<string>(`/activities/${user?.uid}/${originalActivity.docID}`, newActivity)
      .catch(error => console.log('Error when updating activity: ' + error))
      .then((res) => {
        const activitiesCopy = [...activities];
        const index = activitiesCopy.indexOf(originalActivity);
        activitiesCopy[index] = newActivity;
        setActivities(activitiesCopy);
      });
  }

  const deleteActivity = async (activity: Activity) => {
    axios.delete(`/activities/${user?.uid}/${activity.docID}`)
      .catch(error => console.log('Error when deleting activity: ' + error))
      .then((res) => {
        const activitiesCopy = [...activities];
        const index = activitiesCopy.indexOf(activity);
        activitiesCopy.splice(index, 1);
        setActivities(activitiesCopy);
      });
  }

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      setUser(null);
      setActivities([]);
    }).catch((error) => {
      console.log("Error when signing out: " + error);
    });
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ margin: 36 }}>
        {user && (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateDialogOpen(true)}
            >
              Create card
            </Button>
            <QuickBar />
            <ActivityDialog
              creating={true}
              isOpen={createDialogOpen}
              close={() => setCreateDialogOpen(false)}
              addActivity={addActivity}
            />
            <CardGrid
              activities={activities}
              deleteActivity={deleteActivity}
              updateActivity={updateActivity} />
            <Button
              variant="contained"
              onClick={signOut}
            >
              Sign out
              </Button>
          </div>
        )}
        {!user && (
          <div style={{ textAlign: "center" }}>
            <h1>Zoom University</h1>
            <p>A simple link organizer for the remote era</p>
            <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </div>
        )}
      </div>
    </MuiThemeProvider>
  );
};

export default Authenticated;