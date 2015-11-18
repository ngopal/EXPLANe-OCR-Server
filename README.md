How to deploy to Heroku
===================

Assuming you've already made an account, follow these instructions to get your own working OCR API:

0. Install Heroku toolbelt
1. git clone this repo
2. `heroku login` (and login with your credentials)
3. In the parent directory of the cloned repo, run `heroku create`. This will create a random url for your app and will add a heroku remote
4. run 'heroku buildpacks:set https://github.com/ddollar/heroku-buildpack-multi' to tell heroku which binaries you need on your dynamo. This particular command allows you to install multiple buildpacks. Buildpacks are defined in the '.buildpacks' file.
5. `git push heroku master`
6. `heroku open` to open up the app in the browser (this will take you to the live app, not a local copy)
7. `heroku logs` will allow you to view the log files. A number of error codes are documented here (https://devcenter.heroku.com/articles/error-codes).

How to use the API
====================
Send post requests to http://yourservice.com/api/photo. This url can be modified in Server.js. 

heroku git:remote -a lit-reef-9299 (replace with your app name)
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add https://github.com/matteotiziano/heroku-buildpack-tesseract
