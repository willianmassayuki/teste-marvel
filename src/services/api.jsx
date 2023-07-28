import axios from "axios";
import md5 from "md5";

const privateKey = "b03878f64ab9db15d277ded4d9a47faaea903473";
const publicKey = "bab7aea7ca564cded01f7255f43f5338"; // Aqui vai a API publica
const time = Number(new Date());
const hash = md5(time + privateKey + publicKey);

const api = axios.create({
  baseURL: "https://gateway.marvel.com:443/v1/public/",
  params: {
    ts: time,
    apikey: publicKey,
    hash,
  },
});

export default api;
