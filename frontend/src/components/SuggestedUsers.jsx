import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    // Destructure suggestedUsers from the Redux store
    const { suggestedUsers = [] } = useSelector(store => store.auth); // Default to an empty array

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                // Check if suggestedUsers is not empty
                suggestedUsers.length > 0 ? (
                    suggestedUsers.map((user) => (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                                    </h1>
                                    <span className='text-gray-600 text-sm'>{user.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                        </div>
                    ))
                ) : (
                    <div className='text-gray-600'>No suggested users available.</div> // Fallback UI
                )
            }
        </div>
    );
}

export default SuggestedUsers;
