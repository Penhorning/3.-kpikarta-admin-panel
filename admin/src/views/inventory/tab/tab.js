import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Inventory from '../inventory';
import NodeTab from '../karta/kartas'
import { useParams } from 'react-router-dom';
import './tab.scss'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const { id } = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" id="user_tab">
            <Tab label="Inventory" value="1" />
            <Tab label="Kartas" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1"><Inventory/></TabPanel>
        <TabPanel value="2"><NodeTab/></TabPanel>
      </TabContext>
    </Box>
  );
}