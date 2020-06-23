const initialState = {
  items: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'EDITOR:SET_FUNCTIONS':
      return {
        ...state,
        functions: payload.functions,
        needDownload: payload.needDownload,
      };
    default:
      return state;
  }
};
