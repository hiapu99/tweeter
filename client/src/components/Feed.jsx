import React from 'react'
import CreatedPost from './CreatedPost'
import Tweet from './Tweet'

const Feed = () => {
    return (
        <div className='max-w-xl mx-auto border-l border-r border-gray-100/10 h-screen'>
            <CreatedPost />
            <Tweet/>
        </div>
    )
}

export default Feed
