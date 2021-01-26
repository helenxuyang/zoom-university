import React from 'react';
import ActivityCard from './ActivityCard';
import Grid from '@material-ui/core/Grid';
import { Activity } from '../../types/Types';

type CardGridProps = {
  activities: Activity[]
}

const CardGrid = ({ activities }: CardGridProps) => {

  return <Grid container spacing={2}>
    {activities.map((course, index) =>
      <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
        <ActivityCard {...course} />
      </Grid>)}
  </Grid>
}

export default CardGrid;