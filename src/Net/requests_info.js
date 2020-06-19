import axios from "axios";

export const server_uri = "http://localhost:3010";
export const httpClient = axios.create();
httpClient.defaults.timeout = 500;

