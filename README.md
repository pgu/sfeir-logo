Play with the SFEIR logo!
=========================

Where to see the slides?
------------------------
[Right here] [1]

Want to add a slide?
--------------------

Here are the steps to follow:

1. Add your *article* to the file **index.html**
```
<article id="my-awesome-slide" onslideenter="on_slide_enter(this);" onslideleave="on_slide_leave();"></article>
```

2. At the **end** of the index.html, add your script and css files:
```
<link rel="stylesheet" type="text/css" href="/slides/my-awesome-slide/slide.css" />
<script src="/slides/my-awesome-slide/slide.js" ></script>
```

3. Create the folder **my-awesome-slide** under the folder **/web/slides/**, and create *slide.css* and *slide.js*

4. Bootstrap your js as the other slides with:
```
(function() {
    var your_dom = 'something...';   // Here is the dom that will be appended to your 'article'
    var article = $('#my-awesome-slide');
    article.html(your_dom);
    
    window.SLIDES['my-awesome-slide'] = {  // register your slide in order to get called when the user gets in and out
        id: 'my-awesome-slide'    
      , reset: function() {...}         // 'reset' is called when leaving the slide 
      , execute: function() {...}       // 'execute' is called when entering the slide
    }
})();
```


**That's it!**

Why these slides?
----------------
After viewing the awesome [presentation] [2] of Marting Gorner's team, it obviously makes you want to use all those new features.
And the [Sfeir] [3] logo, especially this form [≡], inspires some funny moves :-)

Server side
-----------
google-gson-2.2
junit-4.10
fest-assert-1.4
mockito-all-1.9.5
objectify-3.1

[1]: http://sfeir-logo.appspot.com/ "Slides with the Sfeir logo"
[2]: http://animateyourhtml5.appspot.com/ "Animate your html5"
[3]: http://www.sfeir.com/ "Sfeir"


