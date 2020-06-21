import React,{ useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {server_uri, httpClient} from "Net/requests_info.js"

import PropTypes from 'prop-types';
import AddAlert from "@material-ui/icons/AddAlert";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from "components/Snackbar/Snackbar.js";

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(name, handlers, configs) {
  let hist = []
  console.log("AAA",name,handlers,configs)
  for(let i=0;i<handlers.length;i++){
    hist.push({handlers:handlers[i],
               configs:configs[i]})
  }
  return {
    name,
    history: hist
  };
}


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
      <TableRow>

        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Handlers</TableCell>
                    <TableCell>Clients</TableCell>
                    <TableCell align="right">Configs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.hanlders}>
                      <TableCell component="th" scope="row">
                        {historyRow.handlers}
                      </TableCell>
                      <TableCell>{historyRow.clients}</TableCell>
                      <TableCell align="right">{historyRow.configs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        configs: PropTypes.number.isRequired,
        clients: PropTypes.string.isRequired,
        hanlders: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};



const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    } 
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

const default_services = [
  ["Profile","Handler 1","Config 1"],
  ["","Handler 2","Config 2"],
  ["Customer","Handler 1","Config 1"],
]
// const default_rows = [
//   ["Profile","Handler 1","Config 1"],
//   ["","Handler 2","Config 2"],
//   ["Customer","Handler 1","Config 1"],
// ]

export default function TableList() {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [services, setServices] = useState(default_services);
  const [rows, setRows] = useState();
  const [notification, setNotification] = React.useState(false);
  const [notificationInfo,setNotificationInfo] = useState("");

  const showNotification = (time) => {
    setNotification(true);
    setTimeout(function() {
      setNotification(false);
    }, time);
};
  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    httpClient.get(server_uri+"/get_services")
      .then(result =>{
        console.log(result)
        result = result.data
        const transpose = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));
        let new_servs = [];

        for(var i =0;i<result.length;i++){
          let service = result[i]
          let keys = Object.keys(service)
          let max_length = 1
          let new_serv = {}

          for(var j =0;j<keys.length;j++){
              let row_element = service[keys[j]];
              if(Array.isArray(row_element))
                  max_length = max_length > row_element.length ? max_length:row_element.length;
          }
          for(var j =0;j<keys.length;j++){
            let key = keys[j]
            let row_element = service[key];
            if(Array.isArray(Object.assign(row_element)))
              {console.log("HHHHH:",row_element)
              row_element = row_element.concat(Array(max_length-row_element.length).fill(""))}
            else
            row_element = [row_element].concat(Array(max_length-1).fill(""))
            
            new_serv[key] = row_element
          } 
          new_servs.push(new_serv)
        }
        let new_rows = new_servs.map(service =>  createData(service["name"][0],
                                                  service["handlers"],
                                                  service["configs"]) )  
        setRows(new_rows); 

        new_servs = new_servs.map(service => [service["name"],
                                              service["handlers"],
                                              service["configs"]])

                             
        let new_servs_ = []
        for(var i=0;i<new_servs.length;i++){
          new_servs_ = new_servs_.concat(transpose(new_servs[i]) )
          console.log(transpose(new_servs[i]))
          console.log(new_servs[i])
        }

      setIsLoaded(true);
      setServices(new_servs_);
      },
        (error) => {
          let response = error.response ? error.response.data: error.response
          let status = error.response ? error.response.status: error.response
          setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
          showNotification(100000)
        })
  },[])

  // const rows = [
  //   createData('Client'),
  //   createData('Developer'),
  //   createData('Eclair'),
  //   createData('Cupcake'),
  //   createData('Gingerbread'),
  // ];
  
  function CollapsibleTable() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Service</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows ? rows.map((row) => (
              <Row key={row.name} row={row} />
            )): ""}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  
    
        
  return (
    <>
        <Snackbar
            place="bc"
            color={notificationInfo["type"]}
            icon={AddAlert}
            message={notificationInfo['message']}
            open={notification}
            closeNotification={() => setNotification(false)}
            close
          />
    <GridContainer>



      <GridItem xs={12} sm={12} md={12}>
      <Card>
      <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Services list</h4>
            <p className={classes.cardCategoryWhite}>
              Here is the services
            </p>
          </CardHeader>

          <CardBody>
          <CollapsibleTable />
          </CardBody>
        </Card>
      </GridItem>
      
    </GridContainer>

  </>
  );
}
