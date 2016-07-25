'use strict';

var _ = require('lodash');

function Scope () {
	this.$$watchers = [];
	this.$$asyncQueue = [];
	this.$$phase = null;
	this.$$postDigestQueue =[];
};

Scope.prototype.$watch = function (watchFn, listenerFn,valueEq) {
	var its = this;
	var watcher = {
		watchFn: watchFn,
		listenerFn: listenerFn || function () {},
		valueEq : !!valueEq
	};
	this.$$watchers.push(watcher);
	return function () {
		var point = its.$$watchers.indexOf(watcher);
		if (point>=0) {
			its.$$watchers.splice(point,1);
		}
	};
}; 

Scope.prototype.$digest = function () {
	var max = 10;
	var dirty;
	this.$beginPhase('$digest');
	do {
		while(this.$$asyncQueue.length){
			try{
		var asyncTask = this.$$asyncQueue.shift();
		this.$eval(asyncTask.expression); 
		} catch (e) 
		{
			console.log(e);
		}
	}
	dirty = this.digestOnce();
	max--;
	if ((dirty< 0) && (max<0)) {
		this.$stopPhase();
		}
	}
	while (dirty);
	this.$stopPhase();
	while (this.$$postDigestQueue.lenght){
		try {
			this.$$postDigestQueue.shift()();
		} catch (e) {
			console.log (e);
		}
	
	}
};

Scope.prototype.$eval = function (expr, incArgs) {
	return expr (this, incArgs);
};

Scope.prototype.$apply = function (incFn) {
	try {
		return this.$eval(incFn);
	} finally {
		this.$digest();
	}
};

Scope.prototype.$evalAsync = function(exprFn) {
	this.$$asyncQueue.push(
		{
			scope:this, 
			expression : exprFn
		}
		);
};

Scope.prototype.$beginPhase = function (incFn) {
	if (this.$$incFn) {
		throw this.$$incFn + 'in progress'; 
	}
	else {
		this.incFn = incFn;
	}
};

Scope.prototype.$stopPhase = function () {
	this.$$incFn = null;
};

Scope.prototype.$$postDigest = function (incmFn) {
	this.$$postDigestQueue.push(incmFn);
};

Scope.prototype.$$Equal = function (newVal, oldVal, valEq) {
	if (valEq) {
		return _.isEqual (newVal, oldVal);
	} else {
		return newVal == oldVal;
	}
};

Scope.prototype.$$digestOnce = function () {
	var its = this;
	var dirty;
	_.forEach(this.$$watchers, function (watcherFn))	{
		var newVal = watcherFn.watchFn(its);
		var oldVal = watcherFn.last;
		if (!its.$$Equal(newVal, oldVal, watcherFn.valueEq)) {

			watcherFn.listenerFn(newVal, oldVal, its);
			dirty = true;
		}
		watcherFn.last = newVal;

	});
	return dirty;
};
