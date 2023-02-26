### Notes for local development

#### Install dependencies

    $ npm install
    $ bash setup_exporter.sh

Also, Redis must be running, it can be started from the docker-compose file in the root of the project.
    
    $ docker-compose up -d redis

#### Run tests

Before running tests, `export OPENSSL_CONF=/dev/null` might be necessary.
See https://stackoverflow.com/questions/73004195/phantomjs-wont-install-autoconfiguration-error

    $ npm run test
    $ npm run test:e2e

#### Run the server

    $ npm start
