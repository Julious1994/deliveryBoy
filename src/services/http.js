
const joinURL = (baseURL, url) => {
	return `${baseURL}/${url}`;
}

const Headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
}

class Service {
	constructor() {
			this.baseURL = "http://www.tiffincentre.somee.com/api/AdminApi/";
	}

	request(url, method = 'POST', data = null) {
			url = joinURL(this.baseURL, url);
			const options = {
					headers: Headers,
					method,
			};
			if(data) {
					options.body = JSON.stringify({...data});
			}
			console.log('body', options);
			return fetch(url, options);
	}

	getAll(url, data = {}) {
			const method = "POST";
			this.request(url, method, data);
	}

	get(url) {
			const method = "GET";
			return this.request(url, method).then(res => res.json()).catch(err => {
					console.log('ERR:', err);
					return { Status: 0, error: "Network request failed"};
			});
	}

	post(url, data) {
		const method = 'POST';
		return this.request(url, method, data).then(res => res.json()).catch(err => {
			console.log('ERR:', err);
			return { Status: 0, Body: "Network request failed"};
		});
	}

	delete() {

	}
}

export default Service;
