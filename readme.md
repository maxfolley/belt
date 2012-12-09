Belt
====

A JavaScript Object package manager and toolbelt. Belt is influenced by and borrowed from [Underscore](http://underscorejs.org/) and [Backbone](http://backbonejs.org/).

Usage
-----

Belt exposes two variables to the global namespace - `belt` and `beltup`.

`belt` consists of utility functions, as well as objects containing related functionality - or 'packages'. You can 'beltup' one of your own objects with a package by using the `beltup` function.

### Using `beltup`

    var selector = document.querySelector(".my-selector");
    selector = beltup(selector, [belt.cache, belt.events, belt.css]);

TODO
----

- belt.events, use native addEventListener on DOM elements
- belt.dom
  - addClass
  - removeClass
