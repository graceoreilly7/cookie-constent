// Include the js-cookie library as a simple way to ensure consistent cross-browser behaviour.

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
  
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

// Do the FOE stuff

(function() {

  var cookieName = 'foe_cookies_accepted';
  var cookieBaseDomain = '.superlitio.com';
  var expiryDays = 183; // ~ Six months
  var debug = true;
  
  if (!Cookies.get(cookieName) || debug) {
    // (This tag should only ever be loaded if the cookie hasn't been set, but belt and braces...)

    // Create the cookie-consent HTML and CSS as strings for readability/ease of editing
    var htmlString = '' +
        '<div id="foe_cookienotice_content">' +
          '<p id="foe_cookienotice_content__message">' +
            'Our website uses cookies to understand how people interact with our content, which helps us ' +
            'offer the best experience for our visitors. By continuing to browse the site you are ' +
            'agreeing to our use of cookies as described in our ' +
            '<a target="_blank" id="foe_cookienotice_content__link" href="privacy-policy.html">' +
              'cookie policy' +
            '</a>.' +
          '</p>' +
          '<span id="foe_cookienotice_content__accept_button">Accept&nbsp;cookies</span>' +
        '</div>';
        
    var cssString = '' +
        '#foe_cookienotice_wrapper {' + 
        '  font-size: .8em;' + 
        '  box-sizing: border-box;' +
        '  position: fixed;' + 
        '  overflow: hidden;' + 
        '  z-index: 100000;' + 
        '  bottom: 0;' + 
        '  right: 0;' + 
        '  left: 0;' + 
        '  background-color: rgba(216, 234, 227, 0.9);' + 
        '  padding: .5em 1em;' + 
        '  margin: 0 auto;' +
        '  width: calc(100% - 1em);' +
        '  max-width: 80em;' + 
        '  box-shadow: 0.25em 0.25em 2.5em rgba(0, 0, 0, 0.75);' + 
        '  animation: foe_cookienotice_show 1s 1s 1 ease-in-out;' +
        '  animation-fill-mode: both;' +
        '}' +
        '#foe_cookienotice_content {' + 
        '  display: -webkit-flex;' + 
        '  -webkit-flex-wrap: wrap-reverse;' + 
        '  display: flex;' +
        '  flex-wrap: wrap-reverse;' +  
        '  align-items: center;' +
        '  justify-content: center;' +
        '}' +
        '#foe_cookienotice_content__accept_button {' + 
        '  color: #f3f3f7;' + 
        '  background-color: #56a085;' + 
        '  padding: 1em;' + 
        '  margin: 1em 2em;' + 
        '  border-radius: 2px;' + 
        '  font-weight: 700;' + 
        '  line-height: 1em;' + 
        '  cursor: pointer;' + 
        '  transition: background-color 0.3s ease-in-out;' + 
        '  text-align: center;' + 
        '  text-transform: uppercase;' +
        '}' + 
        '#foe_cookienotice_content__accept_button:hover {' + 
        '  color: #f3f3f7;' + 
        '  background-color: #96c6b5;' + 
        '}' + 
        '#foe_cookienotice_content__message {' + 
        '  color: #333333;' + 
        '  display: block;' +
        '  font-size: 1em;' + 
        '  line-height: 1.3em;' + 
        '  margin: 0;' + 
        '  flex-basis: 20em;' +
        '  flex-grow: 1;' + 
        '  text-shadow: 0 0 .5em rgba(255,255,255,1);' + 
        '}' + 
        '#foe_cookienotice_content__link {' + 
        '  color: #56a085;' + 
        '  text-decoration: none;' + 
        '  font-weight: 700;' + 
        '}' +
        '@keyframes foe_cookienotice_show {' +
        '  from { opacity: 0; transform: translateY(100%); }' +
        '  to   { opacity: 1;  transform: translateY(0);     }' +
        '}'
        ;
    
    
    // Inject the CSS
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {
        // IE
        s.styleSheet.cssText = cssString;
    } else {
        // the world
        s.appendChild(document.createTextNode(cssString));
    }
    document.getElementsByTagName('head')[0].appendChild(s);
                
    // Create and add the element to the DOM
    var consentDiv = document.createElement('div');
    consentDiv.id = 'foe_cookienotice_wrapper';
    consentDiv.innerHTML = htmlString;

    document.body.appendChild(consentDiv);

    // Add the "accept" event handler
    var consentButton = document.getElementById('foe_cookienotice_content__accept_button');
    consentButton.addEventListener('click', function() {

      // Set cookies, including for subdomains, and traverse higher up the domain chain if possible
      var domainParts = document.domain.split('.');
      
      while (domainParts.length > 1) {
          Cookies.set(cookieName, '1', {
              domain: '.' + domainParts.join('.'),
              path: '/',
              expires: expiryDays
          });
          domainParts.shift();
      }

      // Remove the pop-up
      var consentDiv = document.getElementById('foe_cookienotice_wrapper');
      consentDiv.parentNode.removeChild(consentDiv);

    });

  }

})();
