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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const cities = [{
    value: 'Tehran',
    label: 'تهران',
  },
  {
    value: 'Mashhad',
    label: 'مشهد',
  },
  {
    value: 'Kish',
    label: 'کیش',
  },
  {
    value: 'Kerman',
    label: 'کرمان',
  },
  {
    value: 'Shiraz',
    label: 'شیراز',
  },
  {
    value: 'Ahwaz',
    label: 'اهواز',
  },
  {
    value: 'Isfahan',
    label: 'اصفهان',
  },
  {
    value: 'Tabriz',
    label: 'تبریز',
  },
];

export default class SelectTextFields extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        origin: 'Tehran',
        destination: 'Tabriz',
        date: null,
        flights: [],
      }
    }

    async displayResult() {
      const response = await fetch("http://127.0.0.1:5000/get_data?origin="+this.state.origin+"&destination="+this.state.destination+"&departure="+this.state.date, {
        mode: 'cors'
      });
      const data = await response.json()
      console.log(response)
      this.setState({
        flights: Object.values(data)
      })

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
        }
      } else {
        this.setState({
          date: event
        });
      }
    };

  searchResult = () => {
    let rows = [];
    let ontimedness = 0;

    rows.push(
    <Box sx={{ bgcolor: 'background.paper', position: 'relative', top:"55%", left:"20%", width: '60%'}}>
      <Grid container spacing={2}>
        <Grid item xs={8}/>
        <Grid item xs={4}>
          <Box
            sx={{
              width: 300,
              height: 300,
              bgcolor: 'primary.main',
            }}
          />
        </Grid>
      </Grid>
    </Box>)

    for (let i=0, len = this.state["flights"].length - 1; i < len; i++) {
      
      ontimedness = this.state["flights"][i]["ontime_or_delayed"];

      rows.push(
        <Box sx={{ bgcolor: 'background.paper', position: 'relative', top:"55%", left:"20%", width: '60%'}}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <Grid container spacing={2} direction='column'>
                    <Grid item textAlign='center' color='primary.main'>
                      price: {this.state["flights"][i]["price"]}
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
                      From: {this.state.origin}
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={4} textAlign='center'>
                      ...
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={2} textAlign='center'>
                      To: {this.state.destination}
                    </Grid>
                    <Grid item xs={6} textAlign='center' color='error.main'>
                    </Grid>
                    <Grid item xs={6} textAlign='center'>
                      {(() => {
                      if (ontimedness !== 0) {
                        return (
                          ontimedness == 1 ? <Typography color='success.main'>usually ontime</Typography>:<Typography color='error.main'>usually delayed</Typography>
                        )
                      }}) ()}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              And the info is
            </AccordionDetails>
          </Accordion>
        </Box>);
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
