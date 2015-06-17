INTRODUCTION
------------
The language service is $7.99 per month, with the first month free. The over-the-top service promises access to thousands of hours of movies, TV shows and sports. 

PREREQUISITES
-------------
	1. Zend Framework 2
	2. PHP 5.5.9
	3. AngularJS v1.2.15
	4. jQuery v1.11.1
	5. Underscore.js 1.6.0

ENVIRONMENTS
------------ 
    1. Development
		This is our working copy. This version of the code contains the latest version and all the experimental features. Developers directly interact with this copy and continuously change, modify and test the latest integration and features.

	2. Staging
		The staging environment is usually one version ahead of the Next-Staging version. This environment is very similar to development. Usually used for QA testing.

	3. Next-Staging
		The staging environment contains the next release candidate and is usually one version ahead of the production version. In this version final tests are performed and almost no new features are introduced. If you are working with a team, this environment is where your code and your project team code are combined and validated for production.

	4. Production
		This is the stable released version of the software available to the end-users. This version does not change until the next iteration of the software is proven to be stable in the staging environment and ready to be released. Production environment is the actual environment in which your system will run after deployment.


GETTING STARTED WITH PROJECT SETUP
----------------------------------

    Installation
    ------------

	    1. Configuration

	    	a. Learn a little about Bitbucket, SourceTree, and Git
	    		These instructions require Atlassian SourceTree.  If you don't have SourceTree installed, [download it now before continuing](http://sourcetreeapp.com/?utm_source=bitbucket&utm_medium=tutorial_repo_link&utm_campaign=sourcetree-text)

	    	b. Install Ruby

	    2. Running the app locally

	    	a. Using Composer (recommended)
		    	Clone the repository and use composer to install dependencies using the create-project command:
					1. cd my/project/dir
					2. git clone git@bitbucket.org:accedo/directvy-web.git
					3. cd directvy-web
					4. php composer.phar self-update
					5. php composer.phar install

				Or
					git clone git://github.com/zendframework/ZendSkeletonApplication.git --recursive

			b. Grunt Setup
		        1. npm install
		        2. npm install -g bower
		        3. bower install
		        4. npm install -g grunt-cli

	        c. Adding a Virtual Host: 
	        	To setup apache, setup a virtual host to point to the public/ directory of the project and you should be ready to go! It should look something like below:

				<VirtualHost *:80>
				    ServerName local.hottdirectv.com
				    DocumentRoot "C:\xampp\htdocs\directvy-web\public"
				    SetEnv APPLICATION_ENV "development"
				    <Directory C:\xampp\htdocs\directvy-web\public>
				        DirectoryIndex index.php
				        AllowOverride All
				        Order allow,deny
				        Allow from all
				    </Directory>
				</VirtualHost>

				To make our application aware of which development environment it is in we use `SetEnv` variable in our VirtualHost deceleration. This is helpful to us as the database connections and other environment variables may be different across our different application environments.

	        d. Set Servername in Host file
	            Example as below,
	            127.0.0.1       local.hottdirectv.com 

	        e. Run application locally by running below command
	            grunt local

	        f. grunt serve #This should open up the app on 127.0.0.1:9000. Note that your middleware is now running on a different server


	DEPLOYMENT STEPS
	----------------
	    1. For DEVELOPMENT|STAGING ENVIRONMENTS, 

		    a. Enviornment Json Configuration (hott-web\config\environments\[development.json|staging.json]) 
		        "server_url"             --> base URL to be served on server-side
		        "client_url"             --> base URL to be served on client-side
		        "appgrid_key"            --> appgrid profile key
		        "app_build_number"       --> build version
		        "gigya_api_key"          --> gigya api key
		        "gigya_secret_key"       --> gigya secret key                     
		        "omniture_rsid"          --> omniture rsid
		        "fw_site_section_id"     --> freewheel ad section id
		        "fw_site_section_id_mob" --> freewheel mobile ad section id
		        "fw_mrm_network_id"      --> freewheel network id
		        "fw_player_profile"      --> player profile id
		        "html5_player_profile"   --> Html5 player profile id
		        "adManager"              --> Use this ads parameter to pass FreeWheel ad server or network tags to the Ooyala player.
		        "fw_ad_module_js"        --> freewheel ad module
		        "smtp_host"              --> smtp hostname
		        "smtp_username"          --> smtp username  
		        "smtp_password"          --> smtp password
		        "smtp_port"              --> smtp port

		    b. Require mcrypt_encrypt for two way password encryption.

		    c. /var/www/htpasswd
				The .htpasswd file is simple text file needed for local development. Instead of directives, the .htpasswd file contains username/password pairs. The password will be stored in encrypted form and the username will be in plaintext.

		    d. Run command as below,
	        	grunt development

		2. For NEXT-STAGING|PRODUCTION ENVIRONMENT

	        a. Enviornment Json Configuration (hott-web\config\environments\[next-staging.json|production.json]) 

	        b. Update cdn URL from 'http://cdn.hottdirectv.com/' to  '//s.y.com' in Gruntfile.js before doing grunt production.
	        
	        c. Update .htacess files with the one containing vanity URL

	        d. Run command as below,
				grunt production

		3. Updates on Production environment after deployment

			a. Rightnow fix
				Versioning of the referenced CSS files are done by adding timestamp to the query string using the grunt plugin "grunt-cache-breaker"


Now you are ready to go!