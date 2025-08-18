
	if ('WebSocket' in window) {
		(function () {
			// THIS IS AN OPTIMISTATION OF LIVE SERVER WHERE AN ENTIRE PAGE DOES NOT NEED TO BE RELOADED IF A CHANGE TO A .CSS FILE IS DONE
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					// remove the element
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						// Cache-busting is a technique used to force web browsers to reload a resource (like a CSS file) from the server instead of using a cached version.
						// The replace() method is used to remove the cache-busting query parameter
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			// use ws protocol if http, otherwise wss
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			// get your current location of your page and create a WebSocket URL with /ws at end
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			// create WebSocket
			var socket = new WebSocket(address);
			// when server sends you message, process the data 
			socket.onmessage = function (msg) {
				// whenever you edit your HTML page, a 'reload' message is sent and code will auto-refresh page
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			// this handles welcome message
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
