# s3browser
adapted from http://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php

this project is a aws s3 file browser node app. 
uses npm 'aws-sdk'

The tutorialzine project is great starting point as a file browser. I have modified the php to node, somewhat modified the jquery and html, and changed the css color and display style to use flex, which I prefer. My main addition is the s3 bit, as well as integrating the hieararchy into a column view.

current features:

enter name of public bucket, press enter to view

you now view the items(files) and buckets(folders) within that bucket.

Express is used in the server because it will eventually need to build an html response.


#to-do-list


3) scroll horizontally 

6) search feature

7) create new button

8) delete button

9) reupload button

10) add animation
 







