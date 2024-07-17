const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid').v4;

// Include the AWS SDK module
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const app = express();
app.use(bodyParser.json());

const tableName = 'EventsTable'; // Replace with your DynamoDB table name

// Fetch events
app.get('/api/events', (req, res) => {
  const params = {
    TableName: tableName
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).send(err);
    } else {
      res.send(data.Items);
    }
  });
});

// Add an event
app.post('/api/events', (req, res) => {
  const event = req.body;
  event.id = uuidv4(); // Assign a unique ID to the event

  const params = {
    TableName: tableName,
    Item: event
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).send(err);
    } else {
      res.send(event);
    }
  });
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
  const eventId = req.params.id;

  const params = {
    TableName: tableName,
    Key: {
      id: eventId
    }
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).send(err);
    } else {
      res.send({ id: eventId });
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Exports for testing or other purposes
exports.events = app.get('/api/events');
exports.event = app.post('/api/events');
exports.deleteEvent = app.delete('/api/events/:id');