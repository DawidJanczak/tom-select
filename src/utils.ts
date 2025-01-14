
import TomSelect from './tom-select';

/**
 * Converts a scalar to its best string representation
 * for hash keys and HTML attribute values.
 *
 * Transformations:
 *   'str'     -> 'str'
 *   null      -> ''
 *   undefined -> ''
 *   true      -> '1'
 *   false     -> '0'
 *   0         -> '0'
 *   1         -> '1'
 *
 */
export function hash_key(value:undefined|null|boolean|string):string|null {
	if (typeof value === 'undefined' || value === null) return null;
	return get_hash(value);
};

export function get_hash(value:boolean|string):string{
	if (typeof value === 'boolean') return value ? '1' : '0';
	return value + '';
};

/**
 * Escapes a string for use within HTML.
 *
 */
export function escape_html(str:string):string {
	return (str + '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};


/**
 * Debounce the user provided load function
 *
 */
export function loadDebounce(fn,delay:number){
	var timeout: null|ReturnType<typeof setTimeout>;
	return function(this:TomSelect, value:string,callback:() => void) {
		var self = this;

		if( timeout ){
			self.loading = Math.max(self.loading - 1, 0);
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = null;
			self.loadedSearches[value] = true;
			fn.call(self, value, callback);

		}, delay);
	};
}


/**
 * Debounce all fired events types listed in `types`
 * while executing the provided `fn`.
 *
 */
export function debounce_events( self:TomSelect, types:string[], fn:() => void ) {
	var type;
	var trigger = self.trigger;
	var event_args:{ [key: string]: any } = {};

	// override trigger method
	self.trigger = function(){
		var type = arguments[0];
		if (types.indexOf(type) !== -1) {
			event_args[type] = arguments;
		} else {
			return trigger.apply(self, arguments);
		}
	};

	// invoke provided function
	fn.apply(self, []);
	self.trigger = trigger;

	// trigger queued events
	for (type in event_args) {
		trigger.apply(self, event_args[type]);
	}
};


/**
 * Determines the current selection within a text input control.
 * Returns an object containing:
 *   - start
 *   - length
 *
 */
export function getSelection(input:HTMLInputElement):{ start: number; length: number } {
	return {
		start	: input.selectionStart || 0,
		length	: (input.selectionEnd||0) - (input.selectionStart||0),
	};
};


/**
 * Prevent default
 *
 */
export function preventDefault(evt?:Event, stop:boolean=false):void{
	if( evt ){
		evt.preventDefault();
		if( stop ){
			evt.stopPropagation();
		}
	}
}


/**
 * Prevent default
 *
 */
export function addEvent(target:EventTarget, type:string, callback, options?:object):void{
	target.addEventListener(type,callback,options);
}


/**
 * Return true if the requested key is down
 * Will return false if more than one control character is pressed ( when [ctrl+shift+a] != [ctrl+a] )
 * The current evt may not always set ( eg calling advanceSelection() )
 *
 */
export function isKeyDown( key_name:keyof (KeyboardEvent|MouseEvent), evt?:KeyboardEvent|MouseEvent ){

	if( !evt ){
		return false;
	}

	if( !evt[key_name] ){
		return false;
	}

	var count = (evt.altKey?1:0) + (evt.ctrlKey?1:0) + (evt.shiftKey?1:0) + (evt.metaKey?1:0);

	if( count === 1 ){
		return true;
	}

	return false;
}


/**
 * Get the id of an element
 * If the id attribute is not set, set the attribute with the given id
 *
 */
export function getId(el:Element,id:string){
	const existing_id = el.getAttribute('id');
	if( existing_id ){
		return existing_id;
	}

	el.setAttribute('id',id);
	return id;
}


/**
 * Returns a string with backslashes added before characters that need to be escaped.
 */
export function addSlashes(str:string):string{
	return str.replace(/[\\"']/g, '\\$&');
}
