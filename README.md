MyMusic is a system which allows you to store your own music in a centralized location. The intent is ultimately to have web, iOS, Mac, and tvOS access to your music so you can play and download it from anywhere.

This is the server backend which provides a REST API that handles ingestion of song files and the expected operations for accessing a user's songs.

# Deploying to ElasticBeanstalk

* Compress dist, Dockerfile, package.json, and package-lock.json
* Create an ElasticBeanstalk environment and use that zip as the application archive
* More to come about provided scripts to help with this...


# Local Development

Local development can be done (mostly) with Docker compose.

    docker-compose up

Even with local development there is an external requirement of a S3 bucket that you are able to access.

To tear down your local environment, use:

    docker-compose down

