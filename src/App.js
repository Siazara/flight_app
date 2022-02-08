import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ReactDOM from 'react-dom';
import ListItemButton from '@mui/material/ListItemButton';
import InfoIcon from '@mui/icons-material/Info';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import Button from '@mui/material/Button';
import {
  Grid,
  IconButton
} from '@mui/material';
import {
  Stack
} from '@mui/material';
import {
  Collapse
} from '@mui/material';
import AdapterJalali from '@date-io/date-fns-jalali';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const cities = [{
    value: 'Tehran',
    label: 'Tehran',
  },
  {
    value: 'Mashhad',
    label: 'Mashhad',
  },
  {
    value: 'Kish',
    label: 'Kish',
  },
  {
    value: 'Kerman',
    label: 'Kerman',
  },
  {
    value: 'Shiraz',
    label: 'Shiraz',
  },
  {
    value: 'Ahwaz',
    label: 'Ahwaz',
  },
  {
    value: 'Isfahan',
    label: 'Isfahan',
  },
  {
    value: 'Tabriz',
    label: 'Tabriz',
  },
];

export default class SelectTextFields extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        origin: 'Tehran',
        destination: 'Mashhad',
        date: null,
        flights: [],
        checks: [],
      }
    }

    async displayResult() {
      const response = await fetch("http://127.0.0.1:5000/delay", {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          origin: 'Tehran',
          destination: 'Mashhad',
          departure: "2022-01-24"
        })
      });
      const data = await response.json()
      this.setState({
        flights: Object.values(data)
      })
      let checks = [];

      for (let i = 0, len = this.state["flights"].length; i < len; i++) {
        checks[i] = false;
      }

      this.setState({
        checks: checks
      });

      this.searchResult()
    };

    handleChange = (event) => {
      if (event.target !== undefined) {
        if (event.target.name === 'origin') {
          this.setState({
            origin: event.target.value
          });
        } else if (event.target.name === 'destination') {
          this.setState({
            destination: event.target.value
          });
        } else if (event.target.name === 'date') {
          this.setState({
            date: event.target.value
          });
        } else if (typeof event.currentTarget.name === 'string') {
          const checks = this.state["checks"];
          checks[event.currentTarget.name] = !checks[event.currentTarget.name]
          this.setState({
            checks: checks
          });
          this.searchResult()
        }
      } else {
        this.setState({
          date: event
        });
      }
    };

  searchResult = () => {
    let rows = [];
    for (let i=0, len = this.state["flights"].length; i < len; i++) {
      
      rows[i] = (
        <Stack
          spacing={"2%"}
          sx={{ bgcolor: 'background.paper', position: 'relative', top:"55%", left:"20%", width: '60%'}}
          direction='column'>
            <Stack direction='row'>
                <ListItemButton>
                  <Grid container spacing={2}>
                    <Grid item xs={1}>
                      <Grid container spacing={2} direction='column'>
                        <Grid item textAlign='center' color='primary.main'>
                          price: 1,200,000
                        </Grid>
                        <Grid item textAlign='center'>
                          seats: 9
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11}>
                      <Grid container spacing={2}>
                        <Grid item xs={2}/>
                        <Grid item xs={2} textAlign='center'>
                          <FlightTakeoffIcon/>
                        </Grid>
                        <Grid item xs={4}/>
                        <Grid item xs={2} textAlign='center'>
                          <FlightLandIcon/>
                        </Grid>
                        <Grid item xs={2}/>
                        <Grid item xs={2} textAlign='center'>
                          From: Tehran
                        </Grid>
                        <Grid item xs={2}/>
                        <Grid item xs={4} textAlign='center'>
                          ...
                        </Grid>
                        <Grid item xs={2}/>
                        <Grid item xs={2} textAlign='center'>
                          To: Mashhad
                        </Grid>
                        <Grid item xs={6} textAlign='center' color='error.main'>
                          prices may rise
                        </Grid>
                        <Grid item xs={6} textAlign='center' color='success.main'>
                          usually ontime
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItemButton>
                  <IconButton onClick={this.handleChange} name={i} color='inherit' edge='end'>
                    <InfoIcon/>
                  </IconButton>
            </Stack>
              <div>
                <Collapse in={this.state["checks"][i]}>and the info is:</Collapse>
              </div>
        </Stack>);
      };
  
      ReactDOM.render(rows
        , document.getElementById('searchResult'));
  }
render() {
    return (
    <div id='home'>
      <Box id='searchBox'
            sx={{
              position: 'absolute', top:"40%", left:"25%", width: '50%'
            }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
                  id="outlined-select-origin"
                  select
                  label="Origin"
                  name='origin'
                  value={this.state["origin"]}
                  onChange={this.handleChange}
                  helperText="Please select your origin"
                  sx={{ width: '100%' }}
                >
                  {cities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
                  id="outlined-select-destination"
                  select
                  label="Destination"
                  name='destination'
                  value={this.state["destination"]}
                  onChange={this.handleChange}
                  helperText="Please select your destination"
                  sx={{ width: '100%' }}
                >
                  {cities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterJalali}
                  name='date'
                  sx={{ width: '100%' }}>
              <DatePicker
                name='date'
                label="Departure"
                value={this.state["date"]}
                onChange={this.handleChange}
                renderInput={(params) => <TextField {...params} />}
                sx={{ width: '100%' }}
                />
            </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      <div id='tickets'>
            <Button
              variant='contained'
              onClick={() => this.displayResult()}
              sx={{
                position: 'absolute', top:"50%", left:"42%", width: '16%', height: '5%'
              }}
            >
              Search flights
            </Button>
      </div>
      <div>
       <Box id='searchResult'
            sx={{
              position: 'absolute', top:"60%", left:"0%", width: '100%', height: '5%'
            }}>
       </Box>
      </div>
    </div>
  );
  }
}