import React from 'react';
import Tweeters from './Tweeters';
import { useSelector } from 'react-redux';

const Tweet = () => {
  const { tweet, isLoading } = useSelector(store => store.tweet);

  if (isLoading) {
    return <div>Loading tweets...</div>;
  }

  if (!tweet || tweet.length === 0) {
    return <div>No tweets available</div>;
  }

  return (
    <div>
      {tweet.map((tweet) => (
        <Tweeters key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default Tweet;
