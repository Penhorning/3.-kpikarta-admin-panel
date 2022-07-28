import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import './suggestion.scss';
import { SuggestionService } from '../../jwt/_services/suggestion.service';


export default function EnhancedTable() {
  const [phases, setPhases] = useState([]);
  const [suggestion, setSuggestion] = useState({});
  const [value, setValue] = React.useState('1');

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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
            <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
            <Tab label="Item Four" value="4" />
            <Tab label="Item Five" value="5" />
            <Tab label="Item Six" value="6" />
            <Tab label="Item Seven" value="7" />
            <Tab label="Item Eight" value="8" />
            <Tab label="Item Nine" value="9" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
        <TabPanel value="5">Item Five</TabPanel>
        <TabPanel value="6">Item Six</TabPanel>
        <TabPanel value="7">Item Seven</TabPanel>
        <TabPanel value="8">Item Eight</TabPanel>
        <TabPanel value="9">Item Nine</TabPanel>
      </TabContext>
    </Box>
          </Typography>
        </Toolbar>
      </Paper>
    </Box>
  );
}



