import React, { Component } from "react"
import PropTypes from "prop-types"

import fileDialog from "file-dialog"
import YAML from "js-yaml"
import isJsonObject from "is-json"
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default class ImportFileMenuItem extends Component {
  onClick = async () => {
    const { onDocumentLoad } = this.props
    const fileList = await fileDialog()

    const fileReader = new FileReader()

    fileReader.onload = fileLoadedEvent => {
      let content = fileLoadedEvent.target.result
  
      try {
        const preparedContent = isJsonObject(content) ? YAML.safeDump(YAML.safeLoad(content)) : content

        if (typeof onDocumentLoad === "function") {
          onDocumentLoad(preparedContent)
        }
      } catch(e) {
        alert(`Oof! There was an error loading your document:\n\n${e.message || e}`)
      }
    }

    fileReader.readAsText(fileList.item(0), "UTF-8")
  }

  render() {
    return( 
      <Tooltip title="Upload file" arrow>
    <IconButton variant="contained"
        color="default"
        style={{margin:"20px"}} 
        startIcon={<CloudUploadIcon />}
        onClick={this.onClick}
      >
       <CloudUploadIcon />
      </IconButton>
      </Tooltip>
      )
  }
}

ImportFileMenuItem.propTypes = {
  onDocumentLoad: PropTypes.func.isRequired,
}
