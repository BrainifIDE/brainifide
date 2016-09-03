import EventEmitter from 'events';

const snippetsEventEmitter = new EventEmitter();

snippetsEventEmitter.emitSnippet = function(snippet, comment) {
  this.emit('snippets', snippet, comment);
};

snippetsEventEmitter.addSnippetsListener = function(fn) {
  this.addListener('snippets', fn);
};

snippetsEventEmitter.removeSnippetsListener = function(fn) {
  this.removeListener('snippets', fn);
};

export default snippetsEventEmitter;
