'use strict';
// https://www.youtube.com/watch?v=Pa99PT16tmw
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const uuid = require('uuid/v4');

const postsTable = process.env.POSTS_TABLE;

// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode, 
    body: JSON.stringify(message)
  };
}
function sortByDate(a,b){
  if(a.createdAt > b.createdAt){
    return -1;
  } else return 1;
}

// event = headers / meta data
// context = request / response
// callback = error / response

module.export.createPost = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body
  };

return dynamodb.put({
    TableName: postsTable,
    Item: post
  }).promise().then(() => {
    callback(null, response(201, post))
  })
  .catch(err => response(null, response(err.statusCode, err)));
}
