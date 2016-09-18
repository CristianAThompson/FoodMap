# Food Map
## Powered By KnockoutJS, Google Maps API, and FourSquare Venues API

### How to run this project!

*These steps outline how to run it locally, for a live version [click here](https://cristianathompson.github.io/FoodMap/)*

* First you will need to either download the zip from [here](https://github.com/CristianAThompson/FoodMap)
* Or if proficient with git you can run `git clone https://github.com/CristianAThompson/FoodMap.git`
* Once you have the files on the computer you need to navigate to the folder where they are located
* Inside that folder is a file named *index.html*, you can double click this to run the file locally

## How it runs behind the scenes!

This is a project built from the ground up to work with KnockoutJS so it makes
nifty use of some of the functionality built into KnockoutJS, like using an observable
to use on one side of an evaluation statement against objects in an observableArray.
Using the Knockout filter utility it in real time eliminates options based on input inside
of the search box. Using foreach data binds I extrapolate a list of names for locations
on the map who share the same array used to make the list to create marker objects
on a google maps api object. By using the markers array to create both the list
and the markers themselves I can use a trigger event inside of a function and apply it to
each item in the list using the same data-bind. The click even that happens on each marker
fires an ajax request for all items inside the array and pulls down the location and the
menu links from FourSquare so that they can then be used directly with setContent to display
the correct information pertaining to each marker.

Map Attribution: [Google Maps](https://developers.google.com/maps/)
Menu and Location information Attribution: [FourSquare](https://developer.foursquare.com/start)
Knockout Attribution: [KnockoutJS](http://knockoutjs.com/)
