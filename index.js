'use strict'
var path = require('path')
var fs = require('graceful-fs')
var assign = require('object-assign')
var mkdirp = require('mkdirp')
var writeFileAtomic = require('write-file-atomic')

var permissionError = 'You don\'t have access to this file.'
var defaultPathMode = parseInt('0700', 8)
var writeFileOptions = {mode: parseInt('0600', 8)}

function SimpleJsonStore(filePath, defaults) {
	this.path = path.resolve(filePath)
	this.all = assign({}, defaults || {}, this.all || {})
}

SimpleJsonStore.prototype = Object.create(Object.prototype, {
	all: {
		get: function () {
			try {
				return JSON.parse(fs.readFileSync(this.path, 'utf8'))
			} catch (err) {
				// create dir if it doesn't exist
				if (err.code === 'ENOENT') {
					mkdirp.sync(path.dirname(this.path), defaultPathMode)
					return {}
				}

				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n'
				}

				// empty the file if it encounters invalid JSON
				if (err.name === 'SyntaxError') {
					writeFileAtomic.sync(this.path, '', writeFileOptions)
					return {}
				}

				throw err
			}
		},
		set: function (val) {
			try {
				// make sure the folder exists as it
				// could have been deleted in the meantime
				mkdirp.sync(path.dirname(this.path), defaultPathMode)

				writeFileAtomic.sync(this.path, JSON.stringify(val, null, '\t'), writeFileOptions)
			} catch (err) {
				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n'
				}

				throw err
			}
		}
	},
	size: {
		get: function () {
			return Object.keys(this.all || {}).length
		}
	}
})

SimpleJsonStore.prototype.get = function (key) {
	return this.all[key]
}

SimpleJsonStore.prototype.set = function (key, val) {
	var config = this.all
	if (arguments.length === 1) {
		Object.keys(key).forEach(function (k) {
			config[k] = key[k]
		})
	} else {
		config[key] = val
	}
	this.all = config
}

SimpleJsonStore.prototype.del = function (key) {
	var config = this.all
	delete config[key]
	this.all = config
}

SimpleJsonStore.prototype.clear = function () {
	this.all = {}
}

module.exports = SimpleJsonStore
