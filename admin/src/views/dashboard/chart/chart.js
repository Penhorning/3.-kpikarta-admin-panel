import * as React from 'react';
import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { UserService } from "../../../shared/_services";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import DatePicker from "react-modern-calendar-datepicker";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import './chart.scss'


const initialValue = {
  from: "",
  to: "",
};

export default function Chart() {
  const theme = useTheme();
  const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [dateRange, setDateRange] = useState(initialValue);
  const [isShown, setIsShown] = useState(false)
  const [data, setData] = useState([]);

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

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
    //   let start
    // let end
    // let difference = 0;
    // let salesChartDataDates = [];
    // let salesChartDatDateObject = [];
    // start = moment(dateRange.from);
    // end = moment(dateRange.to);
    // difference = end.diff(start, 'days');
    // while (difference >=0 ) {
    //   salesChartDataDates.push(moment(end).subtract(difference, "days").format("DD/MMM/YY"));
    //   salesChartDatDateObject.push(moment(end).subtract(difference, "days").format());
    //   difference--;
    // }

    // salesChartDataDates.map((item, idx)=>{
    //   // setData(Object.assign({['time']: e}))
    //   let floors = [];
    //   floors.push({ time: item, amount: idx });
    //   setData(floors)
    //  return
    // })
      
    // let data = {
    //   start: dateRange.from,
    //   end: dateRange.to,
    // }
    // UserService.getAll(data, enqueueSnackbar).then((response) => {
    //   if (!response.error) {
    //     setUsers(response.users[0].data);
    //     if (response.users[0].metadata.length > 0) {
    //       setTotal(response.users[0].metadata[0].total);
    //     } else {
    //       setTotal(0);
    //     }
    //     setLoading(false)
    //   } else if (response.error.statusCode === 400) {
    //     let variant = 'error';
    //     enqueueSnackbar("Something went worng", { variant });
    //   }
    // })

    }
  }, [dateRange.to]);

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
    <React.Fragment>
      <Container>
        <Grid container spacing={12}>
          <Grid item xs={4} >
          </Grid>
          <Grid item xs={4} >
            <Paper component="div"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 282 }}
            >
              <DatePicker
                style={{ position: "relative", zIndex: "999" }}
                value={selectedDayRange}
                onChange={handleDateChange}
                inputPlaceholder="Select created date range"
                shouldHighlightWeekends
                colorPrimary={'#296BB5'}
                maximumDate={maximumDate}
                renderInput={customDateInput}
              />
              {isShown &&
                <>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton
                    color="primary"
                    sx={{ p: '10px' }}
                    onClick={handleDateFilterCancel}
                  >
                    <ClearIcon />
                  </IconButton>
                </>
              }
            </Paper>
          </Grid>
          <Grid item xs={4} >
          </Grid>
        </Grid>
      </Container>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 40,
            left: 24,
          }}
        >
          <Tooltip />
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            angle={-40}
            dx={10}
            interval={0}
            textAnchor="end"
          >
          </XAxis>
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            interval="preserveStart"
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Revenue
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
