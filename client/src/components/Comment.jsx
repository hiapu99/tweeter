import React, { useEffect } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleRefresh } from '../redux/tweets';

const Comment = ({ comment, tweet }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch refresh action whenever the tweet changes
    dispatch(toggleRefresh());
  }, [tweet, dispatch]); // Added dispatch to the dependency array

  return (
    <div className="flex items-start space-x-3">
      <Link to={`profile/${tweet?.author?._id}`}>
        <Avatar
          src={comment?.author?.profileImg?.secure_url}
          name={comment?.author?.username || 'Anonymous'}
          size="40"
          round={true}
        />
      </Link>
      <div>
        <p className="font-thin">@{comment.author?.username || 'Anonymous'}</p>
        <p className="text-white-700">{comment?.comments || 'No content available.'}</p>
      </div>
    </div>
  );
};

export default Comment;
