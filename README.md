[![Build Status](https://travis-ci.org/dchambers/crosstalkjs.png)](https://travis-ci.org/dchambers/crosstalkjs)

# CrossTalkJs

CrossTalkJs is useful anywhere you are constrained to using `postMessage()` to communicate across origins.

For example, when communicating to:

  * An external window
  * An internal frame
  * An iframe
  * A web worker


## The Problem

As a backgrounder, without CrossTalkJs you would:

  * Listen on your own window using `window.addEventListener('message', callback, false)`.
  * Post messages to remote windows using `remoteWindow.postMessage(someData, origin)`.

This is fine, but requires you to funnel all incoming communication through a single function, and then write marshalling code so that the appropriate objects in the local context can be affected in the appropriate ways.

For large applications, this single funnelling function becomes a barrier to scalability. For all applications, having to communicate by sending messages rather than invoking methods, reduces productivity and leads to messier code.


## CrossTalkJs

CrossTalkJs solves this as follows:

  1. Your application can register as many _service_ objects as necessary to expose all remotely accessible functionality within the local window.
  2. Remote windows communicate asynchronously with the _service_ objects by being given a local _proxy_ object that has exactly the same shape as the remote _service_ object they are proxying to, but which returns a _promise_ to deal with any asynchronicity.
  3. The methods on _service_ objects can receive any data that can be serialized using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm), as is the case for `window.postMessage()`.
  4. Methods can also be passed references to local _call-back_ functions, without the developer having to write any complex management or marshalling code.

Let's take a concrete example. Suppose your application has the following _user-service_ that can be used to retrieve user credentials for a given user:

```
function UserService(userCredentials) {
	this.userCredentials = userCredentials;
}

UserService.prototype.requestUserCredentials = function(username) {
	if(!username) throw new Error("No such user '" + username  + "'.");

	return this.userCredentials[username];
};
```

then we could register this service using the following code:

```
var allowedOrigins = ['http://bar.com', 'http://baz.com'];
var localRegistry = crosstalk.createRegistry(window, allowedOrigins);

localRegistry.registerService('user-service', new UserService({}));
```

If the local application (at origin `http://foo.com`) then opens a couple of external windows (at origins `http://bar.com` and `http://baz.com`), with the commands:

```
window.open('http://bar.com/external-window.html', 'External Window #1');
window.open('http://baz.com/external-window.html', 'External Window #2');
```

then these windows can make use of _user-service_ as follows:

```
var remoteRegistry = crosstalk.accessRegistry(window.opener, 'http://foo.com');
remoteRegistry.connect().then(function() {
	var userService = remoteRegistry.serviceProxy('user-service');

	userService.requestUserCredentials('Bob').then(function(userCredentials) {
		console.log('Bob's credentials are ' + JSON.stringify(userCredentials));
	}, function(errorMessage) {
		console.error('Unable to retrieve Bob's user credentials: ' + errorMessage)
	});
}, function(errorMessage) {
	console.error('Unable to access the remote registry: ' + errorMessage)
})
```

You will notice that a _promise_ has been returned by the local _proxy_ object, even though the remote _service_ object was written to be fully synchronous.


## Custom Promises

We saw previously that _service_ objects can be written synchronously, and CrossTalkJs takes care of the marshalling code necesarry to be able to provide a _promise_ via the local _proxy_ object. Sometimes however, the _service_ object itself may need to return it's data asynchronously. This is handled by returning a _promise_ from the _service_ object.

In the following code example we re-implement `UserService` so that it uses an `XMLHttpRequest` object to request the user-credentials asynchronously from a RESTful service:

```
function UserService(restServiceUrl) {
	this.restServiceUrl = restServiceUrl;
}

UserService.prototype.requestUserCredentials = function(username) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.restServiceUrl);

		xhr.onload = function() {
			if (xhr.status == 200) {
				resolve(xhr.response);
			}
			else {
				reject(Error(xhr.statusText));
			}
		};

		xhr.onerror = function() {
			reject(Error("Network Error"));
		};

		xhr.send();
	});
};
```

Of course, in a real application you'd use a promise wrapper for XHR (like [request-promise](https://www.npmjs.org/package/request-promise)) so you don't need to keep repeating yourself, and instead write code like this:

```
function UserService(restServiceUrl) {
	this.restServiceUrl = restServiceUrl;
}

UserService.prototype.requestUserCredentials = function(username) {
	return rp(this.restServiceUrl);
};
```

Regardless of which flavour of _promise_ you return from your _service_ object, on the client you will be given a standard ES6 `Promise` object. 


## Callback Functions

Sometimes it's useful to be able to provide references of your local functions to a remote _service_, so the service can issue call-backs as events occur. A good example of this would a _message-hub_ service using the _emitter_ pattern, where references to call-back functions need to be provided to the remote-side.

For example:

```
var eventHub = remoteRegistry.serviceProxy('event-hub');

eventHub.on('user-joins', function(username) {
	console.log("user '" username "' has joined the session.");
});

eventHub.on('user-leaves', function(username) {
	console.log("user '" username "' has left the session.");
});
```

Since functions can never be passed using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm), any arguments of type `Function` are always considered to be call-back functions, with CrossTalkJs automatically marshalling messages to the them rather than passing them to the remote side.

Like _services_, call-back functions can provide return values which are made available to the originating _service_ using a _promise_. This can be used to implement much richer call-back functionality than for our simple _emitter_ use-case.



## Transferable Objects

For performance reasons, `window.postMessage()` supports the idea of _transferable_ objects, which allows large binary or data-intensive objects to be transferred rather than copied. You can use the `crosstalk.transferableObj()` method to denote an argument as being _transferable_.

For example:

```
worker.doWork(crosstalk.transferableObj(binaryData));
```

## Web Workers

The `Worker.postMessage()` method is subtly different from the `Window.postMessage()` method. Apart from the obvious difference in their APIs (`Worker.postMessage()` doesn't have an `origin` argument), there are some differences in their usage too:

  1. Messages posted on a _worker_ are only received by the _other-side_, whereas message posted on a _window_ are received by all observers, including the originating window if it also has a listener registered.
  2. There is no _origin_ security check since the worker is limited to a single JavaScript file of the opener's choosing.

Despite these differences, CrossTalkJs's `crosstalk.createRegistry()` and `crosstalk.accessRegistry()` methods can be used with _worker_ references in exactly the same way, as they are otherwise used with _window_ references.


## Proxy Typing

When you request a proxy for a remote service with the `serviceProxy()` method it's also possible to specify the type you expect the remote service to have, where a shape-based type check will be performed on your behalf.

For example:

```
var obj = remoteRegistry.serviceProxy('user-service', UserService);
```

Although you could do a shape-based check yourself (e.g. using `topiarist.fulfills()` from the [topiarist](https://github.com/BladeRunnerJS/topiarist) library), this has the additional benefit that the proxy object returned to you will actually extend the given class, so that your the proxy will pass any subsequent `instanceof` checks.

This code snippet would log `success!` to the console for example:

```
var obj = remoteRegistry.serviceProxy('user-service', UserService);

if(obj instanceof UserService) {
	console.log('success!');
}
```

