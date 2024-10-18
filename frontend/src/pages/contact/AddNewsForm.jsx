import React, { useState, useEffect, useCallback } from 'react';
import './AddNewsForm.css';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import baseUrl from '../../api/baseUrl';
import MyDropzone from './MyDropzone';
import { fetchPDFNews, createPDFNews, deletePDFNews } from './pdfNewsService';

const styles = {
    formContainer: {
        backgroundColor: '#f4f4f4',
        border: '2px solid #6d5736',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: 'auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #957967',
        borderRadius: '4px',
    },
    fileInput: {
        margin: '10px 0',
    },
    button: {
        backgroundColor: '#498160',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#6d5736',
    },
    heading: {
        textAlign: 'center',
        color: '#d8b040',
        marginBottom: '20px',
    },
};

const newsStyles = {
    listItem: {
        backgroundColor: '#f4f4f4',
        border: '2px solid #6d5736',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        position: 'relative',
    },
    link: {
        color: '#498160',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#f49c46',
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    buttonHover: {
        backgroundColor: '#957967',
    },
};


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
    const [pdfNews, setPDFNews] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newsTitle, setNewsTitle] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isButtonHovered, setIsButtonHovered] = React.useState(false);

    const handleItemClick = (pdf_file) => {
        // Navigate to the news PDF file when the list item is clicked
        window.open(pdf_file, '_blank', 'noopener noreferrer');
    };

    useEffect(() => {
        fetchPDFNews(auth).then(response => {
            setPDFNews(response.data);
        }).catch(() => {
            setMessage('Failed to load PDF news.');
            setMessageType('error');
        });
    }, [auth]);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const originalFile = event.target.files[0];
            const now = new Date();
            const dateStr = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 15); // YYYYMMDD_HHMMSS format
            const nanoseconds = performance.now().toString().split('.')[1];
            const newFileName = "pdf_" + dateStr + "_" + nanoseconds + "." + originalFile.name.split('.').pop();
    
            // Create a new File object with the modified name
            const modifiedFile = new File([originalFile], newFileName, { type: originalFile.type });
    
            // Set the new File object as the selected file
            setSelectedFile(modifiedFile);
        }
    };

    const handleTitleChange = (event) => {
        setNewsTitle(event.target.value);
    };

    const handleUpload = () => {
        if (!selectedFile || !newsTitle) {
            setMessage('Please provide a title and select a PDF file.');
            setMessageType('error');
            return;
        }

        const formData = new FormData();
        formData.append('title', newsTitle);
        formData.append('pdf_file', selectedFile);

        createPDFNews(formData, auth)
            .then(() => {
                setMessage('PDF news uploaded successfully.');
                setMessageType('success');
                setNewsTitle('');
                setSelectedFile(null);
                fetchPDFNews(auth).then(response => {
                    setPDFNews(response.data);
                });
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    setMessage(error.response.data.error);
                } else {
                    setMessage('Failed to upload PDF news.');
                }
                setMessageType('error');
            });
    };

    const newsHandleDelete = (id) => {
        deletePDFNews(id, auth)
            .then(() => {
                setMessage('PDF news deleted successfully.');
                setMessageType('success');
                setPDFNews(pdfNews.filter(news => news.id !== id));
            })
            .catch(() => {
                setMessage('Failed to delete PDF news.');
                setMessageType('error');
            });
    };

    const renderNotification = () => {
        if (!message) return null;
        const notificationStyle = {
            padding: '10px',
            margin: '10px 0',
            color: messageType === 'success' ? 'green' : 'red',
            border: `1px solid ${messageType === 'success' ? 'green' : 'red'}`,
            borderRadius: '5px',
        };
        return <div style={notificationStyle}>{message}</div>;
    };

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
          // Get the current datetime in the format YYYYMMDD_HHMMSS
        const now = new Date();
        const dateStr = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 15); // YYYYMMDD_HHMMSS format

        // Get nanoseconds precision using performance.now()
        const nanoseconds = performance.now().toString().split('.')[1];

        // Combine all elements to form the final image name
        var imgname = title + "_" + description + "_" + dateStr + "_" + nanoseconds + "." + selectedFiles[0].name.split('.').pop();

          //console.log(imgname + ": extension:" + selectedFiles[0].name.split('.').pop());
  
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
    //console.log("id inside formData", title);
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
            //console.log("Creating a new one");
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
                <button className={activeTab === 'pdfnews' ? 'active' : ''} onClick={() => setActiveTab('pdfnews')}>News Letters </button>
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
            <div className="submitted-news" style={{ display: activeTab === 'pdfnews' ? 'block' : 'none' }}>
                <div className='submitted-news-list'>
                <div>
                        <h2>News Letters List</h2>
                        {renderNotification()}
                        {(auth.user.is_crc || auth.user.is_superuser) && (
                            <div style={styles.formContainer}>
                                <h2 style={styles.heading}>Upload News</h2>
                                <input
                                    type="text"
                                    value={newsTitle}
                                    onChange={handleTitleChange}
                                    placeholder="News Title"
                                    style={styles.input}
                                />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ ...styles.input, ...styles.fileInput }}
                                />
                                <button
                                    style={{
                                        ...styles.button,
                                        ...(isButtonHovered ? styles.buttonHover : {}),
                                    }}
                                    onMouseEnter={() => setIsButtonHovered(true)}
                                    onMouseLeave={() => setIsButtonHovered(false)}
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                            </div>
                        )}
                        
                        <ul>
                            {pdfNews.length === 0 ? (
                                <p>No News Letters yet.</p>
                            ) : pdfNews.map((news) => (
                                <div
                                    style={newsStyles.listItem}
                                    key={news.id}
                                    onClick={() => handleItemClick(news.pdf_file)}
                                >
                                    <span style={newsStyles.link}>{news.title}</span>
                                    {(auth.user.is_crc || auth.user.is_superuser) && (
                                        <button
                                            style={{
                                                ...newsStyles.button,
                                                ...(isButtonHovered ? newsStyles.buttonHover : {}),
                                            }}
                                            onMouseEnter={() => setIsButtonHovered(true)}
                                            onMouseLeave={() => setIsButtonHovered(false)}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent the li click from triggering
                                                newsHandleDelete(news.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}    
                        </ul>
                    </div>
                </div>
            </div>

            
        </div>
    );
};


export default NewsForm;



