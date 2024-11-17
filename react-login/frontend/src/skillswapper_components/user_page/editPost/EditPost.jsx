import React, { useState } from "react";
import styles from './EditPost.module.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import dropdownIcon from '../../../images/dropdownIcon.svg';
import userAvatar from '../../../images/userAvatar.svg';
import decorativeIcon from '../../../images/decorativeIcon.svg';
import ImageGallery from '../../../skillswapper_components/createPost/tagMenu/ImageGallery';

import { LoginContext } from "../../../context/Login.tsx";


// import Kantumruy pro font
<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');
</style>



function EditPost() {
    const string_data = sessionStorage.getItem('editPostData');
    const data = JSON.parse(string_data);
    let category_tags = [];
    const navigate = useNavigate();
    const [tagMenuVisible, setTagMenuVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const loginContext = React.useContext(LoginContext);
    // all variables for strings that can be written in
    const [serviceSeeked, setServiceSeeked] = useState(data.skillsAsked);
    const [serviceOffered, setServiceOffered] = useState(data.skillsOffered);
    const [description, setDescription] = useState(data.description);

    const [serviceSeekedError, setServiceSeekedError] = useState('');
    const [serviceOfferedError, setServiceOfferedError] = useState('');

    const username = loginContext.userLastName === '' ? loginContext.userFirstName : `${loginContext.userFirstName} ${loginContext.userLastName}`;
  const handleIconClick = () => {
    setTagMenuVisible(!tagMenuVisible);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        const result =  prevCategories.filter((cat) => cat !== category);
        category_tags = [];
        for (let i = 0; i < result.length; i += 1) {
            category_tags.push(result[i].alt);
        }
        return result;
      } else {
        const result = [...prevCategories, category];
        for (let i = 0; i < result.length; i += 1) {
            category_tags.push(result[i].alt);
        }
        return result;
      }
    });
  };

  const validateServiceSeeked = (service_seeked) => {
    if (service_seeked === '') {
        setServiceSeekedError('Service Seeked must not be empty');
    }
    else {
        setServiceSeekedError('');
    }
  }
  const validateServiceOffered = (service_offered) => {
    if (service_offered === '') {
        setServiceOfferedError('Service Offered must not be empty');
    }
    else {
        setServiceOfferedError('');
    }
  }

  const cancelEdit = async () => {
    navigate('/userpage');
  }
  const edit = async (e) => {
    e.preventDefault();
    setServiceOfferedError('');
    setServiceSeekedError('');

    let hasError= false;

    validateServiceOffered(serviceOffered);
    validateServiceSeeked(serviceSeeked);

    if (serviceSeekedError || serviceOfferedError) {
        hasError = true;
    }
    if (hasError) return;

    const dto = {
        skillsAsked: serviceSeeked,
        skillsOffered: serviceOffered,
        description: description,
        categories: selectedCategories.map(category => category.alt),
        id: data.id,
    };
    try {
        const response = await axios.post('http://localhost:3080/api/v0/editPost', 
            dto, 
        {header: {'Content-Type': 'application/json'}, withCredentials: true}).then((res) => {
            console.log(res);
            if (res.data) {
                // either we succeed or we dont
                navigate('/userpage');
            }
        });
        if (response.data) {
            console.log('update succeeded');
        }
        else {
            console.log('update failed');
        }
    }
    catch (error) {
        console.error(error);
    }
  };


  return (
    <main className={styles.editPost}>
      <div className={styles.postContainer}>
      <div className={styles.topIcons}>
        <Link to="/homepage">
        <img  
            loading="lazy" 
            src={decorativeIcon} 
            className={styles.decorativeIcon} 
            alt="Decorative icon"
          />
        </Link>
      </div>

        <div className={styles.whiteContainer}>
          <div className={styles.userInfo}>
            <img
              loading="lazy"
              src={userAvatar}
              className={styles.userAvatar}
              alt="User avatar"
            />
            <div className={styles.username}>{username}</div>


          </div>

          <form className={styles.formContainer}>
            <label htmlFor="seekingService" className={styles.formLabel}>
              What service you are <em>seeking</em>?
            </label>
            <input
              id="seekingService"
              className={styles.formInput}
              type="text"
              placeholder="I am seeking..."
              value={serviceSeeked}
              onChange={(ev) => {
                setServiceSeeked(ev.target.value);
                validateServiceSeeked(ev.target.value)
              }}
            />

            <label htmlFor="offeringService" className={styles.formLabel}>
              What service you can <em>offer</em>?
            </label>
            <input
              id="offeringService"
              className={styles.formInput}
              type="text"
              placeholder="I can offer..."
              value={serviceOffered}
              onChange={(ev) => {
                setServiceOffered(ev.target.value);
                validateServiceOffered(ev.target.value)
              }}
            />

            <label htmlFor="categories" className={styles.formLabel}>
              Specify categories for <em>offered</em> services
            </label>
            <div className={styles.categorySelector}>
              <div className={styles.selectedCategories}>
                {selectedCategories.length > 0
                  ? selectedCategories.map((category, index) => (
                      <img
                        key={index}
                        src={category.src}
                        alt={category.alt}
                        className={styles.selectedCategory}
                      />
                    ))
                  : 'Select categories...'}
              </div>
              <img
                loading="lazy"
                src={dropdownIcon}
                className={styles.dropdownIcon}
                alt="Dropdown icon"
                onClick={handleIconClick}
              />
            </div>

            {tagMenuVisible && (
              <div className={styles.tagMenu}>
                <ImageGallery onCategorySelect={handleCategorySelect}  selectedCategories={selectedCategories} /> {/* Render the ImageGallery component */}
              </div>
            )}

            <label htmlFor="additionalInfo" className={styles.formLabel}>
              Additional information
            </label>
            <input
              id="additionalInfo"
              className={styles.formInput}
              type="text"
              placeholder="Enter more info..."
              value={description}
              onChange={(ev) => {
                setDescription(ev.target.value);
              }}
            ></input>
            
          </form>
          <button type="submit" className={styles.postButton} onClick={edit}>
              Edit
            </button>
            <button className={styles.postButton} onClick={cancelEdit}>
                Cancel
            </button>
        </div>
        
      </div>
    </main>
  );
}

export default EditPost;