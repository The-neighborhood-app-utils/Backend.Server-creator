import React,{useState} from "react";
import SwaggerUI from "swagger-ui";
import EditorLayout from "layout";
import EditorPlugin from "plugins/editor"
import LocalStoragePlugin from "plugins/local-storage"
import ValidateBasePlugin from "plugins/validate-base"
import ValidateSemanticPlugin from "plugins/validate-semantic"
// import ValidateJsonSchemaPlugin from "plugins/json-schema-validator"
import EditorAutosuggestPlugin from "plugins/editor-autosuggest"
import EditorAutosuggestSnippetsPlugin from "plugins/editor-autosuggest-snippets"
import EditorAutosuggestKeywordsPlugin from "plugins/editor-autosuggest-keywords"
import EditorAutosuggestOAS3KeywordsPlugin from "plugins/editor-autosuggest-oas3-keywords"
import EditorAutosuggestRefsPlugin from "plugins/editor-autosuggest-refs"
import PerformancePlugin from "plugins/performance"
import JumpToPathPlugin from "plugins/jump-to-path"
import SplitPaneModePlugin from "plugins/split-pane-mode"
import ASTPlugin from "plugins/ast"

import Tooltip from '@material-ui/core/Tooltip';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import RedoIcon from '@material-ui/icons/Redo';
import LinkIcon from '@material-ui/icons/Link';
import TopbarPlugin from "standalone"
// import TopbarInsertPlugin from "standalone/topbar-insert"
// import TopbarMenuFileImportFile from "standalone/topbar-menu-file-import_file"
// import TopbarMenuEditConvert from "standalone/topbar-menu-edit-convert"
import StandaloneLayout from "standalone/standalone-layout"
import CreateIcon from '@material-ui/icons/Create';

import TopBar from "standalone"
import TopBarLayout from "standalone/standalone-layout"

import {Component} from 'react';
import SwaggerUi, {presets} from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Functions from 'standalone/functions'

import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

import Uploader from "standalone/topbar-menu-file-import_file/components/ImportFileMenuItem"
import Converter from "standalone/topbar-menu-edit-convert/components/convert-definition-menu-item"

import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background:"#8e24aa"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});





const plugins = {
  EditorPlugin,
  ValidateBasePlugin,
  ValidateSemanticPlugin,
  // ValidateJsonSchemaPlugin,
  LocalStoragePlugin,
  EditorAutosuggestPlugin,
  EditorAutosuggestSnippetsPlugin,
  EditorAutosuggestKeywordsPlugin,
  EditorAutosuggestRefsPlugin,
  EditorAutosuggestOAS3KeywordsPlugin,
  PerformancePlugin,
  JumpToPathPlugin,
  SplitPaneModePlugin,
  ASTPlugin,
  TopbarPlugin
}


let defaults = {
  // we have the `dom_id` prop for legacy reasons
  dom_id: '#swaggerContainer',
  // layout: "EditorLayout",
  layout: "StandaloneLayout",
  // url: props.url ? props.url : "",
  presets: [
    SwaggerUI.presets.apis,

  ],
  plugins: Object.values(plugins),
  components: {
    EditorLayout,
    StandaloneLayout
  },
  showExtensions: true,
  swagger2GeneratorUrl: "https://generator.swagger.io/api/swagger.json",
  oas3GeneratorUrl: "https://generator3.swagger.io/openapi.json",
  swagger2ConverterUrl: "https://converter.swagger.io/api/convert",
}


// let mergedOptions = deepMerge(defaults, options)

// mergedOptions.presets = defaults.presets.concat(options.presets || [])
// mergedOptions.plugins = defaults.plugins.concat(options.plugins || [])

class Editor extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.defaults = {
      // we have the `dom_id` prop for legacy reasons
      dom_id: '#swaggerContainer',
      // layout: "EditorLayout",
      layout: "StandaloneLayout",
      url: this.props.url ? this.props.url : "",
      presets: [
        SwaggerUI.presets.apis,
    
      ],
      plugins: Object.values(plugins),
      components: {
        EditorLayout,
        StandaloneLayout
      },
      showExtensions: true,
      swagger2GeneratorUrl: "https://generator.swagger.io/api/swagger.json",
      oas3GeneratorUrl: "https://generator3.swagger.io/openapi.json",
      swagger2ConverterUrl: "https://converter.swagger.io/api/convert",
    }

    SwaggerUi(this.defaults );
  }

  render() {
    return (
      <div id="swaggerContainer" />
    );
  }
}






const EditorWrapper =  (opt) =>{
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const {handler,
      offBoard,
      functions,
      handlerName,
      outsideOpen,
      outsideOpenSet,
      needDownload,
      setNeedDownload,
      linkForDownload,
      hideButton} = opt

    const handleClickOpen = () => {
      setOpen(true);
      console.log("AAAAAA")
      if(outsideOpenSet) outsideOpenSet(true);
    };
  
    const handleClose = () => {
      console.log("BBBBB")
      setOpen(false);
      if(outsideOpenSet) outsideOpenSet(false);
    };


    console.log("Functions:",functions, needDownload)

    if(functions.functions && needDownload){
      // functions.functions.importFromURL(linkForDownload, ()=>setNeedDownload(false));
    }
    
    return (

   
              <div>
        {hideButton ? "" :
              <Button
        variant="contained"
        color="default"
        onClick={handleClickOpen}
        className={classes.button}
        style={{left:"40px",position:"relative"}}
        startIcon={<CreateIcon />}
        >
        Create yaml
        </Button>}

          <Dialog fullScreen open={open || (hideButton)} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>


                <Button variant="contained"
                color="default"
                startIcon={<CloudUploadIcon />}
                onClick={()=>{if(functions.functions)functions.functions.saveAsJson()} }
                style={{margin:"20px",fontSize:"7pt"}}
              >
                Download As Json
              </Button>

                <Button variant="contained"
                color="default"
                startIcon={<CloudUploadIcon />}
                onClick={()=>{if(functions.functions)functions.functions.saveAsYaml()} }
                style={{margin:"20px",fontSize:"7pt"}}
              >
                Download As Yaml

              </Button>
              <Tooltip title="Clear Editor" arrow>
                <IconButton variant="contained"
                color="default"
                startIcon={<CloudUploadIcon />}
                onClick={()=>{if(functions.functions)functions.functions.clearEditor() }}
                style={{margin:"20px"}}
              >
                <ClearAllIcon />
                {/* Clear Editor */}
              </IconButton>
              </Tooltip>

              <Tooltip title="Import from URL" arrow>
                <IconButton variant="contained"
                color="default"
                startIcon={<CloudUploadIcon />}
                onClick={()=>{if(functions.functions)functions.functions.importFromURL()} }
                style={{margin:"20px"}}
              >
                <LinkIcon />
                {/* Import from URL */}
              </IconButton>
              </Tooltip>

              <Tooltip title="Convert To yaml" arrow>
              <IconButton variant="contained"
                color="default"
                startIcon={<CloudUploadIcon />}
                onClick={()=>{if(functions.functions)functions.functions.convertToYaml()} }
                style={{margin:"20px"}}
              >
                <RedoIcon />
                {/* Convert To yaml */}
              </IconButton>
            </Tooltip>
                

                <Uploader style={{margin:"20px"}} onDocumentLoad={(content)=>{if(functions.functions)functions.functions.onDocumentLoad(content)}}/>
                <Converter style={{margin:"20px"}} onClick={()=>{if(functions.functions)functions.functions.convert()}} />


                <Button style={{marginLeft:"35%",fontSize:"10pt"}} autoFocus edge="end" color="inherit" onClick={()=>{if(functions.functions)functions.functions.uploadTo(handler);handleClose();}}>
                { handlerName ? handlerName : "Handler"}
                </Button>
                
              </Toolbar>
            </AppBar>


          <Editor url={linkForDownload}/>
          </Dialog>}
      </div>
    );
  }
  




export default connect(
  ({editor})=>{
    return {
      functions: editor
    };
  })(EditorWrapper);
// export default EditorWrapper;