// Types the contents of a text file into #console, terminal style.
// The source file contains HTML, so each frame re-renders the whole
// substring: that lets the parser discard tags the cut lands inside
// until enough characters have arrived to complete them.
(function () {
	"use strict";

	var SOURCE = "ricardobz.txt";
	var CHARS_PER_FRAME = 3;
	var FRAME_MS = 30;
	var BLINK_MS = 500;

	var out = document.getElementById("console");
	var text = "";
	var index = 0;
	var cursorOn = true;
	var typeTimer = null;
	var blinkTimer = null;

	function render() {
		var body = text.substring(0, index).replace(/\n/g, "<br/>");
		out.innerHTML = body + (cursorOn ? "|" : "");
	}

	function tick() {
		index += CHARS_PER_FRAME;
		render();
		window.scrollBy(0, 50);

		if (index > text.length) {
			clearInterval(typeTimer);
			typeTimer = null;
		}
	}

	function blink() {
		cursorOn = !cursorOn;
		render();
	}

	fetch(SOURCE)
		.then(function (response) {
			if (!response.ok) {
				throw new Error("Failed to load " + SOURCE + ": " + response.status);
			}
			return response.text();
		})
		.then(function (data) {
			text = data.replace(/\n$/, "");
			typeTimer = setInterval(tick, FRAME_MS);
			blinkTimer = setInterval(blink, BLINK_MS);
			render();
		})
		.catch(function (error) {
			console.error(error);
		});
}());
