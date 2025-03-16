import axios from "axios";

const base_url = process.env.API_URL
  ? `${process.env.API_URL}graphql`
  : "http://localhost:3001/graphql";

const postAPI = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export default postAPI;
