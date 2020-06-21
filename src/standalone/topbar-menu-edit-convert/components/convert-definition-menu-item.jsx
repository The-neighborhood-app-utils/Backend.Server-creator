import React, { Component } from "react"
import PropTypes from "prop-types"
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Tooltip from '@material-ui/core/Tooltip';

export default class ConvertDefinitionMenuItem extends Component {
  render() {
    const { isSwagger2, } = this.props
    
    // if(!isSwagger2) {
    //   return null
    // }
    //Convert to OpenAPI 3
    return( 
      <Tooltip title="Convert to OpenAPI 3" arrow>
    <IconButton variant="contained"
            color="default"
            style={{margin:"20px"}} 
            startIcon={<CloudUploadIcon />}
            onClick={this.props.onClick}
            >
            <AutorenewIcon/>
            </IconButton>
      </Tooltip>    )
  }
}

ConvertDefinitionMenuItem.propTypes = {
  isSwagger2: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}