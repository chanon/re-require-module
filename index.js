var path = require('path');
var fs = require('fs');

// taken from callsites module
function callsites() {
	var _ = Error.prepareStackTrace;
	Error.prepareStackTrace = function (_, stack) {
		return stack;
	};
	var stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _;
	return stack;
};

function exists(path) {
	try {
		fs.statSync(path);
		return true;
	}
	catch (e) {
		return false;
	}
}

var existsCache = {};

// caches the 'exists' results so we don't hit the file system everytime in production
function existsCached(testPath) {
	if (existsCache[testPath] == 1) {
		return true;
	}
	if (existsCache[testPath] == 0) {
		return false;
	}
	if (exists(testPath)) {
		existsCache[testPath] = 1;
		return true;
	}
	else {
		existsCache[testPath] = 0;
		return false;
	}
}

var environment = process.env.NODE_ENV || 'development';

module.exports.reRequire = function (moduleName) {

	// this part, we basically see whether the moduleName is supposed to be a node_modules module, or a relative path

	var callerPath = callsites()[1].getFileName();
	var testRelativePath = path.resolve(path.dirname(callerPath), moduleName);

	if (testRelativePath.substr(testRelativePath.length - 3, 3) != '.js') {
		// we only support js files for now
		testRelativePath = testRelativePath + '.js';
	}

	var modulePath = moduleName;
	if (existsCached(testRelativePath)) {
		modulePath = testRelativePath;
	}

	// for development mode, we delete the cached module
	
	if (environment == 'development') {
		// we just delete this module
		// other modules delete also all submodules loaded by this module - which is overkill and can cause a lot of slowness
		delete require.cache[modulePath];
	}
	
	// return the require result
	
	return require(modulePath);
}