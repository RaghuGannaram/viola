import axios from "axios";

import { setupInterceptors } from "./interceptors";
import { PUBLIC_API_PROXY_BASE } from "$env/static/public";

const proxyClient = axios.create({
	baseURL: PUBLIC_API_PROXY_BASE,
	withCredentials: true,
	validateStatus: (status) => status < 500,
});

setupInterceptors(proxyClient);

export default proxyClient;
