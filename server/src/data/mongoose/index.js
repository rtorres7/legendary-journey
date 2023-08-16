const mongoose = require('mongoose');

let initialConnectionRetries = 0;

function setupMongoose() {
  const mongoBaseUrl = process.env.MONGO_DATABASE_URL;

  if (mongoBaseUrl === 'SWAGGER') {
    return;
  }

  // TODO: We should change articles to mxms or something else as that is the database name not the collection. Docker componse has this: `mongodb://${mongoBaseUrl}/articles`
  mongoose.connect(mongoBaseUrl, { useNewUrlParser: true })
    .catch(error => {
      handleInitialError(error);
    });

  mongoose.connection.once('open', () => {
    console.log('Mongo connection successful');
  });
  mongoose.connection.on('error', error => handleMongooseErrors(error));
  mongoose.connection.on('disconnected', () => handleMongooseDisconnect());
}

function handleInitialError(error) {
  // TODO: We should bring in a logging library like winston to support more robust logging than console
  if (initialConnectionRetries < 10) {
    console.warn(`There was a problem initially connecting to Mongo. We will try again up to ${10 - initialConnectionRetries} more times`, error.message);
    setTimeout(setupMongoose, 500);
  } else {
    // TODO: If we can't connect to Mongo after the retries, should we exit the app so we don't think everything is working?
    console.error('Unable to make an initial connection to Mongo after 10 tries (5 seconds). The app will not be able to work correctly', error.message);
  }
}

function handleMongooseErrors(error) {
  console.warn('There was an error while accessing Mongo. Mongoose should retry automatically', error.message);
}

function handleMongooseDisconnect() {
  console.warn('The app has been disconnected from Mongo. Mongoose should reconnect automatically');
}

module.exports = setupMongoose;
