import React from 'react';
import Button from '@material-ui/core/Button';

const StyledButton = (props: any) => (
  <Button
    {...props}
    style={{ ...props.labelStyle, margin: 4 }}
  />
);

export default StyledButton;