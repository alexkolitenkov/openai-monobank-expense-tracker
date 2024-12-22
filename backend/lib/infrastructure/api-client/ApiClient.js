// import _Exception from 'chista/Exception.js';
// import fetch       from 'node-fetch';
import queryString from 'query-string';
// import FormData from 'form-data';
// import Logger from './Logger.js';

// const X = _Exception.default;
// const logger = new Logger({ name: 'provider_logger' });

export const CONTENT_TYPES_BY_TYPE = {
    JSON      : 'application/json',
    FORM_DATA : 'multipart/form-data'
};
const FORMAT_BODY_BY_TYPE = {
    JSON      : (body) => JSON.stringify(body),
    FORM_DATA : (body) => getFormData(body)
};

export class ApiClient {
    #baseUrl;

    constructor({ baseUrl, error } = {}) {
        this.#baseUrl = baseUrl;
        this.error = error;
    }

    async request({ endpoint, method, params = {}, headers = {}, body, type = 'JSON' }) {
        const query = Object.keys(params || {}).length ? `?${queryString.stringify(params)}` : '';
        const url = `${this.#baseUrl || ''}${endpoint}${query}`;

        // eslint-disable-next-line
        // logger.info({method, url, body });

        const response = await fetch(url, {
            method,
            headers : {
                ...headers,
                ...(type !== 'FORM_DATA' && { 'Content-Type': CONTENT_TYPES_BY_TYPE[type] })
            },
            body : FORMAT_BODY_BY_TYPE[type](body)
        });

        // if (response.status >= 400) {
        //     throw this.error || new X({
        //         code   : 'AUTHENTICATION_FAILED',
        //         fields : { token: 'WRONG_TOKEN' }
        //     });
        // }

        // const result = await response.json();

        // logger.info({ status: response.status, body: result });
        return {
            status : response.status,
            data   : await response.json()
        };
    }

    get(endpoint, params, headers) {
        return this.request({ endpoint, method: 'GET', params, headers });
    }

    post({ endpoint, body = {}, headers = undefined, type = 'JSON' }) {
        return this.request({ endpoint, method: 'POST', body, headers, type });
    }

    patch({ endpoint, body = {}, headers = undefined }) {
        return this.request({ endpoint, method: 'PATCH', body, headers });
    }

    put(endpoint, body = {}, headers = undefined) {
        return this.request({ endpoint, method: 'PUT', body, headers });
    }

    delete_(endpoint, body = {}, headers) {
        return this.request({ endpoint,  method: 'DELETE', body, headers });
    }
}

function getFormData(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([ key, value ]) => {
        if (Array.isArray(value)) {
            value.forEach(item => formData.append('customerGuids[]', item));
        } else {
            formData.append(key, value);
        }
    });

    return formData;
}
