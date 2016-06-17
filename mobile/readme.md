two-degrees app
===============

running
-------

	# make sure node is installed
	npm install
	npm install -g ionic cordova

	# run the development server
	ionic serve -a -p PORT --nolivereload

The app polls the smart meter for readings. Currently this points to an endpoint that
returns mock readings. To change the endpoint, edit [www/js/controllers.js](www/js/controllers.js)

    179     var ip = 'twodegree01.cloudapp.net:8081';

The readings are provided by scripts in [usage/](../usage)

