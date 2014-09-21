#AutoAlbers

####Concept

Create a new 'Homage to the Square' (originally a series by German/American Josef Albers) every 12 seconds (this is the average time people stand in front of a painting).

Color scheme JavaScript taken from [https://github.com/c0bra/color-scheme-js](https://github.com/c0bra/color-scheme-js)

![](https://raw.githubusercontent.com/y-a-v-a/autoalbers/master/albers.jpg)

#### For the curious
I use a canvas tag and JavaScript to create a new homage every 12 seconds. I added two polyfills, one for Date.now() and one for requestAnimationFrame, both of which I will remove when I think they're not needed anymore. I have put everything into one file since this makes loading faster, except for the color-sheme.js file since I want to keep external stuff external. I still have plans to make a responsive version but did not yet make time for that.
Some [http://www.huffingtonpost.com/james-elkins/how-long-does-it-take-to-_b_779946.html](sources) on the internet report about different lengths people stand in front of a painting in a museum. The Getty talks about a mean of 32.5, the Louvre about 15 seconds. I choose 12 seconds. Because in the end, it's on the internets dude!

#### Further reading

* [http://en.wikipedia.org/wiki/Josef_Albers](Josef Albers) was a German-born American artist and educator whose work, both in Europe and in the United States, formed the basis of some of the most influential and far-reaching art education programs of the twentieth century.
* [http://amzn.com/0300115954](Interaction of Color: Revised and Expanded Edition) a book, you know, a stack of paper glued together serving information.

#### TODO

* add favicon
* add robots.txt


(c) 2014 - Yet Another Visual Artist
License: MIT