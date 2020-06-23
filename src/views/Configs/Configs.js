import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import avatar from "assets/img/faces/dost.jpg";
import CreateIcon from '@material-ui/icons/Create';
import AddAlert from "@material-ui/icons/AddAlert";

import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import { post } from 'axios';

import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import {server_uri,httpClient} from "Net/requests_info.js"
import Editor from "views/Editor"

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  uploader:{
    border:" 1px solid #ccc",
    display: "inline-block",
    padding: "6px 12px",
    cursor: "pointer"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function Configs() {
  const classes = useStyles();
  const [notification, setNotification] = React.useState(false);

  const [notificationInfo,setNotificationInfo] = useState("");
  const [file,setFile] = useState();
  const [name,setName] = useState();
  const [config_name,setConfigName] = useState();
  const [description,setDescription] = useState();

  const showNotification = (time) => {
          setNotification(true);
          setTimeout(function() {
            setNotification(false);
          }, time);
  };

  let onUpload = (files)=>{
    setFile(files)
    setNotificationInfo({message:"File was uploaded!",type:"info"})
    showNotification(6000)
  };
  let onSetName = (e)=>{
    setName(e.target.value)
  };

  let uploader = (file,name)=>{
    const url = server_uri+"/create_config";
    const formData = new FormData();
    formData.append('file',file)
    formData.append('name',name)
    formData.append('config_name',config_name)
    formData.append('description',description)

    const config = {
        headers: {
            'Content-type': 'apllication/json',
        }
    }
    
    return  httpClient.post(url, formData,config)
  }

  let create_config = (e)=>{
    e.preventDefault() // Stop form submit
    if(!file){
      setNotificationInfo({message:"File not uploaded!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!name){
      setNotificationInfo({message:"Service name is required!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!config_name){
      setNotificationInfo({message:"Config name is required!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!description){
      setNotificationInfo({message:"Description is required!",type:"danger"})
      showNotification(6000)
      return;
    }
    
    uploader(file,name, description).then((response)=>{
      setNotificationInfo({message:"Config was created!",type:"info"})
      showNotification(6000)
    }, error =>{
      let response = error.response ? error.response.data: error.response
      let status = error.response ? error.response.status: error.response
      setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
      showNotification(1000000)
    })
  }

  return (
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
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Config information</h4>
              <p className={classes.cardCategoryWhite}>Complete new config</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Service name"
                    id="service name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={onSetName}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Config name"
                    id="config name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={e=>setConfigName(e.target.value)}
                  />
                </GridItem>
              </GridContainer>

                     <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                </GridItem>
               
                <GridItem xs={4} sm={4} md={4}>
              <Editor 
                linkForDownload={server_uri+"/"+"get_config/template_service/config"}
                handler={onUpload} 
                handlerName="Send file"/>
              </GridItem>
              </GridContainer>
              
  

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="About the config...."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                    onChange={(e)=> setDescription(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={create_config}>Create config</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} style={{position:"relative",right:"10px",bottom:"10px",height:"170px",width:"150px"}} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>Novelist, Philosopher</h6>
              <h4 className={classes.cardTitle}>Fyodor Dostoevsky</h4>
              <p className={classes.description}>
              Жизнь задыхается без цели.
              </p>
              <Button color="primary" round>
                Плюсую
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
