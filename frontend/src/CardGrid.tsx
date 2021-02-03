import React, { useState } from 'react';
import ActivityCard from './ActivityCard';
import Grid from '@material-ui/core/Grid';
import { Activity } from '../../types/Types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ActivityDialog from './ActivityDialog';

type CardGridProps = {
  activities: Activity[],
  deleteActivity: (activity: Activity) => void,
  updateActivity: (originalActivity: Activity, newActivity: Activity) => void
}

const CardGrid = (props: CardGridProps) => {
  const [editing, setEditing] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  const { activities, deleteActivity, updateActivity } = props;
  return <div>
    <Grid container spacing={2} style={{ marginTop: 16, marginBottom: 16 }}>
      {activities.map((activity, index) =>
        <Grid key={activity.docID} item lg={3} md={4} sm={6} xs={12}>
          <ActivityCard
            activity={activity}
            startDelete={() => {
              setActivityToDelete(activity);
              setDeleting(true);
            }}
            startEdit={() => {
              setActivityToEdit(activity);
              setEditing(true);
            }}
          />
        </Grid>)}
    </Grid>
    {deleting &&
      <Dialog
        open={deleting}
        onClose={() => { setDeleting(false) }}
      >
        <h1 style={{ margin: 16 }}>{"Delete " + activityToDelete?.name + "?"} </h1>
        <p style={{ margin: 16 }}>This card will be deleted permanently.</p>
        <DialogActions>
          <Button onClick={() => setDeleting(false)}>
            No, cancel
        </Button>
          <Button
            onClick={() => {
              if (activityToDelete) {
                deleteActivity(activityToDelete);
                setActivityToDelete(null);
                setDeleting(false);
              }
            }}
            color="primary"
            autoFocus>
            Yes, delete card
        </Button>
        </DialogActions>
      </Dialog>}
    {editing && activityToEdit && <ActivityDialog
      creating={false}
      originalActivity={activityToEdit}
      isOpen={editing}
      close={() => { setEditing(false) }}
      updateActivity={updateActivity}
    ></ActivityDialog>}
  </div>
}

export default CardGrid;