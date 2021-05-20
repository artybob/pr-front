class BaseApiService {

    baseUrl = process.env.VUE_APP_BASE_URL;
    resource;

    constructor(resource) {
        if (!resource) throw new Error("Resource is not provided");
        this.resource = resource;
    }

    getUrl(urlParams = {}) {
        const url = new URL([this.baseUrl, this.resource, urlParams.id].filter(Boolean).join('/'));
        url.search = new URLSearchParams(urlParams.getParams);

        return url;
    }

    getData(response) {
        return response.data;
    }

    handleErrors(err) {
        console.log({ message: "Errors is handled here", err });
    }
}


class ReadOnlyApiService extends BaseApiService {
    constructor(resource) {
        super(resource);
    }
    async fetch(urlParams) {
        try {
            const response = await fetch(this.getUrl(urlParams));
            return await response.json();
        } catch (err) {
            this.handleErrors(err);
        }
    }
    async get(urlParams= {}) {
        try {
            if (!urlParams.id) throw Error("Id is not provided");
            const response = await fetch(this.getUrl(urlParams));
            return await response.json();
        } catch (err) {
            this.handleErrors(err);
        }
    }
}

class ModelApiService extends ReadOnlyApiService {
    constructor(resource) {
        super(resource);
    }
    async post(data = {}) {
        try {
            const response = await fetch(this.getUrl(), {
                method: "POST",
                body: data,
            });
            return await response.json();
        } catch (err) {
            this.handleErrors(err);
        }
    }
    async put(urlParams, data = {}) {
        if (!urlParams.id) throw Error("Id is not provided");
        try {
            const response = await fetch(this.getUrl(urlParams), {
                method: "PUT",
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            this.handleErrors(err);
        }
    }
    async delete(urlParams) {
        if (!urlParams.id) throw Error("Id is not provided");
        try {
            const response = await fetch(this.getUrl(urlParams), {
                method: "DELETE"
            });
            return await response.json();
        } catch (err) {
            this.handleErrors(err);
        }
    }
}

class PurchasesApiService extends ModelApiService {
    constructor() {
        super("purchases");
    }

    async triggerError() {
        try {
            throw Error("This error is triggered and handled by api module");
        } catch (err) {
            this.handleErrors(err);
        }
    }
}

export const $api = {
    purchases: new PurchasesApiService(),
};