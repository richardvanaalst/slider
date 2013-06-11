slider
======

A simple JS slider using jQuery.

//////////////////////////////////////////////////////

ToDo:

- Loop
	- continuous: place first slide after last when at the end of slides and visa versa
	- revert: "bounce" effect: when at end go back -1, when at start, go +1

- Pages navigation
	- Click on page navigation link
	- Show active page
	- Change active state when (auto-)running slider

- Smooth-out animations when frequently clicking navigation (via clearQueue?)

- Update values on document.ready or on interaction?
	e.g. When dynamically addding/removing a slide, sizes won't correspond
	to the correct current sizes anymore.
