import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import jwtDecode from 'jwt-decode';
import ReactPaginate from 'react-paginate';
import '../../components/DashboardComponents/Newspart/News.css';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';

// Dropzone for file upload --------------------------------
const MyDropzone = ({ onDrop }) => {
  const [previewSrc, setPreviewSrc] = useState(null); // State for storing the preview URL of the uploaded file.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles);
      // Create a preview URL from the first accepted file
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl); // Store the preview URL in the state
    },
  });

  return (
    // The getRootProps() function provides properties required for the dropzone
    // The getInputProps() function provides properties required for the input field
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {previewSrc ? (
        // If there is a preview URL, display the image preview
        <img src={previewSrc} alt="preview" />
      ) : (
        // Otherwise, display the instruction for file upload.
        <p>Click to select image file or drag image here</p>
      )}
    </div>
  );
};


// Form for creating news --------------------------------
const CreateNewsForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate() // navigate pages

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]); // only choose the 1st file
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(); // Create a FormData object for the POST request body
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image_url', file);

    axios.post(`${baseUrl}/news/create/`, formData)
      .then((response) => {
        console.log('News created:', response.data);
        navigate('/') // navigate to dashboard
      })
      .catch((error) => {
        console.error('Error creating news:', error);
      });
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <label>
        Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description (maximum character: 200)
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <MyDropzone onDrop={onDrop} />
      <button type="submit">Create</button>
    </form>
  );
};


// Edit and delete news -------------------------------------
const EditNewsForm = ({ news, onEdit, onDelete, setNewsData, setIsEditing }) => {
  const [title, setTitle] = useState(news.title);
  const [description, setDescription] = useState(news.description);
  const [pinned, setPinned] = useState(news.pinned);
  // const [imageUrl, setImageUrl] = useState(news.image_url);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.put(`${baseUrl}/news/${news.id}/update/`, {
      title,
      description,
      pinned
      //image_url: imageUrl,
    })
    .then((response) => {
      // After the news has been successfully updated, fetch the news data again from the server
      axios.get(baseUrl+'/news/')
        .then(response => {
          setNewsData(response.data);
          setIsEditing(false);
        })
        .catch(error => {
          console.error('Error fetching News data:', error);
        });
    })
    .catch((error) => {
        if (error.response && error.response.data.error) {
            alert(error.response.data.error); // alert to show pin more than 4 news
        } else {
            console.error('Error updating news:', error);
        }
    });
  };

  const handleDelete = () => {
    axios.delete(`${baseUrl}/news/${news.id}/delete/`)
      .then(() => {
        onDelete(news.id);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error deleting news:', error);
      });
  };

  return (
    <div className="edit-form-container">
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          Pin&nbsp;
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
        </label>
        <div className="edit-form-buttons">
          <input className="submit-button" type="submit" value="Submit" />
          <button className="delete-button" type="button" onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  );
};


// Format date ----------------------------------
const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const options = { timeZone: 'Africa/Nairobi' };
  return dateObject.toLocaleDateString('en-US', options);
};


// Define each news card ------------------------
const NewsCard = ({ news, onEdit, onDelete, setNewsData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { title, description, date } = news;


  if (isEditing) {
    return <EditNewsForm news={news} onEdit={onEdit} onDelete={onDelete} setNewsData={setNewsData} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="news-card">
      <img src={`${baseUrlforImg+news.image_url}`} alt={title} />
      <div className="news-content">
        <h2>{title}</h2>
        <p>{description.substring(0, 75) + '...'}</p>
        <span>{formatDate(date)}</span>
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </div>
    </div>
  );
};


// Final News ----------------------------
const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user = jwtDecode(auth.accessToken);

  // Set page size to paginate news
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 12;

  // This useEffect will run regardless of the user's permissions
  useEffect(() => {
    // Check the user's permissions inside the effect
    if (!auth || (!user.is_superuser && !user.is_crc)) {
      navigate('/');
      return;
    }

    axios.get(baseUrl+'/news/')
      .then(response => {
        Array.isArray(response.data)?
        setNewsData(response.data):null;
      })
      .catch(error => {
        console.error('Error fetching News data:', error);
      });
  }, [auth, navigate, user]);

  // Create News Part
  const handleCreate = (newNews) => {
    setNewsData([newNews, ...newsData]);
    setIsCreating(false);
  };

  if (isCreating) {
    return <CreateNewsForm onCreate={handleCreate} />;
  }

  // Edit News Part
  const handleEdit = (updatedNews) => {
    // Replace the old news with the updated news in the state.
    const newNewsData = newsData.map((news) =>
      news.id === updatedNews.id ? updatedNews : news
    );
    setNewsData(newNewsData);
  };

  // Delete News Part
  const handleDelete = (newsId) => {
    // Remove the deleted news from the state.
    const newNewsData = newsData.filter((news) => news.id !== newsId);
    setNewsData(newNewsData);
  };

  // Separate pinned news and the latest news
  const pinnedNews = newsData.filter((news) => news.pinned);
  const notPinnedNews = newsData.filter((news) => !news.pinned);
  notPinnedNews.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date in descending order

  // Combine pinned news and the latest news
  const allOrderedNews = [...pinnedNews, ...notPinnedNews];

  // Paginate news
  const handlePageClick = (data) => {
    let selected = data.selected;
    setCurrentPage(selected);
  };
  const offset = currentPage * PAGE_SIZE;
  const paginatedNews = allOrderedNews.slice(offset, offset + PAGE_SIZE);

  return (
    <div className="news-container">
      <button className="add-news-button" onClick={() => setIsCreating(true)}>&nbsp;ADD NEWS 👈🏿&nbsp;</button>

      {paginatedNews.map((news) => (
        <NewsCard
          key={news.id}
          news={news}
          onEdit={handleEdit}
          onDelete={handleDelete}
          setNewsData={setNewsData}
        />
      ))}
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(allOrderedNews.length / PAGE_SIZE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        pageClassName={'pageItem'}
        previousClassName={'pageItem'}
        nextClassName={'pageItem'}
        breakClassName={'pageItem'}
        activeClassName={'active'}
        activeLinkClassName={'activeLink'}
        previousLinkClassName={'pageLink'}
        nextLinkClassName={'pageLink'}
        pageLinkClassName={'pageLink'}
      />

    </div>
  );
};


export default News;
