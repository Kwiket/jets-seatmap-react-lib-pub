import { DEFAULT_AUTHORIZATION_SCHEME } from './constants';

const JWT_TOKEN = 'jetsJwtToken';
const TOKEN_EXPIRATION_BUFFER_IN_MS = 300000;

export class JetsApiService {
  constructor(
    appId,
    key,
    url,
    localStorage,
    apiAuthorizationScheme = DEFAULT_AUTHORIZATION_SCHEME,
    apiMetadata = null
  ) {
    this._appId = appId;
    this._apiKey = key;
    this._apiUrl = url;
    this._localStorage = localStorage;
    this._apiAuthorizationScheme = apiAuthorizationScheme;
    this._apiMetadata = apiMetadata;
  }

  getData = async (url, options = {}) => {
    let basicOptions = {};
    if (!options?.headers?.authorization) {
      basicOptions = await this._getRequestOptions();
    }

    const reqOptions = { ...options, ...basicOptions };
    const response = await fetch(`${this._apiUrl}/${url}`, reqOptions);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`getData: ${response.status} - ${responseData.message}`);
    }

    return await responseData;
  };

  postData = async (url, body, options = {}) => {
    const basicOptions = await this._getRequestOptions();
    const params = { ...options, method: 'post', body: JSON.stringify(body), ...basicOptions };
    const path = `${this._apiUrl}/${url}`;
    const response = await fetch(path, params);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`postData: ${response.status} - ${responseData.message}`);
    }

    return responseData;
  };

  _getRequestOptions = async () => {
    const token = await this._getToken();
    return {
      headers: {
        'content-type': 'application/json',
        authorization: `${this._apiAuthorizationScheme} ${token}`,
      },
    };
  };

  _getAuthRequestOptions = key => {
    return {
      headers: {
        authorization: `${this._apiAuthorizationScheme} ${key}`,
      },
    };
  };

  _getToken = async () => {
    const token = this._localStorage ? this._localStorage.getData(JWT_TOKEN) : null;

    if (token) return token;

    const path = `auth?appId=${this._appId}`;
    const { accessToken } = await this.getData(path, this._getAuthRequestOptions(this._apiKey));

    if (!accessToken) {
      throw new Error('Unable to authenticate');
    }

    this._saveToken(accessToken);

    return accessToken;
  };

  _saveToken = token => {
    if (!token || !this._localStorage) return;

    const { exp } = this._parseJwt(token);
    const tokenTTL = this._getTokenTTL(exp);
    this._localStorage.setData(JWT_TOKEN, token, tokenTTL);
  };

  _getTokenTTL(exp) {
    return exp * 1000 - Date.now() - TOKEN_EXPIRATION_BUFFER_IN_MS;
  }

  _parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
