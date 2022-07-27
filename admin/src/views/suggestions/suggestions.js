import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import './suggestion.scss';
import { SuggestionService } from '../../jwt/_services/suggestion.service';


export default function EnhancedTable() {
  const [phases, setPhases] = useState([]);
  const [suggestion, setSuggestion] = useState({});

  // Get phases
  const getPhases = () => {
    SuggestionService.getPhases().then(response => {
      setPhases(response);
      getSuggestion(response[0].id);
    });
  }
  // Get suggestion
  const getSuggestion = (phaseId) => {
    SuggestionService.getSuggestion({phaseId}).then(response => {
      setSuggestion(response);
    });
  }

  useEffect(() => {
    getPhases();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 20%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Suggestions
          </Typography>
        </Toolbar>
      </Paper>
    </Box>
  );
}



