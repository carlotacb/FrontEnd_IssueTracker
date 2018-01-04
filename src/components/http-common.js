import axios from 'axios';

export const HTTP = axios.create({
	baseURL: 'https://arcane-falls-72768.herokuapp.com',
	headers: {
		'X-User-Token': 'itZhA1GN8j_szrA7BG7_',
		'Accept':'application/json'
	}
});

delete axios.defaults.headers.common.Accept;