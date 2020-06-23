

const Actions = {
  setFunctions: (functions,needDownload) => {
    console.log(functions);
    return {
    type: 'EDITOR:SET_FUNCTIONS',
    payload: {functions,needDownload},
  }},
};

export default Actions;
