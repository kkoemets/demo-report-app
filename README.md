# demo-report-app

---

This is a demo application for creating cryptocurrency candlestick chart reports in PDF format (note that to get accurate data a suitable API
needs to be implemented in [report.service.ts](report-api%2Fsrc%2Freport%2Freport.service.ts), currently static data is
being used). The application is built using React, NestJS, Redis and Docker.

## Usage

Easiest way to start the applications is to use docker-compose. This will start the application and all the required
services.

    $ docker-compose up

or detached mode

    $ docker-compose up -d

UI is available at http://localhost:8080

API is available at http://localhost:3000

Redis runs on port `6379`

Happy reporting!

---
License MIT © 2023 Kristjan Koemets.

