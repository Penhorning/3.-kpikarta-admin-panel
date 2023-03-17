import * as React from 'react';
import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { UserService } from "../../../shared/_services";
import { useSnackbar } from 'notistack';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import DatePicker from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import 'globalthis/auto';
import './chart.scss'

const initialValue = {
  from: "",
  to: "",
};

export default function Chart() {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState(initialValue);
  const [isShown, setIsShown] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const [defaultData, setDefaultData] = useState([])
  const [selected, setSelected] = useState({ startDate: moment().subtract('14', 'days'), endDate: moment()});
  const [salesChartData, setSalesChartData] = useState({
    dates: [],
    dateObject: [],
    totalSales: []
  })

  const defaultFrom = {
    year: +moment(selected.startDate._d).format("YYYY"),
    month: +moment(selected.startDate._d).format("MM"),
    day: +moment(selected.startDate._d).format("DD"),
  };

  const defaultTo = {
    year: +moment(selected.endDate._d).format("YYYY"),
    month: +moment(selected.endDate._d).format("MM"),
    day: +moment(selected.endDate._d).format("DD"),
  };

  const defaultValue = {
    from: defaultFrom,
    to: defaultTo,
  };

  const [selectedDayRange, setSelectedDayRange] = useState(defaultValue);

  const daysCounter = (selectedDate) => {
    let start;
    let end;
    let difference = 0;
    salesChartData.dates = [];
    salesChartData.dateObject = [];
    start = moment(selectedDate.from);
    end = moment(selectedDate.to);
    difference = end.diff(start, 'days');
    while (difference >= 0) {
      salesChartData.dates.push(moment(end).subtract(difference, "days").format("YYYY-MM-DD"));
      salesChartData.dateObject.push(moment(end).subtract(difference, "days").format());
      difference--;
    }
  }

  const handleDateChange = async (event) => {
    setIsShown(true)
    setSelectedDayRange(event);
    if (event.to) {
      let selectedDate = {
        from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
        to: moment({ ...event.to, month: event.to.month - 1 }).endOf("day").toDate()
      }
      setDateRange({
        from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
        to: moment({ ...event.to, month: event.to.month - 1 }).endOf("day").toDate()
      });
      daysCounter(selectedDate);
    }
  };

  const fetchData = (dateRange) => {
    if (dateRange.from && dateRange.to) {
      var data = {
        start: dateRange.from,
        end: dateRange.to,
      }
      UserService.getAllInvoicesChart(data, enqueueSnackbar).then((response) => {
        if (!response.error) {
          if (response.data.length > 0) {
            // Hash map preparing
            var salesChartObject = {};
            // Setting keys
            for (let i = 0; i < salesChartData.dates.length; i++) {
              salesChartObject[moment(salesChartData.dateObject[i] ).format("YYYY-MM-DD")] = 0;
            }
            // Setting values
            for (let j = 0; j < response.data.length; j++) {
              salesChartObject[moment(response.data[j].invoice_date, "MM-DD-YYYY").format("YYYY-MM-DD")] = response.data[j].amount;
            }
            // Converting hash map to array
            let transactionData = Object.keys(salesChartObject).map((item) => {
                return {
                  'invoice_date': moment(item).format('DD-MMM-YY'),
                  'amount': salesChartObject[item]
                }
            })
            setDefaultData()
            setTransactionData(transactionData)
          } else {
            for (let i = 0; i < salesChartData.dates.length; i++) {
              setDefaultData(
                defaultData => [...defaultData, {
                  'invoice_date': moment(salesChartData.dates[i]).format('DD-MMM-YY'),
                  'amount': 0
                }]
              )
              salesChartData.totalSales[i] = 0;
            }
          }
        } else if (response.error.statusCode === 400) {
          let variant = 'error';
          enqueueSnackbar("Something went worng", { variant });
        }
      })
    }
  }

  useEffect(() => {
    setDateRange({
      from: selected.startDate._d,
      to: selected.endDate._d
    });

    daysCounter({
      from: selected.startDate._d,
      to: selected.endDate._d
    })
    return () => {
    };
  }, []);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchData(dateRange)
    }
    return () => {
    };
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

  const formatter = (value) => `$ ${value}`;

  const handleDateFilterCancel = (event) => {
    event.preventDefault();
    selectedDayRange.from = ''; selectedDayRange.to = ''
    setIsShown(false)
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{border: '2px solid #bbb3b3' , borderRadius:"5px" }}>
          <p className="label" style={{ paddingTop: '8px',  paddingLeft: '8px',  paddingRight: '8px' }}>{`${label}`}</p>
          <p className="desc" style={{color:"rgb(25, 118, 210)", paddingLeft: '8px',  paddingRight: '8px'}}>{`Sales : $ ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
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
          data={transactionData.length > 0 ? transactionData : defaultData}
          margin={{
            top: 16,
            right: 16,
            bottom: 40,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <Legend
            wrapperStyle={{ fontWeight: 600 }}
            layout="horizontal"
            verticalAlign="top"
            align="center" />
           <Tooltip content={<CustomTooltip />}  />
          <XAxis
            dataKey="invoice_date"
            stroke={theme.palette.text.secondary}
            style={{ fontWeight: 500 }}
            angle={-40}
            dx={10}
            textAnchor="end"
            interval="preserveEnd"
          >
          </XAxis>
          <YAxis
            stroke={theme.palette.text.secondary}
            tickFormatter={formatter}
            interval="preserveEnd"
            style={{ fontWeight: 500 }}
          >
            <Label
              angle={270}
              position="left"
              style={{
                fontWeight: 500,
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Revenue
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
            name="Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
