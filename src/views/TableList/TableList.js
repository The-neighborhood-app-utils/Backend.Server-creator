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

import Button from "components/CustomButtons/Button.js";
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


import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Backdrop from '@material-ui/core/Backdrop';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Editor from "views/Editor"

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialogSlide({ history, message, agree,disagree}) {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Внимание"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{handleClose();}} color="primary">
            Disagree
          </Button>
          <Button onClick={()=>{handleClose(); if(agree) agree();}}color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
}


const COLORS = {
  "service":"#FF7400",
  "config":"#33CCCC",
  "handler": "#FF4040",
  "config":"#923367"
}


const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  exampleWrapper: {
    // position: 'relative',
    // marginTop: theme.spacing(3),
    // height: 380,
  },
  speedDial: {
    // '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    //   bottom: theme.spacing(2),
    //   right: theme.spacing(2),
    // },
    // '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    //   top: theme.spacing(2),
    //   left: theme.spacing(2),
    // },
  },
}));



function SpeedDialCustom(props){
  const {object, history, service, object_type, setOpenBackdrop} = props;
  const [openSpeedDeal, setOpenSpeedDeal] = React.useState(false);
  const [openEditor, setOpenEditor] = React.useState(false);
  const [needDownload, setNeedDownload] = React.useState(false);
  const [handler, setHandler] = React.useState(false);
  const [file, setFile] = React.useState();
  const [showDeleter, setShowDeleter] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const [notificationInfo,setNotificationInfo] = useState("");

  const showNotification = (time) => {
    setNotification(true);
    setTimeout(function() {
      setNotification(false);
    }, time);
};

  const request_to_object = object_type == "handler" ? "/get_handler": 
                            object_type == "client"  ? "/get_client":
                            object_type == "config"  ? "/get_config":
                            object_type == "service"  ? "/get_service":
                            null;
  if(!request_to_object){
    setNotificationInfo({message:"Incorrect object type!",type:"danger"})
    showNotification(6000)
    return;
  }

  let uploader = (file)=>{
    const url = server_uri+"/update_"+object_type;
    const formData = new FormData();
    formData.append('file',file);
    formData.append('name',service);
    if(object_type != "service")
      formData.append(object_type+'_name',object);
    console.log("UPPLOADER",file)
    const config = {
        headers: {
            'Content-type': 'apllication/json',
        }
    }
    
    return  httpClient.post(url, formData,config)
  }

  let deleter = ()=>{
    if(object_type == "service"){
      setNotificationInfo({message:"Сервисы удаляем только вручную!",type:"danger"})
      showNotification(6000);
      return;
    }
    const url = server_uri+"/delete_"+object_type+"/"+service+"/"+object;
    httpClient.post(url).then(
      (response)=>{
        setNotificationInfo({message:object_type+ " was deleted!",type:"info"})
        showNotification(6000);
        setOpenEditor(false);
        window.location.reload(false);
      }, error =>{
        let response = error.response ? error.response.data: error.response
        let status = error.response ? error.response.status: error.response
        setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
        showNotification(1000000)
      }
    )
  }

  console.log("UPLOADER", file)
  let update_object = (file)=>{
    if(!file){
      setNotificationInfo({message:"File not uploaded!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!service){
      setNotificationInfo({message:"Service name is required!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!object && object_type != "service"){
      setNotificationInfo({message:object_type+ " name is required!",type:"danger"})
      showNotification(6000)
      return;
    }


    uploader(file).then((response)=>{
      setNotificationInfo({message:object_type+ " was updated!",type:"info"})
      showNotification(6000);
      setOpenEditor(false);
    }, error =>{
      let response = error.response ? error.response.data: error.response
      let status = error.response ? error.response.status: error.response
      setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
      showNotification(1000000)
    })
  }

  // if(file) update_object();
  // console.log("FIIIIILE:",file);


  let onUpload = (file)=>{
    if(!file){
      setNotificationInfo({message:"File not uploaded!",type:"danger"})
      showNotification(6000)
      return;
    }
    update_object(file);
  };
  // setNotificationInfo({message:"File was uploaded!",type:"info"})
  // showNotification(6000)

  console.log("SPPEED",openSpeedDeal);
  const actions = [
    { icon: <EditIcon />, name: 'Edit', handler:()=>{setOpenEditor(true);}},
    { icon: <DeleteIcon />, name: 'Delete', handler:()=>{setShowDeleter(true);} },
  ];

  
  const handleClose = () => {
    setOpenSpeedDeal(false);
    // setOpenBackdrop(false);
  };

  const handleOpen = () => {
    setOpenSpeedDeal(!openSpeedDeal);
    // setOpenSpeedDeal(true);
  };

  return (
    <>
  {
    showDeleter ? 
    <AlertDialogSlide message={"Вы действительно хотите удалить "+object_type+":"+service+"/"+object+" ?"} agree={deleter}
  /> : ""
  }

  

            <Snackbar
            place="bc"
            color={notificationInfo["type"]}
            icon={AddAlert}
            message={notificationInfo['message']}
            open={notification}
            closeNotification={() => setNotification(false)}
            close
          />
  {/* <Backdrop open={openSpeedDeal} /> */}
  { openEditor ?
      <Editor handler={onUpload} handlerName={"Update "+object_type} outsideOpenSet={setOpenEditor} setNeedDownload={setNeedDownload} hideButton={true} linkForDownload={server_uri+request_to_object+"/"+service
      +(object_type != "service" ? "/"+object: "")}/>:
      ""
      }
    <Button  onClick={handleOpen} style={{position:"relative", color:"white",background:COLORS[object_type]}}>
  

  {/* <SpeedDial
    style={{bottom:0,right:"5%",zIndex:10000,position:"absolute"}}
    ariaLabel={`SpeedDial example ${object}`}
    icon={<MoreVertIcon /> }
    onClose={handleClose}
    onOpen={handleOpen}
    open={openSpeedDeal}
    direction="right"
  > */}
    <div style={{disable:!openSpeedDeal, position: openSpeedDeal ? "relative":"absolute"}}>
    {actions.map((action) => (
      <SpeedDialAction
        open={openSpeedDeal}
        // classes={{disable:!openSpeedDeal,
        // position:"absolute"}}
        key={action.name}
        icon={action.icon}
        tooltipTitle={action.name}
        onClick={()=>{action.handler();}}
      />
    ))}
    </div>
  {/* </SpeedDial> */}
  {object_type == "service" ? service : object}
  </Button>
  </>
  )
}

function createData(name, handlers, configs, clients) {

  let hist = []
  console.log("AAA",name,handlers,configs)
  for(let i=0;i<handlers.length;i++){
    hist.push({handlers: handlers[i],
               configs:configs[i],
              clients:clients[i]})
  }
  return {
    name,
    history: hist
  };
}


function Row(props) {
  const { row, setOpenBackdrop, showNotification, setNotificationInfo } = props;
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
        {row.name ? (<SpeedDialCustom object={""} 
                                      service={row.name}
                                      object_type="service"
                                      showNotification={showNotification}
                                      setNotificationInfo={setNotificationInfo}
                                      setOpenBackdrop={setOpenBackdrop}/>
                                                ):""}
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
                        {historyRow.handlers  ? (<SpeedDialCustom object={historyRow.handlers} 
                                                                  service={row.name}
                                                                  object_type="handler"
                                                                  showNotification={showNotification}
                                                                  setNotificationInfo={setNotificationInfo}
                                                                  setOpenBackdrop={setOpenBackdrop}/>
                                                ):""}
                      </TableCell>
                      <TableCell>
                      {historyRow.clients  ? (<SpeedDialCustom object={historyRow.clients} 
                                                                  service={row.name}
                                                                  object_type="client"
                                                                  showNotification={showNotification}
                                                                  setNotificationInfo={setNotificationInfo}
                                                                  setOpenBackdrop={setOpenBackdrop}/>
                                                ):""}

                      </TableCell>
                      <TableCell align="right">
                      {historyRow.configs  ? (<SpeedDialCustom object={historyRow.configs} 
                                                                  service={row.name}
                                                                  object_type="config"
                                                                  showNotification={showNotification}
                                                                  setNotificationInfo={setNotificationInfo}
                                                                  setOpenBackdrop={setOpenBackdrop}/>
                                                ):""}
                      </TableCell>
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
  const [openBackdrop, setOpenBackdrop] = useState(false);
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
                                                  service["configs"],
                                                  service["clients"]) )  
        setRows(new_rows); 

        new_servs = new_servs.map(service => [service["name"],
                                              service["handlers"],
                                              service["configs"],
                                              service["clients"]])

                             
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
  
  function CollapsibleTable({setOpenSpeedDeal}) {
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

              <Row key={row.name} row={row} showNotification={showNotification} setNotificationInfo={setNotificationInfo} setOpenBackdrop={setOpenBackdrop} />
            )): ""}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  
    
        
  return (
    <div>
          <div>
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
          <CollapsibleTable  />
          </CardBody>
        </Card>
      </GridItem>
      
    </GridContainer>
    </div>
    <Backdrop style={{zIndex:100000}} open={openBackdrop}></Backdrop>
    </div>
  );
}
