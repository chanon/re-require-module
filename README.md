re-require-module
=========

## What is it?

Drop-in replacement for node.js ```require``` that always reads the required module again from disk. It actually automatically uncaches it before requiring it again for you. This allows changes to become live without restarting node. It is like a simple hot require. It is also similar to ```decache``` except it also does the ```require``` again part for you.

## Why and when would I use this?

* Are you tired of having to restart your node server everytime you make a change to your server code?
* Is code (such as request handlers) in your modules usually pure functions?

If so, then ```re-require-module``` is an easy, simple and lightweight way for you to achieve 'hot' style code reloading. 

The way ```re-require-module``` works is it just uncaches the module you give it, before returning what you'd usually get out of ```require```. This way whatever change you make is always loaded at the point in code that you ```reRequire``` it.

When using it, the key thing to make it work is that, you must put the ```reRequire``` call somewhere where it will be called each time a request is made.

Also note that if your module has state inside, the state will be wiped out on ```reRequire```.

## Production Ready

You can actually leave your ```reRequire``` call in production. ```re-require-module``` detects that if in production mode, it will not reload code and will hit the disk only on the first ```reRequire``` call.

## Install

```npm install re-require-module --save```

## Example Usage

```
// app.js
var http = require('http');
var reRequire = require('re-require-module').reRequire;

var server = http.createServer(function(req, res) {
  // put reRequire in here so that a reRequire is made on each request
	reRequire('./handler').handleRequest(req, res);
});

server.listen(8080);

```

```
// handler.js
module.exports.handleRequest = function(req, res){
    res.end('Try editing this and refresh. No need to restart node!');
}
```

## Trying out the example

- Run the example:
```
node example/app
```
- Open your browser to ```http://localhost:8080```.
- Try editing the text in ```handler.js```
- Refresh and see the changes immediately. No need to restart node.
