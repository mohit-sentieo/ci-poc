var express = require('express');
var app = express();
var LaunchDarkly = require('ldclient-node');

var user = {
    firstName: 'Bob',
    lastName: 'Loblaw',
    key: 'bob@example.com',
    custom: {
      groups: 'beta_testers'
    }
  };
  
  client.once('ready', function() {
    client.variation('a', user, false, function(err, showFeature) {
      if (showFeature) {
        // application code to show the feature
        console.log('Showing your feature to ' + user.key );
      } else {
        // the code to run if the feature is off
        console.log('Not showing your feature to ' + user.key);
      }
  
      client.flush(function() {
        client.close();
      });
    });
  });
  
