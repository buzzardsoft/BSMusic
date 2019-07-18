

# Overview

BSMusic is a system which allows you to store your own music files in a centralized location. The intent is ultimately to have web, iOS, Mac, and tvOS access to your music so you can play and download it from anywhere.

This is the server backend which provides a REST API that handles ingestion of song files and the expected operations for accessing a user's songs.

# Project Status

**Beginnings**. This side project is currently at a very early stage, where functionality is in various phases of being tied together while I'm also just starting to play with Docker a little.

Rough roadmap:

* Unit and integration test infrastructure - and actual tests!
* Extract album art for storage in S3
* Implement routes to access album art
* Implement querying/filtering/grouping
* Look at dropping Bluebird (or mostly dropping it except for collection operations)
* Deployment work
* Better handling of exceptions, i.e. failed extractions, etc.?
* Move song metadata extraction to its own service, outside of the main app?
* User accounts, "family sharing", and song ownership

# Deploying to ElasticBeanstalk

TBD

# Local Development

Local development can be done (mostly) with Docker compose.

    docker-compose up

Even with local development there is an external requirement of a S3 bucket that you are able to access.

To tear down your local environment, use:

    docker-compose down

You'll need your AWS environment variables set up via your .profile or .bashrc. You can hardwire them or do something like the following to pull the default profile settings.

    export AWS_REGION=$(aws configure get region --profile default)
    export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile default)
    export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile default)


