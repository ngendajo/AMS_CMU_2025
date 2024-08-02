import React, { useState, useEffect, useCallback } from 'react';
import './AddNewsForm.css';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import baseUrl from '../../api/baseUrl';
import MyDropzone from './MyDropzone';


const NewsForm = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const newsToEdit = location.state?.news;
    const [errMsg, setErrMsg] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [displayed, setDisplayed] = useState(false);
    const [activeTab, setActiveTab] = useState('new');
    const [newsList, setNewsList] = useState([]);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        date: "",
        pinned: true,
        user_id: ''
    });



    const fetchNewsList = async () => {
        try {
            const response = await axios.get(baseUrl + '/news');
            setNewsList(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchNewsList();
    }, []);


    useEffect(() => {
        if (newsToEdit) {
            setTitle(newsToEdit.title);
            setDescription(newsToEdit.description);
            setImage(newsToEdit.image);
            setDisplayed(newsToEdit.displayed);
            setActiveTab('new');
        }
    }, [newsToEdit]);

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            setFile(URL.createObjectURL(files[0]));
        }
      };


    const handleSubmit = async (event) => {
        event.preventDefault();

    if (selectedFiles && selectedFiles[0].name) {
        const objectURL = URL.createObjectURL(selectedFiles[0]); 

        if (objectURL) {
          var imgname = title + description + "." + selectedFiles[0].name.split('.').pop();
          console.log(imgname + ": extension:" + selectedFiles[0].name.split('.').pop());
  
        const file = new File(selectedFiles, imgname);
  
        setImage({
          image_url: file,
        });
      } else {
        setErrMsg("Select file");
        return;
      }
    } else {
      setErrMsg("Select file");
      return;
    }
  
    if (!image) {
      // Handle the case when `image` is undefined
      return;
    }

    const formData = new FormData();
    console.log("id inside formData", title);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', new Date().toISOString());
    formData.append('pinned', displayed);
    formData.append('user_id', auth.user.id);
    formData.append('id', id);
    formData.append("image_url", image.image_url)
    try {
        let response;
        console.log("form:", formData);
        if (id) {
            console.log("Editing");
            response = await axios.put(`${baseUrl}/news/${id}/update/`, {"title": title,
                "description": description,
                "date": new Date().toISOString(),
                "pinned": displayed,
                "user_id": auth.user.id,
                "image_url": image.image_url

            }, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
               
                withCredentials: true
            }
        );
       
        } else {
            console.log("Creating a new one");
            response = await axios.post(baseUrl + '/news/create/', formData, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials: true
            });
      
        }
        fetchNewsList();
        alert("News Added successfully");
        setActiveTab("submitted");
    } catch (err) {
        console.log(err);
    }
}; 

const handleReset = () => {
    setFormData({
      
        title: '',
        description: '',
        displayed: false,
        image_url: "",
        user_id: auth.user.id,
        date: new Date().toISOString(),
    });
 
};

    const handleDelete = async (id) => {
        console.log("newsList", newsList);
        console.log("id", id);
        try {
            await axios.delete(baseUrl + '/news/' + id + '/delete', {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'application/json'
                }
            });
            fetchNewsList();
            alert("Deleted successfully");
        } catch (err) {
            console.log(err.response);
        }
    };


    const handleEditNews = (news) => {
        console.log("inside News:", news);
        setTitle(news.title);
        setDescription(news.description);
        setImage(news.image);
        setDisplayed(news.displayed);
        setActiveTab('new');
        setId(news.id)
        
    };


    return (
        <div className="NewsContainer">
            <div className="news-tabs">
                <button className={activeTab === 'new' ? 'active' : ''} onClick={() => setActiveTab('new')}>New</button>
                <button className={activeTab === 'submitted' ? 'active' : ''} onClick={() => setActiveTab('submitted')}>Submitted </button>
                <button className={activeTab === 'displayed' ? 'active' : ''} onClick={() => setActiveTab('displayed')}>Displayed </button>
            </div>
            <button onClick={() => navigate(-1)} className="news-back-button">Back &gt;</button>
            <div className="news-request-form" style={{ display: activeTab === 'new' ? 'block' : 'none' }}>
            <form onSubmit={handleSubmit}>
          <div className="news-request-form-grid">
            <input type="text" placeholder="News Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <MyDropzone onDrop={onDrop} />
          </div>
          <textarea placeholder="News Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          <label>
            Displayed:
            <input type="checkbox" checked={displayed} onChange={(e) => setDisplayed(e.target.checked)} />
          </label>
          <button type="submit">Submit</button>
        </form>
            </div>


            <div className="submitted-news" style={{ display: activeTab === 'submitted' ? 'block' : 'none' }}>
                <div className='submitted-news-list'>
                    {newsList.length === 0 ? (
                        <p>No news submitted yet.</p>
                    ) : (
                        newsList.map((post) => (
                            <div
                                key={post.id}
                                className="news-item"
                                onClick={() => handleEditNews(post)}
                                style={{ cursor: 'pointer' }}
                            >
                                <p>{post.title}</p>
                                {(auth.user.is_crc || auth.user.is_superuser) && (
                                    <button onClick={() => handleDelete(post.id)} className="news-delete-button">
                         Delete
                        </button>
                                    )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="submitted-news" style={{ display: activeTab === 'displayed' ? 'block' : 'none' }}>
                <div className='submitted-news-list'>
                    {newsList.length === 0 ? (
                        <p>No news submitted yet.</p>
                    ) : (
                        newsList.filter(post => post.pinned).map((post) => (
                            <div
                                key={post.id}
                                className="news-item"
                                onClick={() => handleEditNews(post)}
                                style={{ cursor: 'pointer' }}
                            >
                                <p>{post.title}</p>
                                {(auth.user.is_crc || auth.user.is_superuser) && (
                                    <button onClick={() => handleDelete(post.id)} className="news-delete-button">
                        Delete
                        </button>
                                    )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            
        </div>
    );
};


export default NewsForm;



