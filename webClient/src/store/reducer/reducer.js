const initialState = {
  app_name: 'HALT',
  user_id: null,
  server_address: "http://127.0.0.1:1515",
  influxdb_instance: null,
};

const reducer = (state = initialState, action) => {
  let retObj = { ...state };
  switch (action.type) {
    case "USER_ID":
      retObj.user_id = action.payload;
      break;
    case "LOGOUT":
      retObj.user_id = null;
      break;
    case "INFLUXDB_UPDATE":
      if (action.payload === null) {
        retObj.influxdb_instance = null;
      } else {
        retObj.influxdb_instance = {
          instance: action.payload["instance"],
          name: action.payload["name"],
          host: action.payload["host"],
          port: action.payload["port"],
          username: action.payload["username"],
          password: action.payload["password"],
        };
      }
      break;
    default:
      break;
  }
  return retObj;
};

export default reducer;
