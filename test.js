/* eslint-env mocha */
'use strict'
var assert = require('assert')
var fs = require('fs')
var pathExists = require('path-exists')
var tempfile = require('tempfile')
var JsonStore = require('./')
var jsonStorePath = new JsonStore(tempfile('.json')).path

beforeEach(function () {
	fs.unlinkSync(jsonStorePath)
	this.store = new JsonStore(jsonStorePath)
})

it('.set() and .get()', function () {
	this.store.set('foo', 'bar')
	assert.equal(this.store.get('foo'), 'bar')
})

it('.set() with object and .get()', function () {
	this.store.set({
		foo1: 'bar1',
		foo2: 'bar2'
	})
	assert.equal(this.store.get('foo1'), 'bar1')
	assert.equal(this.store.get('foo2'), 'bar2')
})

it('.del()', function () {
	this.store.set('foo', 'bar')
	this.store.del('foo')
	assert.notEqual(this.store.get('foo'), 'bar')
})

it('.clear()', function () {
	this.store.set('foo', 'bar')
	this.store.set('foo1', 'bar1')
	this.store.clear()
	assert.equal(this.store.size, 0)
})

it('.all', function () {
	this.store.set('foo', 'bar')
	assert.equal(this.store.all.foo, 'bar')
})

it('.size', function () {
	this.store.set('foo', 'bar')
	assert.equal(this.store.size, 1)
})

it('.path', function () {
	this.store.set('foo', 'bar')
	assert(pathExists.sync(this.store.path))
})

it('should use default value', function () {
	var conf = new JsonStore(jsonStorePath, {foo: 'bar'})
	assert.equal(conf.get('foo'), 'bar')
})

it('make sure `.all` is always an object', function () {
	fs.unlinkSync(jsonStorePath)
	assert.doesNotThrow(function () {
		this.store.get('foo')
	}.bind(this))
})
