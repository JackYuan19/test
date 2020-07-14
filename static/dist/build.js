(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":4}],3:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":10,"../core/createError":11,"./../core/settle":15,"./../helpers/buildURL":19,"./../helpers/cookies":21,"./../helpers/isURLSameOrigin":23,"./../helpers/parseHeaders":25,"./../utils":27}],4:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":5,"./cancel/CancelToken":6,"./cancel/isCancel":7,"./core/Axios":8,"./core/mergeConfig":14,"./defaults":17,"./helpers/bind":18,"./helpers/spread":26,"./utils":27}],5:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],6:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":5}],7:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],8:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":19,"./../utils":27,"./InterceptorManager":9,"./dispatchRequest":12,"./mergeConfig":14}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":27}],10:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":20,"../helpers/isAbsoluteURL":22}],11:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":13}],12:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":7,"../defaults":17,"./../utils":27,"./transformData":16}],13:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],14:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":27}],15:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":11}],16:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":27}],17:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":3,"./adapters/xhr":3,"./helpers/normalizeHeaderName":24,"./utils":27,"_process":1}],18:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],19:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":27}],20:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],21:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":27}],22:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":27}],24:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":27}],25:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":27}],26:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],27:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":18}],28:[function(require,module,exports){
'use strict';

var _index = require('./index');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.bottomSeckill = function () {
  (function () {
    // 拿到countdown-desc中的strong
    var strong = document.getElementsByClassName('countdown-desc')[0].children;
    // 拿到timmer__unit--hour中的元素
    var timmer_unit_hours = document.getElementsByClassName('timmer__unit--hour')[0];
    // 拿到timmer__unit--minute中的元素
    var timmer_unit_minute = document.getElementsByClassName('timmer__unit--minute')[0];
    // 拿到timmer__unit--second中的元素
    var timmer__unit_second = document.getElementsByClassName('timmer__unit--second')[0];
    // 获取时间的
    function getDate() {
      // 判断时间戳
      var date = new Date();
      var minute, secode, hours, touch;
      /*var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 16:00:00`);
      var nowTimer =+new Date(); 
      var timer = (afterTimer - nowTimer) / 1000;
      var timerid = setInterval(() => {
        timer --;
        if(timer <= 0) {
          clearInterval(timerid);
        }
        // 2.3
        hours = Math.floor(timer/60/60%24);
        minute = Math.floor(timer/60%60);
        secode = Math.floor(timer%60);
        timmer_unit_hours.innerText = hours;
        timmer_unit_minute.innerText = minute;
        timmer__unit_second.innerText = secode;
      },1000);*/
      var timerid = setInterval(function () {
        if (date.getHours() >= 14 && date.getHours() < 16) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 16:00:00');
          touch = '16:00';
        } else if (date.getHours() >= 16 && date.getHours() < 18) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 18:00:00');
          touch = '18:00';
        } else if (date.getHours() >= 18 && date.getHours() < 20) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 20:00:00');
          touch = '20:00';
        } else if (date.getHours() >= 20 && date.getHours() < 22) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 22:00:00');
          touch = '22:00';
        } else if (date.getHours() >= 8 && date.getHours() < 10) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 10:00:00');
          touch = '10:00';
        } else if (date.getHours() >= 10 && date.getHours() < 12) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 12:00:00');
          touch = '12:00';
        } else {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1) + ' 8:00:00');
          touch = '08:00';
        }
        var timer = (afterTimer - new Date()) / 1000;
        hours = Math.floor(timer / 60 / 60 % 24);
        minute = Math.floor(timer / 60 % 60);
        secode = Math.floor(timer % 60);
        timmer_unit_hours.innerText = hours;
        timmer_unit_minute.innerText = minute;
        timmer__unit_second.innerText = secode;
        strong[0].innerText = touch;
      }, 1000);
    }
    getDate();
  })();
};
exports.bottomSlider = function () {
  (function () {
    // 拿到slider_wrapper中的元素
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[2];
    // 拿到slider_control_prev中的元素
    var sliderControlPrev = document.getElementsByClassName('slider_control_prev')[2];
    // 拿到slider_control_next中的元素
    var sliderControlPNext = document.getElementsByClassName('slider_control_next')[2];
    var speed = 0,
        timer = null;
    function start() {
      // 定时器移动
      timer = setInterval(function () {
        if (speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
        } else {
          speed -= 800;
          sliderWrapper.style.transition = 'all 500ms ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          setTimeout(function () {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          }, 500);
        }
      }, 8000);
    }
    function wrapper(speed) {
      sliderWrapper.style.transition = 'all 500ms ease 0s';
      sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
      setTimeout(function () {
        clearInterval(timer);
        sliderWrapper.style.transition = 'none 0s ease 0s';
        start();
      }, 2000);
    }
    function startClick() {
      sliderControlPrev.addEventListener('click', function () {
        // 停止定时器
        clearInterval(timer);
        if (speed >= 0) {
          speed = -3200;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          return;
        } else {
          speed += 800;
        }
        wrapper(speed);
      });
      sliderControlPNext.addEventListener('click', function () {
        clearInterval(timer);
        if (speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          return;
        } else {
          speed -= 800;
        }
        wrapper(speed);
      });
    }
    function wrapperMouse() {
      sliderWrapper.addEventListener('mouseover', function () {
        clearInterval(timer);
      });
      sliderWrapper.addEventListener('mouseleave', function () {
        clearInterval(timer);
        start();
      });
    }
    start();
    startClick();
    wrapperMouse();
  })();
};
exports.bottomWrapper = function () {
  (function () {
    // 拿到slider_wrapper元素
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[3];
    // 拿到button按钮slider_indicators_btn 
    var sliderIndicatorsBtn = document.getElementsByClassName('slider_indicators_btn');
    // 定义speed
    var speed = 0,
        timer = null;
    //sliderWrapper.style.transition = '500ms ease-in-out 0s';
    //sliderWrapper.style.transform = "translate3d(-180px, 0px, 0px)";
    function start() {
      timer = setInterval(function () {
        if (speed === -540) {
          speed = -180;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
        } else {
          speed += -180;
          if (speed === -360) {
            sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn');
          } else {
            sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn');
          }
          sliderWrapper.style.transition = '500ms ease-in-out 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          setTimeout(function () {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          }, 500);
        }
      }, 2000);
    }
    function stopSlider(index, speed) {
      sliderWrapper.style.transition = '500ms ease-in-out 0s';
      sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
      if (index === 0) {
        sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn');
      } else {
        sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn');
      }
      setTimeout(function () {
        sliderWrapper.style.transition = 'none 0s ease 0s';
      }, 500);
      setTimeout(function () {
        clearInterval(timer);
        start();
      }, 1500);
    }
    // 给sliderIndicatorsBtn添加移入事件
    function sliderIndicatorsBtnOver() {
      sliderIndicatorsBtn[8].addEventListener('mouseover', function () {
        clearInterval(timer);
        if (speed === -180) {
          speed = 0;
        } else {
          speed = -360;
        }
        stopSlider(0, speed);
      });
      sliderIndicatorsBtn[9].addEventListener('mouseover', function () {
        clearInterval(timer);
        if (speed === 0) {
          speed = -180;
        } else {
          speed = -540;
        }
        stopSlider(1, speed);
      });
    }
    start();
    sliderIndicatorsBtnOver();
  })();
};
exports.boxHdArrow = function () {
  (function () {
    // 拿到元素
    var boxHdArrow = document.getElementsByClassName('box_hd_arrow1');
    for (var i = 0; i < boxHdArrow.length; i++) {
      boxHdArrow[i].addEventListener('mouseover', function () {
        this.setAttribute('class', 'box_hd_arrow1 box_hd_arrow');
      });
      boxHdArrow[i].addEventListener('mouseleave', function () {
        this.setAttribute('class', 'box_hd_arrow1');
      });
    }
  })();
};
exports.boxBottomOver = function () {
  (function () {
    // 拿到tab_body_item的元素
    var tabBodyItem = document.getElementsByClassName('tab_body_item');
    // 拿到tab_head_item的元素
    var tabHeadItem = document.getElementsByClassName('tab_head_item');
    var arr = [0, 1, 2, 3, 4];
    // 处理过滤结果
    function filterDom(index) {
      var manyArr = (0, _index.filterArr)(arr, index);
      manyArr.map(function (ele) {
        tabBodyItem[ele].style.display = 'none';
        tabHeadItem[ele].setAttribute('class', 'tab_head_item');
      });
      // 改变和index相等的DOM元素
      tabHeadItem[index].setAttribute('class', 'tab_head_item active');
      tabBodyItem[index].style.display = 'block';
    }

    var _loop = function _loop(i) {
      tabHeadItem[i].addEventListener('mouseover', function () {
        filterDom(i);
      });
    };

    for (var i = 0; i < tabHeadItem.length; i++) {
      _loop(i);
    }
  })();
};

exports.logoHover = function () {
  (function () {
    // 拿到元素
    var logoTextChildren = document.getElementsByClassName('logo-text')[0].children[0];
    // 拿到元素
    var scrollPoints = document.getElementsByClassName('scroll-points')[0];
    var goodsList = document.getElementsByClassName('goods-list')[0];
    var niceGoodsNiceRecommends = document.getElementsByClassName('nice-goods__recommends')[0];
    var scrollBar = document.getElementsByClassName('scroll-bar')[0];
    var speed = 0,
        sliderSpeed = 0,
        timer = void 0;
    // 拿到nice-goods__logo
    var niceGoodsLogo = document.getElementsByClassName('nice-goods__logo')[0];
    function mouseOver() {
      niceGoodsLogo.addEventListener('mouseover', function () {
        logoTextChildren.setAttribute('class', 'logo-text_show');
        scrollBar.style.opacity = 1;
        clearInterval(timer);
      });
      niceGoodsLogo.addEventListener('mouseleave', function () {
        logoTextChildren.removeAttribute('class');
        scrollBar.style.opacity = 0;
        clearInterval(timer);
        slider();
      });
    }
    function slider() {
      timer = setInterval(function () {
        if (speed < -1020 || sliderSpeed > 860) {
          speed = 0;
          sliderSpeed = 0;
          goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
          scrollPoints.style.left = sliderSpeed + 'px';
        } else {
          speed += -20.4;
          sliderSpeed += 17.2;
          goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
          scrollPoints.style.left = sliderSpeed + 'px';
        }
      }, 1000);
    }
    function sliderMove() {
      scrollPoints.addEventListener('mousedown', function (event) {
        var _this = this;

        var e = event || window.event;
        var offset = e.clientX - this.offsetLeft;
        document.onmousemove = function (event) {
          clearTimeout(timer);
          var e = event || window.event;
          var x = e.clientX - offset;
          if (x <= 0) {
            sliderSpeed = 0, speed = 0;
            _this.style.left = 0 + 'px';
            goodsList.style.transform = 'translate3d(0px,0,0)';
            return;
          } else if (x >= 861) {
            sliderSpeed = 861, speed = -1020;
            _this.style.left = 861 + 'px';
            goodsList.style.transform = 'translate3d(-1020px,0,0)';
            return;
          } else {
            if (x > sliderSpeed) {
              //  代表是往右边走的
              sliderSpeed = x;
              //console.log(speed);
              speed -= 28 * 0.1;
              goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
            } else {
              // 代表往左边走到
              sliderSpeed = x;
              speed += 25 * 0.1;
              goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
            }
            _this.style.left = x + 'px';
          }
        };
        document.onmouseup = function () {
          this.onmousemove = null;
          clearTimeout(timer);
          slider;
        };
      });
    }
    function niceMove() {
      niceGoodsNiceRecommends.addEventListener('mouseover', function () {
        // 显示scrollBar
        scrollBar.style.opacity = 1;
        // 停止定时器
        clearInterval(timer);
      });
      niceGoodsNiceRecommends.addEventListener('mouseleave', function () {
        // 显示scrollBar
        scrollBar.style.opacity = 0;
        // 停止定时器
        clearInterval(timer);
        slider();
      });
    }
    mouseOver();
    slider();
    sliderMove();
    niceMove();
  })();
};

exports.newArrival = function () {
  (function () {
    // 拿到newArrival_item_msg
    var newArrivalItemMsg = document.getElementsByClassName('newArrival_item_msg');
    // 拿到newArrival_item_name
    var newArrivalItemName = document.getElementsByClassName('newArrival_item_name');
    // 拿到newArrival_item_desc
    var newArrivalItemDesc = document.getElementsByClassName('newArrival_item_desc');
    // 拿到newArrival_item
    var newArrivalItem = document.getElementsByClassName('newArrival_item');
    // 拿到wrapper
    var wrapper = document.getElementsByClassName('slider_wrapper')[4];
    // 拿到左侧button按钮和右侧button按钮
    var sliderControlPrev = document.getElementsByClassName('slider_control_prev')[3];
    var sliderControlNext = document.getElementsByClassName('slider_control_next')[3];
    var timer = null,
        speed = 0,
        value = 1,
        arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 定义一个记录
    // 初始值
    function inittializeValue() {
      newArrivalItem[1].setAttribute('class', 'slider_item newArrival_item slider_active middleSlide');
      newArrivalItemMsg[1].setAttribute('class', 'newArrival_item_msg newArrival_item_msgActive');
      newArrivalItemDesc[1].setAttribute('class', 'newArrival_item_desc newArrival_item_descActive');
      newArrivalItemName[1].setAttribute('class', 'newArrival_item_name newArrival_item_nameActive');
    }
    // 开启定时器
    function sliderSpeed(speed, index) {
      var toArr = (0, _index.filterArr)(arr, index);
      toArr.map(function (ele) {
        // 更改和index不相关的标签
        newArrivalItem[ele].setAttribute('class', 'slider_item newArrival_item');
        newArrivalItemMsg[ele].setAttribute('class', 'newArrival_item_msg');
        newArrivalItemDesc[ele].setAttribute('class', 'newArrival_item_desc');
        newArrivalItemName[ele].setAttribute('class', 'newArrival_item_name ');
      });
      // 改变transition

      // 设置和index相关的样式
      newArrivalItem[index].setAttribute('class', 'slider_item newArrival_item slider_active middleSlide');
      wrapper.style.transform = 'translate3d(' + speed + 'px,0,0)';
      newArrivalItemMsg[index].setAttribute('class', 'newArrival_item_msg newArrival_item_msgActive');
      newArrivalItemDesc[index].setAttribute('class', 'newArrival_item_desc newArrival_item_descActive');
      newArrivalItemName[index].setAttribute('class', 'newArrival_item_name newArrival_item_nameActive');
    }
    function setSlider() {
      // 开启定时器
      timer = setInterval(function () {
        // 判断边界值
        if (speed === -910) {
          speed = 0;
          value = 1;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed += -130;
          value += 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
          setTimeout(function () {
            wrapper.style.transition = 'none 0s ease 0s';
          }, 500);
        }
        sliderSpeed(speed, value);
      }, 3000);
    }
    function setClick() {
      //sliderControlPrev给左侧按钮添加点击事件
      sliderControlPrev.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 判断一次speed的边界值
        if (speed >= 0) {
          speed = -390;
          value = 4;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed += 130;
          value -= 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
        }
        // 调用方法
        sliderSpeed(speed, value);
        // 通过setTimeout来开启定时器
        setTimeout(function () {
          clearInterval(timer);
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
          setSlider();
        }, 2000);
      };
      // 给右侧添加点击事件
      sliderControlNext.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 让speed减减,value+= 1;
        // 判断speed的边界值
        if (speed <= -910) {
          speed = 0;
          value = 1;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed -= 130;
          value += 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
        }
        // 调用方法
        sliderSpeed(speed, value);
        // 通过setTimeout来开启定时器
        setTimeout(function () {
          clearInterval(timer);
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
          setSlider();
        }, 2000);
      };
    }
    inittializeValue();
    setSlider();
    setClick();
  })();
};

exports.newTopInner = function () {
  (function () {
    // 难道元素tab_head[1]中在子元素
    var tabHeadItem = document.getElementsByClassName('tab_head')[1].children;
    // 拿到tab_body_item1中的元素
    var tabBodyItem = document.getElementsByClassName('tab_body_item1');
    // 数组
    var arr = [0, 1, 2, 3];
    // 设置初始值
    function inittialize() {
      // 设置tabHeadItem中的数组0的class
      tabHeadItem[0].setAttribute('class', 'tab_head_item1 active');
    }
    // 写一个方法,来实现tabBodyItem移入事件
    function tabBodyClick() {
      var _loop2 = function _loop2(i) {
        tabHeadItem[i].addEventListener('mouseover', function () {

          // 通过直接域中i来改变和arr不相干值

          var toArr = (0, _index.filterArr)(arr, i);
          toArr.map(function (ele) {
            tabHeadItem[ele].setAttribute('class', 'tab_head_item1');
            tabBodyItem[ele].style.display = 'none';
          });
          // 改变和i相关的元素
          tabBodyItem[i].style.display = 'block';
          this.setAttribute('class', 'tab_head_item1 active');
        });
      };

      // 通过for循环来给每一个tabHeadItem添加移入事件
      for (var i = 0; i < tabHeadItem.length; i++) {
        _loop2(i);
      }
    }
    inittialize();
    tabBodyClick();
  })();
};
exports.getfeedTabItem = function () {
  (function () {
    // 拿到数据
    var feedTabItem = document.getElementsByClassName('feed-tab__item');
    var feedTabItemTitleText = document.getElementsByClassName('feed-tab__item-title-text');
    // 设置初始值
    function getOne() {
      feedTabItem[0].setAttribute('class', 'feed-tab__item feed-tab__item--active');
      //减少feedTabItem中的长度
      // 通过for循环来给feedTabItem来设置属性
      for (var i = 0; i < 5; i++) {
        var div = document.createElement('div');
        div.setAttribute('class', 'feed-tab__item-gap');
        // 往feedTabItem添加元素
        feedTabItem[i].appendChild(div);
      }
    }
    getOne();
  })();
};

exports.getBottomData = function () {
  (function () {
    // 获取元素
    var more2List = document.getElementsByClassName('more2_list')[0];
    var feedTabItem = document.getElementsByClassName('feed-tab__item');
    var arr = [0, 1, 2, 3, 4, 5];
    // 请求路由
    function getUrl() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/GueesYouLinkIt";

      _axios2.default.get(url).then(function (data) {
        var result = '';
        for (var i = 0; i < data.data.length; i++) {
          result += '<li class="more2_item more2_item_good hover-on">\n          <span class="more2_item_gdot"></span>\n          <a class="more2_lk">\n            <div class="lazyimg lazyimg_loaded more2_img">\n               <img src="' + data.data[i].imageUrl + '" class="lazyimg_img">\n            </div>\n            <div class="more2_info">\n               <p class="more2_info_name">\n                 ' + data.data[i].title + '\n               </p>\n              <div class="more2_info_price more2_info_price_plus more2_info_price_newcomer">\n                <div class="mod_price">\n                   <i>\uFFE5</i>\n                   <span class="more2_info_price_txt">\n                      ' + data.data[i].price + '.\n                      <span class="more2_info_price_txt-decimal">' + data.data[i].decimal + '</span>\n                   </span>\n                </div>\n                <div class="more2_price_plus">\n                  <div class="more2_discount">\u5238</div>\n                </div>\n                <div class="more2_item_hover">\n                  <div class="more2_item_delete">\n                  </div>\n                  <div class="more2_item_hd">\n                    <div class="more2_item_btn more2_btn_find enable">\n                       <i class="more2_btn_icon"></i>   \n                       <span>\u627E\u76F8\u4F3C</span>\n                    </div>\n                 </div>\n                </div>\n              </div>\n            </div>\n          </a>\n       </li>\n          ';
        }
        more2List.innerHTML = result;
      }).catch(function (err) {
        console.log(err);
      });
    }
    // 点击事件
    function feedClick() {
      var _loop3 = function _loop3(i) {
        feedTabItem[i].onclick = function (event) {
          // 阻止默认事件
          event.stopPropagation();
          //
          callback(i);
        };
      };

      // 通过for循环来变量数组
      for (var i = 0; i < feedTabItem.length; i++) {
        _loop3(i);
      }
    }
    function callback(i) {
      var url = '';
      switch (i) {
        case 0:
          url = '/GueesYouLinkIt';
          break;
        case 1:
          url = '/intelligentPioneer';
          break;
        case 2:
          url = '/homeQualityProducts';
          break;
        case 3:
          url = '/fashionInsider';
          break;
        case 4:
          url = '/shopping';
          break;
        case 5:
          url = '/ImportedGoods';
          break;
      }
      // 通过filterArr来过滤数组
      var toArr = (0, _index.filterArr)(arr, i);
      // 通过toArr来改变和i不相干的值
      toArr.map(function (ele) {
        feedTabItem[ele].setAttribute('class', 'feed-tab__item');
      });
      // 改变和i相关的值
      feedTabItem[i].setAttribute('class', 'feed-tab__item feed-tab__item--active');
      // 获取后端值
      getUrl(url);
    }
    getUrl();
    feedClick();
  })();
};
},{"./index":31,"axios":2}],29:[function(require,module,exports){
'use strict';

var _index = require('./index');

exports.middleNavImage = function () {
  (function () {
    // 引入slider_wrapper中的li
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[0].children;
    // 引入slider_indicators中的i
    var sliderIndicators = document.getElementsByClassName('slider_indicators')[0].children;
    // 拿到左侧点击按钮slider_control_prev
    var buttonLeft = document.getElementsByClassName('slider_control_prev')[0];
    // 拿到右侧点击按钮
    var buttonRight = document.getElementsByClassName('slider_control_next')[0];
    // 拿到sliderBannerWrapper元素
    var sliderList = document.getElementsByClassName('slider_list')[0];
    var id = 0,
        timer = void 0;
    var arr = [0, 1, 2, 3, 4, 5, 6, 7];
    function test(i) {
      var toArr = (0, _index.filterArr)(arr, i);
      toArr.map(function (ele) {
        sliderWrapper[ele].style.opacity = 0;
        sliderWrapper[ele].style.zIndex = 0;
        sliderIndicators[ele].style.cssText = "width: 8px;height: 8px;background: rgba(255,255,255,.4)";
      });

      // 改变
      sliderWrapper[i].style.opacity = 1;
      sliderWrapper[i].style.zIndex = 1;
      // 改变和i相关的属性 
      sliderIndicators[i].style.cssText = 'width: 9px;height: 9px;background: #ffff';
    }
    function motain() {
      timer = setInterval(function () {
        id += 1;
        if (id === 8) {
          id = 0;
        }
        test(id);
      }, 3000);
    }
    // 按钮移入事件
    function buttonMotain() {
      var _loop = function _loop(i) {
        // 给sliderIndicators添加移入事件
        sliderIndicators[i].onmouseover = function () {
          // 当移入的时候改变id的指向,停止定时器
          clearInterval(timer);
          // 改变id 
          id = i;
          test(i);
          setTimeout(function () {
            clearInterval(timer);
            motain();
          }, 1000);
        };
      };

      // 通过for循环来遍历元素
      for (var i = 0; i < sliderIndicators.length; i++) {
        _loop(i);
      }
    }
    function buttonClick() {
      // 给左侧buttonLeft添加点击事件
      buttonLeft.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 让id相减
        id -= 1;
        // 判断一下边界值,如果id超过了0的话,
        if (id === -1) {
          id = 7;
        }
        test(id);
        setTimeout(function () {
          clearInterval(timer);
          motain();
        }, 2000);
      };
      // 给右侧buttonLeft添加点击事件
      buttonRight.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 判断边界值,如果id > 7
        id += 1;
        if (id === 8) {
          id = 0;
        }
        test(id);
        // 通过定时器延迟加载
        setTimeout(function () {
          clearInterval(timer);
          motain();
        }, 2000);
      };
    }
    function sliderOver() {
      sliderList.onmouseover = function () {
        // 停止定时器
        clearInterval(timer);
      };
      sliderList.onmouseleave = function () {
        clearInterval(timer);
        motain();
      };
    }
    motain();
    buttonMotain();
    buttonClick();
    sliderOver();
  })();
}; /*中间行为*/

exports.middleNavRight = function () {
  (function () {
    // 拿到左边的button和右边的button
    var buttonLeft = document.getElementsByClassName('slider_control_prev')[1];
    // 拿到右边的button
    var buttonRight = document.getElementsByClassName('slider_control_next')[1];
    // 拿到slider_wrapper
    var sliderWrapper1 = document.getElementsByClassName('slider_wrapper')[1];
    // 定义一个timer,和id来通过定时器来计算
    var timer = void 0,
        id = 0;
    // 拿到sliderWrapper1中的children
    var wrapper = sliderWrapper1.children;
    // 定义数组
    var arr = [0, 1, 2];
    function monitorId(id) {
      // 过滤数组中和id不相干的值
      var toArr = (0, _index.filterArr)(arr, id);
      toArr.map(function (ele) {
        wrapper[ele].style.opacity = 0;
        wrapper[ele].style.zIndex = 0;
      });
      wrapper[id].style.opacity = 1;
      wrapper[id].style.zIndex = 1;
    }
    function wrapperOver() {
      // 给sliderWrapper1添加移入事件
      document.getElementsByClassName('slider_list')[1].onmouseover = function () {
        // 显示buttonLeft和buttonRight
        buttonLeft.style.display = 'block';
        buttonRight.style.display = 'block';
      };
      // 给sliderWrapper1添加点击事件
      sliderWrapper1.onmouseover = function () {
        // 停止定时器
        clearInterval(timer);
      };
      // 当sliderWrapper移出的时候
      sliderWrapper1.onmouseleave = function () {
        // 清空累加器
        clearInterval(timer);
        // 让button隐藏
        buttonLeft.style.display = 'none';
        buttonRight.style.display = 'none';
        setId();
      };
    }
    function setId() {
      timer = setInterval(function () {
        id += 1;
        if (id === 3) {
          id = 0;
        }
        monitorId(id);
      }, 8000);
    }
    function buttonClick() {
      // 给buttonLeft添加点击事件
      buttonLeft.onclick = function (event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id -= 1;
        if (id === -1) {
          id = 2;
        }
        setTimeout(function () {
          clearInterval(timer);
          setId();
        }, 2000);
        monitorId(id);
      };
      // 给右侧点击添加事件
      buttonRight.onclick = function (event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id += 1;
        if (id === 3) {
          id = 0;
        }
        setTimeout(function () {
          clearInterval(timer);
          setId();
        }, 2000);
        monitorId(id);
      };
    }
    wrapperOver();
    setId();
    buttonClick();
  })();
};

exports.middleRight = function () {
  (function () {
    // 拿到service_list中的children
    var serviceItem = document.getElementsByClassName('service_list')[0].children;
    // 拿到service_txt中的文本
    var serviceText = document.getElementsByClassName('service_txt');
    // 拿到hover的img标签
    var serviceImgHover = document.getElementsByClassName('service_ico_img_hover');
    // 定义数组
    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // 显示hover的图片
    function showHover(index) {
      // 通过移入事件来显示index
      var toArr = (0, _index.filterArr)(arr, index);
      // 隐藏和index没有关系的东西
      toArr.map(function (ele) {
        serviceImgHover[ele].style.opacity = 0;
        serviceText[ele].style.color = 'block';
      });
      // 改变和serviceImgHover和i相关的元素
      serviceImgHover[index].style.opacity = 1;
      serviceText[index].style.color = '#e1251b';
    }
    function serviceItemClick() {
      var _loop2 = function _loop2(i) {
        serviceItem[i].onmouseover = function () {
          showHover(i);
        };
        serviceItem[i].onmouseleave = function () {
          arr.map(function (ele) {
            serviceText[ele].style.color = 'black';
            serviceImgHover[ele].style.opacity = 0;
          });
        };
      };

      // 通过for循环来处理结果
      for (var i = 0; i < serviceItem.length; i++) {
        _loop2(i);
      }
    }
    serviceItemClick();
  })();
};
},{"./index":31}],30:[function(require,module,exports){
'use strict';

/* 中间搜索框*/
exports.searchRandom = function () {
  (function () {
    // 拿到搜索框
    var form = document.getElementsByClassName('form')[0];
    // 拿到form中的框
    var text = form.getElementsByClassName('text')[0];
    // 定义随机数
    var arr = ['欧米茄', '行车记录仪高清', '5G好物盛典', '路由器', '地球仪', '爱普生打印机', '云南白药牙膏', '格力变频空调', '澳柯玛冰柜', '好孩子婴儿推车'];
    // 定义计时器
    var timer = null;
    // 定义一个funcgtion
    function start() {
      timer = setInterval(function () {
        // 开启随机数
        var target = parseInt(Math.random() * arr.length);
        // 改变搜索框中的内容
        text.setAttribute('placeholder', arr[target]);
      }, 4000);
    }
    // 当搜索框点击的时候停止定时器
    text.onclick = function (event) {
      // 阻止默认事件
      event.stopPropagation();
      // 停止定时器
      clearInterval(timer);
    };
    // 当text离开的时候给body添加点击事件
    text.onmouseleave = function () {
      // 给body添加点击事件
      document.getElementsByTagName('body')[0].onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 因为定时器会有累计效果,所以要先清除累加器
        clearInterval(timer);
        start();
      };
    };
    start();
  })();
};
/*导出导航栏在东西*/
exports.navBtnRandom = function () {
  // 拿到style-red元素
  var styleRed = document.getElementById('specHotWord');
  // 定时器的标记
  var timer = null;
  // 定义一个定时器方法
  function start() {
    timer = setInterval(function () {
      if (styleRed.innerText === '阅读伴成长') {
        // 改变文本
        styleRed.innerText = '家电超级五';
      } else {
        styleRed.innerText = '阅读伴成长';
      }
    }, 2000);
  }
  // 当styleRed移入的时候
  styleRed.onmouseover = function () {
    // 停止定时器
    clearInterval(timer);
  };
  // 当styleRed移出的时候
  styleRed.onmouseleave = function () {
    // 重新开启定时器
    clearInterval(timer);
    start();
  };
  start();
};
exports.setHeader = function () {
  (function () {
    // 获取搜索框
    var search = document.getElementById('search');
    // 拿到search-logo中的元素
    var searchLogo = document.getElementsByClassName('search-logo')[0];
    // 拿到feed-tab-wrapper元素
    var feedTabWrapper = document.getElementsByClassName('feed-tab-wrapper')[0];
    //获得页面向上卷动的距离
    function getScroll() {
      return {
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      };
    }
    window.onscroll = function () {
      if (getScroll().top >= 500) {
        // 设置search的class
        search.setAttribute('class', 'search-fix');
        searchLogo.style.display = 'block';
      } else {
        // 删除search的class
        search.removeAttribute('class');
        searchLogo.style.display = 'none';
      }
      // 如果页面大于3100 设置feedTabWrapper的样式
      if (getScroll().top > 3100) {
        feedTabWrapper.setAttribute('class', 'grid_c1 feed-tab-wrapper feed-tab-wrapper--fixed');
      } else if (getScroll().top <= 3050) {
        feedTabWrapper.setAttribute('class', 'grid_c1 feed-tab-wrapper');
      }
    };
  })();
};
},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var filterArr = exports.filterArr = function filterArr(arr, index) {
    var filterArr = arr.filter(function (value) {
        return index !== value;
    });
    return filterArr;
};
},{}],32:[function(require,module,exports){
'use strict';

var _shortcut = require('./shortcut');

var _header = require('./header');

var _center = require('./center');

var _bottom = require('./bottom');

(0, _shortcut.shortcutLeft)();
(0, _header.searchRandom)();
(0, _header.navBtnRandom)();
(0, _center.middleNavImage)();
(0, _center.middleNavRight)();
(0, _header.setHeader)();
(0, _center.middleRight)();
(0, _bottom.bottomSeckill)();
(0, _bottom.bottomSlider)();
(0, _bottom.bottomWrapper)();
(0, _bottom.boxHdArrow)();
(0, _bottom.boxBottomOver)();
(0, _bottom.logoHover)();
(0, _bottom.newArrival)();
(0, _bottom.newTopInner)();
(0, _bottom.getfeedTabItem)();
(0, _bottom.getBottomData)();
},{"./bottom":28,"./center":29,"./header":30,"./shortcut":33}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortcutLeft = undefined;

var _index = require('./index');

// 导出一个导航栏左侧的行为
var shortcutLeft = exports.shortcutLeft = function shortcutLeft() {
  (function () {
    // 拿到左侧的导航栏
    var fl = document.getElementsByClassName('fl')[0];
    // 拿到左侧的导航栏的里面的shortcut_btn元素
    var shortcutBtn = fl.getElementsByClassName('shortcut_btn')[0];
    // 拿到需要改变的text文本
    var uiCityText = shortcutBtn.getElementsByClassName('ui-areamini-text')[0];
    // 拿到dropdown-layer
    var dropdownLayer = fl.getElementsByClassName('dropdown-layer')[0];
    // 拿到dropdown-layer中的item元素
    var dropdownLayerItem = document.getElementsByClassName('ui-areamini-content-list')[0].children;
    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    // 监听fl移入和移出的事件
    function flOnmouseOver() {
      // 当fl移入的时候显示dropdown-layer
      fl.onmouseover = function () {
        dropdownLayer.style.display = 'block';
      };
      // 当fl移出的时候隐藏dropdown-layer
      fl.onmouseleave = function () {
        dropdownLayer.style.display = 'none';
      };
    }
    // 遍历所有的dropdownLayerItem的坐标,并添加行为
    function itemClick() {
      // 通过for循环来遍历所有的数组并添加点击事件 setAttribute removeAttribute
      var manyA = [];

      var _loop = function _loop(i) {
        manyA.push(dropdownLayerItem[i].getElementsByTagName('a')[0]);
        // 给dropdownLayerItem添加点击事件
        dropdownLayerItem[i].onclick = function (event) {
          // 阻止事件冒泡
          event.stopPropagation();
          var arrMap = (0, _index.filterArr)(arr, i);
          arrMap.map(function (ele) {
            manyA[ele].removeAttribute('class');
          });
          // 改变和i相关的样式
          manyA[i].setAttribute('class', 'selected');
          // 让many[i].innerText等于 uiCityText
          uiCityText.innerText = manyA[i].innerText;
          // 更改this.style.backgroundColor
          this.style.backgroundColor = '#fff';
          // 关闭dropdownLayer
          dropdownLayer.style.display = 'none';
        };
        // 给dropdownLayerItem添加移入事件
        dropdownLayerItem[i].onmouseover = function (event) {
          // 拿到自己的子元素
          var a = this.getElementsByTagName('a')[0];
          var getDate = a.getAttribute('class');
          // 如果有的话就不干事情
          if (getDate) {
            return;
          }
          // 添加移入属性样式
          var arrMap = (0, _index.filterArr)(arr, i);
          arrMap.map(function (ele) {
            dropdownLayerItem[ele].style.backgroundColor = '#fff';
          });
          // 更改和i相关的样式
          this.style.backgroundColor = '#f4f4f4';
        };
      };

      for (var i = 0; i < dropdownLayerItem.length; i++) {
        _loop(i);
      }
    }
    flOnmouseOver();
    itemClick();
  })();
}; // 工具包
},{"./index":31}]},{},[32]);
