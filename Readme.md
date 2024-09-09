# Fanfare Object Detection Micro Service

## Table of Contents

- [Installation](#Installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Starting Corn Services](#starting-cron-services)
- [Running Tests](#running-tests)
- [Authors](#authors)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/FanFareBD/Object-detection-micro-service
   ```

2. **Go to the project directory**
   ```sh
   cd Object Detection Service
   ```
3. **Install dependencies**

   Make sure you have Node.js installed. Then run:

   ```sh
   npm install
   ```

## Configurations

1. **Environment Variables**

   Create a `.env` file in the root of the project and add necessary environment variables given below:

   ```sh
   PORT=
   MONGO_URI=
   OBJECT_DETECTION_API_URL=
   OBJECT_PUBLICATION_API_URL=
   QUEUE_ADJUSTMENT_API_URL=
   QUEUE_ADJUSTMENT_ACKNOWLEDGEMENT_API_URL=
   ```

## Running the Project

1. **Build the development Server**

   ```sh
   npm run build

   ```

2. **Start the development Server**

   ```sh
   npm run start

   ```

   ***

   **OR**

   ***

3. **Build and Start the Development Server Concurrently**

   ```sh
   npm run dev

   ```

   You can see in server log

   `Object Detection Micro Service has started on port http://localhost:YOUR_PORT`

## Starting Cron Jobs

#### Starting Gd Processor Job

```http
  GET /start-gd-processor
```

#### Stopping Gd Processor Job

```http
  GET /stop-gd-processor
```

#### Starting Gd Publisher Job

```http
  GET /start-gd-publisher
```

#### Stopping Gd Publisher Job

```http
  GET /stop-gd-publisher
```

#### Starting Gd Queue Adjustment Job

```http
  GET /start-queue-adjustment
```

#### Stopping Gd Queue Adjustment Job

```http
  GET /stop-queue-adjustment
```

## Authors

- [Md Taukir Alam](https://github.com/NullPointError07)
