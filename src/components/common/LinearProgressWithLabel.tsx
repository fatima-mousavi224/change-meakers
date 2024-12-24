import * as React from 'react';
import LinearProgress, {
  LinearProgressProps
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <span className="text-sm mx-1">uploading</span>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

interface LinearWithValueLabelProps {
  progress: number;
  isLoading: boolean;
}

export default function LinearWithValueLabel({
  progress,
  isLoading
}: LinearWithValueLabelProps) {
  return (
    <Box sx={{ width: '100%', marginY: '3px' }}>
      {isLoading ? (
        <LinearProgressWithLabel
          value={isLoading ? progress : 0}
          color="inherit"
        />
      ) : (
        ''
      )}
    </Box>
  );
}
