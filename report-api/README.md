### Notes for local development

#### Install dependencies

    $ npm install
    $ bash setup_exporter.sh

#### Run tests

Before running tests, `export OPENSSL_CONF=/dev/null` might be necessary.
See https://stackoverflow.com/questions/73004195/phantomjs-wont-install-autoconfiguration-error

    $ npm test
    $ npm test:e2e

#### Run the server

    $ npm start
