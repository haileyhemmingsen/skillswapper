import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import styles from './posting.module.css';
import userAvatar from '../../images/user.svg';
import menuIcon from '../../images/3dots.svg';
import closeIcon from '../../images/bubble_arrow.svg';
import axios from 'axios';

// import Kantumruy pro font
<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');
</style>


const Posting = (props) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [postID, setPostID] = useState('');
    const [postUserName, setPostUserName] = useState('');
    const [postUserID, setPostUserID] = useState('');
    const [postDate, setPostDate] = useState('');
    const [postContent, setPostContent] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
              setIsMenuOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

    useEffect(() => {
        const post_string = sessionStorage.getItem('postInfo');
        console.log(post_string);
        if (post_string) {
            const parsedPost = JSON.parse(post_string);
            console.log(parsedPost);
            setPostID(parsedPost.post_id);
            setPostUserName(parsedPost.username);
            setPostDate(parsedPost.date);
            setPostContent(parsedPost.content);
            setPostUserID(parsedPost.user_id)
        }
    }, []);

    const postData = {
          username: postUserName,
          date: postDate,
          content: postContent
        };

    const handleTextAreaResize = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto'; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting comment:", comment);
        try {
          const dto = {
            postID: postID,
            comment: comment
          }
          axios.post('http://localhost:3080/api/v0/createComment', 
            dto, 
            {header: {'Content-Type': 'application/json'}, 
            withCredentials: true})
            .then((res) => {
              console.log(res);
              if(res.data) {
                // Success, update comments state with new comment
                const newComment = {
                  comment_id: res.data.comment_id, 
                  username: postData.username, 
                  date: new Date().toLocaleString(),
                  content: comment
                }
                setComments([...comments, newComment]); // Add new comment to existing comments
      
                setComment('');
                setIsInputFocused(false);
              }
            });
        } 
        catch (error) {
          console.error(error);
        }

    };

    const handlePostClick = () => {
        navigate('/homepage');
    };

    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get("http://localhost:3080/api/v0/getAllComments", {
                    params: {
                        post_id: postID
                    }
                });
                const comments = response.data;
                const parsedComments = comments.map(comment => {
                    return {
                        comment_id: comment.comment_id,
                        username: comment.poster_username,
                        date: comment.date,
                        content: comment.comment
                    };
                });
                setComments(parsedComments);

            }
            catch (error) {
                console.error(error);
            }
        };
        fetchComments();
    }, [postID]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMessageClick = () => {
    const chat_info = {
        chat_id: "NewChat",
        receiver_id: postUserID
    }
    const chat_info_string = JSON.stringify(chat_info)
    sessionStorage.setItem('chat_info', chat_info_string);
    navigate('/chat/NewChat');
    console.log("Message user clicked");
    setIsMenuOpen(false);
  };


  return (
    <div className={styles.container}>
        <div className={styles.topIcons}>
            <img src={closeIcon} alt="Close" className={styles.arrowIcon} onClick={handlePostClick} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className={styles.postContent}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img src={userAvatar} alt="User avatar" className={styles.avatar} />
                    <span className={styles.username}>{postData.username}</span>
                </div>
                <div className={styles.headerIcons} ref={menuRef}>
                    <img src={menuIcon} alt="Menu" className={styles.icon} onClick={handleMenuClick} />
                    {isMenuOpen && (
                        <div className={styles.menu}>
                            <button className={styles.menuOption} onClick={handleMessageClick}>
                                Message User
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.content}>
                {postData.content.split('\n').map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            </div>
        </div>

      <div style={{ position: 'relative' }}> {}
        <textarea
          type="text"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            handleTextAreaResize(e);  // dynamically resize as you type
          }}
          onFocus={() => setIsInputFocused(true)}
          
          onBlur={(e) => {
            // hide if button isnt clicked
            if (!e.relatedTarget) {
                if(e.relatedTarget === null) {
                    console.log('blur is triggered');
                    setIsInputFocused(false);
                }
                else if ((e.relatedTarget.className) && !e.relatedTarget.className.includes(styles.commentButton)) {
                    console.log('blur is triggered');
                    setIsInputFocused(false);
                }
                
            }
          }}
          placeholder="Add a comment"
          className={styles.commentInput}
        />
        <button
          onClick={handleCommentSubmit}
          className={`${styles.commentButton} ${isInputFocused ? styles.commentButtonVisible : ''}`}
        >
          Comment
        </button>
      </div>

      {}
      <div className={styles.commentsSection}>
        <h3 className={styles.commentHeader}>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.comment_id} className={styles.comment}>
            <div className={styles.userInfo}>
              <img src={userAvatar} alt={`${comment.username}'s avatar`} className={styles.avatar} />
              <span className={styles.username}>{comment.username}</span>
            </div>
            <p className={styles.commentContent}>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
);
};


export default Posting;
