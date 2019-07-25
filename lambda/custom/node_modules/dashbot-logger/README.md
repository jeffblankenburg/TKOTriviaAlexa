# dashbot-logger

dashbot-logger allows you to log to a specific log group in CloudWatch Logs apart from the default
log group that Lambda functions set up. The logger works around the 5 putLogEvent/s limit by 
batching up log events and using a pool of log streams to put log events to.

## Setup

***This package uses the aws-sdk, and will require an AWS account.*** 

```bash
npm install --save dashbot-logger
```

Pass in your AWS credentials and a region as follows, or configure using one of the options listed 
[here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html)

  - ***region*** - ```string``` aws region
  - ***accessKeyId*** - ```string``` access key
  - ***secretAccessKey*** - ```string``` secret key
  - ***logGroupName*** - (required) ```string``` user specified log group name
  
```javascript
const configuration = {
  region: <REGION>,
  accessKeyId: <ACCESS-KEY>,
  secretAccessKey: <SECRET-KEY>,
  logGroupName: <LOG-GROUP-NAME>,
}

const Logger = require('dashbot-logger')
const logger = new Logger(configuration)
``` 

You can also pass in additional configuration options to specify the behavior of the resource pool for 
log streams and naming of log streams.

## Configuration Options
Available options:

  - ***debug*** - (default: ```false```, ```boolean```) logs helpful debugging information 
  - ***logStreamPrefix*** - (default: ```dashbot```, ```string```) user specified log stream prefix 
  - ***maxStreams*** - (default: ```10```, ```number```) max number of log streams to use concurrently 
  - ***minStreams*** - (default: ```1```, ```number```) min number of log streams to use concurrently  
  
Optionally, you can use the following environment variables to set certain options:

  - for ***logGroupName*** set DASHBOT_LOG_GROUP_NAME
  - for ***logStreamPrefix*** set DASBOT_LOG_STREAM_PREFIX
  - for ***maxStreams*** set DASHBOT_LOG_MAX_STREAMS
  - for ***minStreams*** set DASHBOT_LOG_MIN_STREAMS

## Example

```javascript
const configuration = {
  'logGroupName': 'test-group',
  'logStreamPrefix': 'test-stream',
  'maxStreams': 5,
  'minStreams': 2,
  'debug': true,
  'printErrors': true,
}

const Logger = require('dashbot-logger')
const logger = new Logger(configuration)

logger.log('test') // logs to log-group 'test-group' with string test
```