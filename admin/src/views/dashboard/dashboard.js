import React, { useState, useEffect } from "react";
import { UserService } from "../../shared/_services";
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './chart/chart'
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import DatePicker from "react-modern-calendar-datepicker"
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Toolbar from '@mui/material/Toolbar';
import 'globalthis/auto';
import './chart/chart.scss'

const initialValue = {
  from: "",
  to: "",
};

const Dashboard = () => {
  const [count, setCount] = useState('.');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [dateRange, setDateRange] = useState(initialValue);
  const [free, setFree] = useState('.');
  const [paid, setPaid] = useState('.');
  const [isShown, setIsShown] = useState(false)

  function getUserCount() {
    UserService.getUserCount(enqueueSnackbar).then(response => {
      if (!response.error) {
        setCount(response.count);
      } else if (response.error.statusCode === 400) {
        let variant = 'error';
        enqueueSnackbar("Something went worng", { variant });
      }
    })
    UserService.getUserLicenseCount(enqueueSnackbar).then(response => {
      if (!response.error) {
        setPaid(response.count.Paid);
        setFree(response.count.Free);
      } else if (response.error.statusCode === 400) {
        let variant = 'error';
        enqueueSnackbar("Something went worng", { variant });
      }
    })
  }

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  useEffect(() => {
    getUserCount();
  }, [])


  const handleDateChange = async (event) => {
    setIsShown(true)
    setSelectedDayRange(event);
    if (event.to) {
      setDateRange({
        from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
        to: moment({ ...event.to, month: event.to.month - 1 }).endOf("day").toDate(),
      });
    }
  };

  const maximumDate = {
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    year: new Date().getFullYear()
  }

  // DATE CODES  
  const customDateInput = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="Select created date range"
      value={
        selectedDayRange.from && selectedDayRange.to
          ? `From ${selectedDayRange.from.month}/${selectedDayRange.from.day}/${selectedDayRange.from.year} To ${selectedDayRange.to.month}/${selectedDayRange.to.day}/${selectedDayRange.to.year}`
          : ""
      }
      className="date__input"
    />
  );

  const handleDateFilterCancel = (event) => {
    event.preventDefault();
    setSelectedDayRange(initialValue);
    setDateRange(initialValue);
    dateRange.from = dateRange.to = '';
    setIsShown(false)
    // fetchData();
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center round">
                  <i className="mdi mdi-account-multiple" />
                </div>
                <div className="ml-2 align-self-center">
                  <h3 className="mb-0 font-lgiht">{count == '.' ? 0 : count}</h3>
                  <h5 className="text-muted mb-0">Total Users</h5>
                </div>
              </div>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center" style={{backgroundColor:'#28a745'}}>
                  <i className="mdi mdi-account-multiple" />
                </div>
                <div className="ml-2 align-self-center">
                  <h3 className="mb-0 font-lgiht">{paid == '.' ? 0 : paid}</h3>
                  <h5 className="text-muted mb-0">Paid Users</h5>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex flex-row">
                <div className="round round-lg align-self-center round-warning">
                  <i className="mdi mdi-account-multiple" />
                </div>
                <div className="ml-2 align-self-center">
                  <h3 className="mb-0 font-lgiht">{free == '.' ? 0 : free}</h3>
                  <h5 className="text-muted mb-0">Free Users</h5>
                </div>
              </div>
            </Paper>
          </Grid>
          {/* <Grid item xs={12} >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 500,
              }}
            >
              <Chart />
            </Paper>
          </Grid> */}
        </Grid>
      </Container>
    </Card>
  );
}

export default Dashboard;
