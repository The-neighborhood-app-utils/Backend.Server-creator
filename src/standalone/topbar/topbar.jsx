import React from "react"
import PropTypes from "prop-types"
import Swagger from "swagger-client"
import URL from "url"

import DropdownMenu from "./DropdownMenu"
import reactFileDownload from "react-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"
import Functions from 'standalone/functions'
import Logo from "./logo_small.svg"
import Button from '@material-ui/core/Button';

import editorActions from 'redux/actions/editor';
import store from 'store'
import {server_uri, httpClient} from "Net/requests_info.js"

const CONTENT_KEY = "swagger-editor-content"
let localStorage = window.localStorage

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      swaggerClient: null,
      clients: [],
      servers: [],
      definitionVersion: "Unknown",
      notification: false,
      notificationInfo: ""
    }


  

    let { getComponent, specSelectors, topbarActions } = this.props
    Functions.saveAsJson =  this.saveAsJson
    Functions.saveAsYaml =  this.saveAsYaml
    Functions.clearEditor =  this.clearEditor
    Functions.importFromURL =  this.importFromURL
    Functions.convertToYaml =  this.convertToYaml
    Functions.uploadTo =  this.uploadTo
    Functions.isSwagger2 =  specSelectors.isSwagger2()
    Functions.convert =  () => topbarActions.showModal("convert")
    // Functions.ConvertDefinitionMenuItem =  <ConvertDefinitionMenuItem 
    //                               isSwagger2={specSelectors.isSwagger2()}
    //                               onClick={() => topbarActions.showModal("convert")}
                                
    Functions.onDocumentLoad = content => this.props.specActions.updateSpec(content)

    store.dispatch(editorActions.setFunctions(Functions));

  }



  getGeneratorUrl = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors
    const { swagger2GeneratorUrl, oas3GeneratorUrl } = this.props.getConfigs()

    return isOAS3() ? oas3GeneratorUrl : (
      isSwagger2() ? swagger2GeneratorUrl : null
    )
  }

  instantiateGeneratorClient = () => {

    const generatorUrl = this.getGeneratorUrl()

    const isOAS3 = this.props.specSelectors.isOAS3()

    if(!generatorUrl) {
      return this.setState({
        clients: [],
        servers: []
      })
    }

    Swagger(generatorUrl, {
      requestInterceptor: (req) => {
        req.headers["Accept"] = "application/json"
        req.headers["Content-Type"] = "application/json"
      }
    })
    .then(client => {
      this.setState({
        swaggerClient: client
      })

      const clientGetter = isOAS3 ? client.apis.clients.clientLanguages : client.apis.clients.clientOptions
      const serverGetter = isOAS3 ? client.apis.servers.serverLanguages : client.apis.servers.serverOptions


      clientGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ clients: res.body || [] })
      })
      
      serverGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ servers: res.body || [] })
      })
    })
  }

  downloadFile = (content, fileName) => {
    if(window.Cypress) {
      // HACK: temporary workaround for https://github.com/cypress-io/cypress/issues/949
      // allows e2e tests to proceed without choking on file download native event
      return
    }
    return reactFileDownload(content, fileName)
  }

  // Menu actions

  importFromURL = (url,setLoaded) => {
    if(!url)
        url = prompt("Enter the URL to import from:")

  


    if(url) {
      httpClient.get(url)
        .then(result => {
          let text = result.data
          console.log("OOOOOK",text)

            try{
            this.props.specActions.updateSpec(
              YAML.safeDump(YAML.safeLoad(text), {
                lineWidth: -1
              })
            )
            if(setLoaded) setLoaded();
            }catch(error){
              // let response = error.response ? error.response.data: error.response
              // let status = error.response ? error.response.status: error.response
              this.props.specActions.updateSpec(text);
              if(setLoaded) setLoaded();
            }
        },
        (error) => {
           console.error(error)
        })
    }
  }

  saveAsYaml = () => {
    let editorContent = this.props.specSelectors.specStr()
    let language = this.getDefinitionLanguage()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      if(language === "yaml") {
        // const shouldContinue = confirm("Swagger-Editor isn't able to parse your API definition. Are you sure you want to save the editor content as YAML?")
        // if(!shouldContinue) return
      } else {
        return alert("Save as YAML is not currently possible because Swagger-Editor wasn't able to parse your API definiton.")
      }
    }

    if(language === "yaml") {
      //// the content is YAML,
      //// so download as-is
      return this.downloadFile(editorContent, `${fileName}.yaml`)
    }

    //// the content is JSON,
    //// so convert and download

    // JSON String -> JS object
    let jsContent = YAML.safeLoad(editorContent)
    // JS object -> YAML string
    let yamlContent = YAML.safeDump(jsContent)
    this.downloadFile(yamlContent, `${fileName}.yaml`)
  }

  uploadTo = (uploader)=>{
    // if(localStorage.getItem(CONTENT_KEY)) 
    // this.props.specActions.updateSpec(localStorage.getItem(CONTENT_KEY), "local-storage")

    let editorContent = localStorage.getItem(CONTENT_KEY)
    console.log("ST CONTTT",localStorage.getItem(CONTENT_KEY))


    let language = this.getDefinitionLanguage()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      if(language === "yaml") {
        // const shouldContinue = confirm("Swagger-Editor isn't able to parse your API definition. Are you sure you want to save the editor content as YAML?")
        // if(!shouldContinue) return
      } else {
        return alert("Save as YAML is not currently possible because Swagger-Editor wasn't able to parse your API definiton.")
      }
    }

    if(language === "yaml") {
      console.log("ISSS YAML");
      //// the content is YAML,
      //// so download as-is
      return uploader(editorContent)
    }

    //// the content is JSON,
    //// so convert and download

    // JSON String -> JS object
    let jsContent = YAML.safeLoad(editorContent)
    // JS object -> YAML string
    let yamlContent = YAML.safeDump(jsContent)
    uploader(yamlContent)
  }

  saveAsJson = () => {
    let editorContent = this.props.specSelectors.specStr()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      // we can't recover from a parser error in save as JSON
      // because we are always parsing so we can beautify
      return alert("Save as JSON is not currently possible because Swagger-Editor wasn't able to parse your API definiton.")
    }

    // JSON or YAML String -> JS object
    let jsContent = YAML.safeLoad(editorContent)
    // JS Object -> pretty JSON string
    let prettyJsonContent = beautifyJson(jsContent, null, 2)
    this.downloadFile(prettyJsonContent, `${fileName}.json`)
  }

  saveAsText = () => {
    // Download raw text content
    console.warn("DEPRECATED: saveAsText will be removed in the next minor version.")
    let editorContent = this.props.specSelectors.specStr()
    let isOAS3 = this.props.specSelectors.isOAS3()
    let fileName = isOAS3 ? "openapi.txt" : "swagger.txt"
    this.downloadFile(editorContent, fileName)
  }

  convertToYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let yamlContent = YAML.safeDump(jsContent)
    this.props.specActions.updateSpec(yamlContent)
  }

  downloadGeneratedFile = (type, name) => {
    let { specSelectors } = this.props
    let swaggerClient = this.state.swaggerClient
    if(!swaggerClient) {
      // Swagger client isn't ready yet.
      return
    }

    if(specSelectors.isOAS3()) {
      // Generator 3 only has one generate endpoint for all types of things...
      // since we're using the tags interface we may as well use the client reference to it
      swaggerClient.apis.clients.generate({}, {
        requestBody: {
          spec: specSelectors.specJson(),
          type: type.toUpperCase(),
          lang: name
        },
        contextUrl: this.getGeneratorUrl()
      }).then(res => {
        this.downloadFile(res.data, `${name}-${type}-generated.zip`)
      })
    } else if(type === "server") {
      swaggerClient.apis.servers.generateServerForLanguage({
        framework : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        }),
        headers: JSON.stringify({
          Accept: "application/json"
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    } else if(type === "client") {
      swaggerClient.apis.clients.generateClient({
        language : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    }
  }

  handleResponse = (res, { type, name }) => {
    if(!res.ok) {
      return console.error(res)
    }

    let downloadUrl = URL.parse(res.body.link)

    // HACK: workaround for Swagger.io Generator 2.0's lack of HTTPS downloads
    if(downloadUrl.hostname === "generator.swagger.io") {
      downloadUrl.protocol = "https:"
      delete downloadUrl.port
      delete downloadUrl.host
    }

    fetch(URL.format(downloadUrl))
      .then(res => res.blob())
      .then(res => {
        this.downloadFile(res, `${name}-${type}-generated.zip`)
      })
  }

  clearEditor = () => {
    if(window.localStorage) {
      window.localStorage.removeItem("swagger-editor-content")
      this.props.specActions.updateSpec("")
    }
  }

  // Helpers
  showModal = (name) => {
    this.setState({
      [name]: true
    })
  }

  hideModal = (name) => {
    this.setState({
      [name]: false
    })
  }

  // Logic helpers

  hasParserErrors = () => {
    return this.props.errSelectors.allErrors().filter(err => err.get("source") === "parser").size > 0
  }

  getFileName = () => {
    // Use `isSwagger2` here, because we want to default to `openapi` if we don't know.
    if(this.props.specSelectors.isSwagger2 && this.props.specSelectors.isSwagger2()) {
      return "swagger"
    }

    return "openapi"
  }

  getDefinitionLanguage = () => {
    let editorContent = this.props.specSelectors.specStr() || ""

    if(editorContent.trim()[0] === "{") {
      return "json"
    }

    return "yaml"
  }


  getDefinitionVersion = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors

    return isOAS3() ? "OAS3" : (
      isSwagger2() ? "Swagger2" : "Unknown"
    )
  }

  ///// Lifecycle

  componentDidMount() {
    this.instantiateGeneratorClient()
  }

  componentDidUpdate() {
    const version = this.getDefinitionVersion()

    if(this.state.definitionVersion !== version) {
      // definition version has changed; need to reinstantiate
      // our Generator client
      // --
      // TODO: fix this if there's A Better Way
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        definitionVersion: version
      }, () => this.instantiateGeneratorClient())

    }
  }

  render() {
    let { getComponent, specSelectors, topbarActions } = this.props
    const Link = getComponent("Link")
    const TopbarInsert = getComponent("TopbarInsert")
    const ImportFileMenuItem = getComponent("ImportFileMenuItem")
    const ConvertDefinitionMenuItem = getComponent("ConvertDefinitionMenuItem")



    let showServersMenu = this.state.servers && this.state.servers.length
    let showClientsMenu = this.state.clients && this.state.clients.length

    let definitionLanguage = this.getDefinitionLanguage()

    let isJson = definitionLanguage === "json"

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }

    const saveAsElements = []



    return (
      <div className="swagger-editor-standalone">
        <div className="topbar">
          <div className="topbar-wrapper">



          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  errSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  topbarActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
