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
import avatar from "assets/img/faces/Steve2.jpg";
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


import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
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
}));

function getSteps() {
  return ['Set Server name', 'Create yaml', 'Create service'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Введите произвольное имя нижнего регистра без пробелов';
    case 1:
      return 'Нажмите на кнопку Create yaml, после чего перейдете в редактор и сможете создать конфигурацию сервиса';
    case 2:
      return 'Нажмете на кнопку - созданный вами ямл отправится в директорию нового сервиса';
    default:
      return 'Unknown step';
  }
}


function HorizontalLinearStepper({activeStep,setActiveStep}) {
 
  return ;
}







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

// const useStyles = makeStyles(styles);
// const [activeStep, setActiveStep] = React.useState(0);
// const [skipped, setSkipped] = React.useState(new Set());
// const steps = getSteps();


// const isStepOptional = (step) => {
//   return step === 1;
// };

// const isStepSkipped = (step) => {
//   return skipped.has(step);
// };

// const handleNext = () => {
//   if(activeStep == 0)
//     check_name(name).then((response)=>{
//       setNotificationInfo({message:"Correct service name",type:"info"})
//       showNotification(6000)

//       let newSkipped = skipped;
//       if (isStepSkipped(activeStep)) {
//         newSkipped = new Set(newSkipped.values());
//         newSkipped.delete(activeStep);
//       }
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//       setSkipped(newSkipped);

//     }, error =>{
//       let response = error.response ? error.response.data: error.response
//       let status = error.response ? error.response.status: error.response
//       setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
//       showNotification(1000000)
//     })
//     else{
//       let newSkipped = skipped;
//       if (isStepSkipped(activeStep)) {
//         newSkipped = new Set(newSkipped.values());
//         newSkipped.delete(activeStep);
//       }
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//       setSkipped(newSkipped);
//     }
// };

// const handleBack = () => {
//   setActiveStep((prevActiveStep) => prevActiveStep - 1);
// };

// const handleSkip = () => {
//   if (!isStepOptional(activeStep)) {
//     // You probably want to guard against something like this,
//     // it should never occur unless someone's actively trying to break something.
//     throw new Error("You can't skip a step that isn't optional.");
//   }

//   setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   setSkipped((prevSkipped) => {
//     const newSkipped = new Set(prevSkipped.values());
//     newSkipped.add(activeStep);
//     return newSkipped;
//   });
// };

// const handleReset = () => {
//   setActiveStep(0);
// };



{/* <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            // labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper> </div>*/}

export default function UserProfile(props) {
  const classes = useStyles();
  const [notification, setNotification] = React.useState(false);

  const [notificationInfo,setNotificationInfo] = useState("");
  const [file,setFile] = useState();
  const [activeStep, setActiveStep] = React.useState(0);

  const [name,setName] = useState();
  const [description,setDescription] = useState();

  // const classes = useStyles1();
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if(activeStep == 0)
      check_name(name).then((response)=>{
        setNotificationInfo({message:"Correct service name",type:"info"})
        showNotification(6000)

        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);

      }, error =>{
        let response = error.response ? error.response.data: error.response
        let status = error.response ? error.response.status: error.response
        setNotificationInfo({message:"Error message:"+JSON.stringify(response)+" Status code:"+status,type:"danger"})
        showNotification(1000000)
      })
      else{
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };



  const showNotification = (time) => {
          setNotification(true);
          setTimeout(function() {
            setNotification(false);
          }, time);
  };

  let onUpload = (file)=>{
    setFile(file)
    setNotificationInfo({message:"File was uploaded!",type:"info"})
    showNotification(6000)
  };
  

  let onSetName = (e)=>{
    setName(e.target.value)
  };

  let uploader = (file,name)=>{
    const url = server_uri+"/create_service";
    const formData = new FormData();
    formData.append('file',file)
    formData.append('name',name)
    formData.append('description',description)

    const config = {
        headers: {
            'Content-type': 'apllication/json',
        }
    }
    
    return  httpClient.post(url, formData,config)
  }

  let check_name = (name)=>{
    const url = server_uri+"/create_service/check_name";
    const formData = new FormData();
    formData.append('name',name)
    formData.append('description',description)
    const config = {
      headers: {
          'Content-type': 'apllication/json',
      }
    }
  
  return  httpClient.post(url, formData,config)
  }

  let create_service = (e)=>{
    e.preventDefault() // Stop form submit
    if(!file){
      setNotificationInfo({message:"File not uploaded!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!name){
      setNotificationInfo({message:"Name is required!",type:"danger"})
      showNotification(6000)
      return;
    }
    if(!description){
      setNotificationInfo({message:"Description is required!",type:"danger"})
      showNotification(6000)
      return;
    }

    uploader(file,name, description).then((response)=>{
      setNotificationInfo({message:"Service was created!",type:"info"})
      showNotification(6000);
      props.history.push('/admin/services_list');
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
              <h4 className={classes.cardTitleWhite}>Service information</h4>
              <p className={classes.cardCategoryWhite}>Complete new service</p>
            </CardHeader>
            <CardBody>

            
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            // labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  

             {
               activeStep == 0 ?
               <>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Service name"
                    id="service name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={onSetName}
                    value={name}
                  />
                </GridItem>
              </GridContainer>

            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="About the service...."
                id="about-me"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  multiline: true,
                  rows: 5
                }}
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
              />
            </GridItem>
            </GridContainer>
              </>
              : <></>
            }
            {
              activeStep == 1 ?
              <GridContainer>
<GridItem xs={4} sm={4} md={4}>
</GridItem>
              <GridItem xs={4} sm={4} md={4}>
              <Editor 
                offBoard={true}
                linkForDownload={server_uri+"/"+"get_service/template_service"}
                handler={onUpload} 
                handlerName="Send file"/>
              </GridItem>
              </GridContainer>:
            <></>
            }

     

            
            </CardBody>


<CardFooter>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>

              {activeStep < 2 ?
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              > Next
              </Button> :

      <Button color="primary" onClick={(e)=>{create_service(e);}}>Create Service</Button>
      }
            </div>
          </div>
        )}
      </div>
      </CardFooter>
      
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} style={{position:"relative",right:"10px",bottom:"10px",height:"200px",width:"200px"}} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO Apple, PIXAR</h6>
              <h4 className={classes.cardTitle}>Steve Jobs</h4>
              <p className={classes.description}>
              Компьютер — это самый удивительный инструмент, с каким я когда-либо сталкивался. Это велосипед для нашего сознания.
              Memory & Imagination, 1990 г.
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



{/* <Button
variant="contained"
color="default"
className={classes.button}
startIcon={<CreateIcon />}
href="https://editor.swagger.io/"
>
Create yaml
</Button> */}



// {
//   activeStep == 2 ?
// <GridContainer>
//     <GridItem xs={4} sm={4} md={3}>

//     <label className={styles.uploader}>
//   <Button
//     variant="contained"
//     color="default"
//     type="file" 
//     className={classes.button}
//     startIcon={<CloudUploadIcon />}
//   >

// <input type="file"  multiple style={{ opacity: 0,overflow: "hidden", position: "absolute"}}
// onChange={e => {
//   onUpload([...e.target.files])}}/>


// Upload yaml

//   </Button>
//   </label>

//     </GridItem>
//   </GridContainer> :
//   <></>
// }