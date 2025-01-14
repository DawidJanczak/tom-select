/**
 * Plugin: "change_listener" (Tom Select)
 * Copyright (c) contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */

import TomSelect from '../../tom-select.js';
import getSettings from '../../getSettings.js';
import { TomSettings } from '../../types/settings';
import { addEvent } from '../../utils';

TomSelect.define('change_listener',function(this:TomSelect){
	const self		= this;
	const joined	= (arr:string[]):string => arr.join(self.settings.delimiter);

	addEvent(self.input,'change',()=>{

		var settings	= getSettings( self.input, {delimiter:self.settings.delimiter} as TomSettings );

		// prevent infinite loops
		if( joined(self.items) == joined(settings.items) ){
			return;
		}

		self.setupOptions(settings.options,settings.optgroups);
		self.setValue(settings.items);
	});

});
