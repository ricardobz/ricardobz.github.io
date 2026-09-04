// Types the contents of a text file into #console, terminal style, then
// hands the last prompt line over to a small interactive shell.
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
	var shell = document.getElementById("shell");
	var log = document.getElementById("log");
	var line = document.getElementById("line");
	var cmd = document.getElementById("cmd");
	var input = document.getElementById("input");

	var text = "";
	var index = 0;
	var cursorOn = true;
	var typeTimer = null;
	var blinkTimer = null;
	var typing = true;

	var PROFILES = [
		["LinkedIn", "https://br.linkedin.com/in/ricardo-beckert"],
		["GitHub", "https://github.com/ricardobz"],
		["Instagram", "https://www.instagram.com/ricardobeckert/"],
		["Dev.to", "https://dev.to/ricardobz"],
		["Spotify", "https://open.spotify.com/user/ricardobz"],
		["My Music", "https://open.spotify.com/artist/5h5cwkwfnOt7xXxyxyxWnV"]
	];

	var PROJECTS = [
		["Valentina, a Bonita", "https://valentina-a-bonita.netlify.app/",
			"a song for Valentina, my dog"],
		["Floripa, Sina Bonita", "https://floripa-sina-bonita.netlify.app/",
			"a song for Floripa, the city where I was born"],
		["Pleceboia", "https://pleceboia.netlify.app/",
			"my metal music, named after a character I invented playing D&D"],
		["Lasagna Ipsum", "https://lasagna-ipsum.netlify.app/",
			"lorem ipsum with an Italian accent, for a lasagna addict"]
	];

	var FILES = {
		"about.txt": "Hello! I am Ricardo Beckert.<br/><br/>" +
			"I have an associate degree in Computer Networks and a bachelor's degree in " +
			"Business Administration, and I've worked with programming for over 10 years.<br/><br/>" +
			"I'm a big fan of technology, especially programming... I love to code!!!<br/><br/>" +
			"Over that time I've learned two things with mastery: how to solve problems, " +
			"and how to add value to what I do.",
		"contact.txt": "Feel free to email me: " + mailto(),
		"links.txt": links(),
		"projects.txt": projects()
	};

	function esc(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	function mailto() {
		return '<a href="mailto:beckert.ricardo@gmail.com">beckert.ricardo@gmail.com</a>';
	}

	function links() {
		return PROFILES.map(function (profile) {
			return anchor(profile[0], profile[1]);
		}).join("<br/>");
	}

	function anchor(label, href) {
		return '<a href="' + href + '" target="_blank" rel="noopener">' + label + "</a>";
	}

	function projects() {
		return PROJECTS.map(function (project) {
			return anchor(project[0], project[1]) + " - " + project[2];
		}).join("<br/>");
	}

	function render() {
		var body = text.substring(0, index).replace(/\n/g, "<br/>");
		out.innerHTML = body + (cursorOn ? "|" : "");
	}

	function tick() {
		index += CHARS_PER_FRAME;
		render();
		window.scrollBy(0, 50);

		if (index > text.length) {
			finish();
		}
	}

	function blink() {
		cursorOn = !cursorOn;
		render();
	}

	function finish() {
		if (!typing) {
			return;
		}
		typing = false;
		clearInterval(typeTimer);
		clearInterval(blinkTimer);
		typeTimer = null;
		blinkTimer = null;
		index = text.length;
		cursorOn = false;
		render();
		shell.hidden = false;
		write('<span class="c">type \'help\' to see what I can do</span>');
		focusInput();
		scrollToBottom();
	}

	function scrollToBottom() {
		window.scrollTo(0, document.body.scrollHeight);
	}

	function focusInput() {
		if (!shell.hidden) {
			input.focus({ preventScroll: true });
		}
	}

	function write(html) {
		var block = document.createElement("div");
		block.className = "out";
		block.innerHTML = html;
		log.appendChild(block);
	}

	function echoPrompt(value) {
		write('<span class="a">guest@ricardobz</span>:<span class="b">~</span>' +
			'<span class="c">$</span> ' + esc(value));
	}

	var COMMANDS = {
		help: {
			about: "list the available commands",
			run: function () {
				var names = Object.keys(COMMANDS).sort();
				var rows = names.map(function (name) {
					return "  " + pad(name) + COMMANDS[name].about;
				});
				write("Available commands:<br/>" + rows.join("<br/>"));
			}
		},
		about: {
			about: "who I am",
			run: function () {
				write(FILES["about.txt"]);
			}
		},
		whoami: {
			about: "print the current user",
			run: function () {
				write("guest");
			}
		},
		ls: {
			about: "list files",
			run: function () {
				write(Object.keys(FILES).join("  "));
			}
		},
		cat: {
			about: "print a file, e.g. cat about.txt",
			run: function (args) {
				if (!args.length) {
					write("cat: missing operand");
					return;
				}
				args.forEach(function (name) {
					if (Object.prototype.hasOwnProperty.call(FILES, name)) {
						write(FILES[name]);
					} else {
						write("cat: " + esc(name) + ": No such file or directory");
					}
				});
			}
		},
		links: {
			about: "my profiles around the web",
			run: function () {
				write(links());
			}
		},
		projects: {
			about: "sites I built for fun",
			run: function () {
				write(projects());
			}
		},
		email: {
			about: "how to reach me",
			run: function () {
				write(mailto());
			}
		},
		date: {
			about: "print the current date",
			run: function () {
				write(new Date().toString());
			}
		},
		echo: {
			about: "print the given text",
			run: function (args) {
				write(esc(args.join(" ")));
			}
		},
		history: {
			about: "show the commands typed so far",
			run: function () {
				write(past.map(function (entry, i) {
					return "  " + (i + 1) + "  " + esc(entry);
				}).join("<br/>") || "");
			}
		},
		clear: {
			about: "clear the screen",
			run: function () {
				out.innerHTML = "";
				log.innerHTML = "";
			}
		},
		sudo: {
			about: "try your luck",
			run: function () {
				write("guest is not in the sudoers file. This incident has been reported.");
			}
		},
		exit: {
			about: "close the session",
			run: function () {
				write("logout");
				shell.hidden = true;
			}
		}
	};

	function pad(name) {
		var padding = "          ";
		return (name + padding).substring(0, padding.length);
	}

	var past = [];
	var cursorAt = 0;

	function run(value) {
		var parts = value.trim().split(/\s+/);
		var name = parts.shift();

		if (!name) {
			return;
		}

		if (Object.prototype.hasOwnProperty.call(COMMANDS, name)) {
			COMMANDS[name].run(parts);
		} else {
			write(esc(name) + ": command not found. Type 'help' to see what I know.");
		}
	}

	function submit() {
		var value = input.value;

		echoPrompt(value);
		if (value.trim()) {
			past.push(value.trim());
		}
		cursorAt = past.length;
		input.value = "";
		cmd.textContent = "";
		run(value);
		scrollToBottom();
	}

	function recall(step) {
		if (!past.length) {
			return;
		}
		cursorAt = Math.min(Math.max(cursorAt + step, 0), past.length);
		input.value = cursorAt === past.length ? "" : past[cursorAt];
		cmd.textContent = input.value;
	}

	function complete() {
		var value = input.value;
		var matches = Object.keys(COMMANDS).filter(function (name) {
			return name.indexOf(value) === 0;
		});

		if (matches.length === 1) {
			input.value = matches[0] + " ";
		} else if (matches.length > 1) {
			echoPrompt(value);
			write(matches.join("  "));
		}
		cmd.textContent = input.value;
	}

	input.addEventListener("input", function () {
		cmd.textContent = input.value;
	});

	input.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			submit();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			recall(-1);
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			recall(1);
		} else if (event.key === "Tab") {
			event.preventDefault();
			complete();
		} else if (event.key === "l" && event.ctrlKey) {
			event.preventDefault();
			COMMANDS.clear.run([]);
		} else if (event.key === "c" && event.ctrlKey) {
			event.preventDefault();
			echoPrompt(input.value + "^C");
			input.value = "";
			cmd.textContent = "";
		}
	});

	document.addEventListener("click", function (event) {
		if (typing) {
			finish();
			return;
		}
		if (window.getSelection().toString() || event.target.closest("a")) {
			return;
		}
		focusInput();
	});

	document.addEventListener("keydown", function (event) {
		if (typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
			finish();
		}
	});

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
