import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }
  const followUnfollowHandler = async () => {
    try {
        const action = isFollowing ? 'unfollow' : 'follow';
        // Use POST instead of GET
        const res = await axios.post(`http://localhost:3000/api/v1/user/followorunfollow/${userProfile._id}`, { action }, { withCredentials: true });

        console.log(res.data);
        
        if (res.data.success) {
            // Update the following state
            setIsFollowing(!isFollowing); // Toggle the following state

            // Update followers count in userProfile directly in state
            const updatedUserProfile = {
                ...userProfile,
                followers: isFollowing 
                    ? userProfile.followers.filter(id => id !== user._id) 
                    : [...userProfile.followers, user._id]
            };

            // Update the userProfile in local state (if applicable)
            setUserProfile(updatedUserProfile); // Assuming you have a local state for userProfile

            toast.success(res.data.message); // Notify the user
        } else {
            // Handle the case when success is false
            toast.error(res.data.message || "An error occurred.");
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred while trying to follow/unfollow.");
    }
};


  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
    <>
        <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
        <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
        <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
    </>
) : (
    <>
        <Button 
            variant='secondary' 
            className={`h-8 ${isFollowing ? 'bg-red-500' : 'bg-[#0095F6] hover:bg-[#3192d2]'}`} 
            onClick={followUnfollowHandler}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
        {!isFollowing && <Button variant='secondary' className='h-8'>Message</Button>}
    </>
)}

              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile