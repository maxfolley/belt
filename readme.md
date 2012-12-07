Belt
====

A no-dependency tool belt.

Usage
-----

Belt exposes to variables to the global namespace - `belt` and `beltup`.

`belt` consists or utility functions, as well as objects containing related functionality. You can 'beltup' one of your own objects with the `beltup` function.

### Using `beltup`

    var selector = document.querySelector(".my-selector");
    selector = beltup(selector, [belt.cache, belt.events, belt.css]);
