import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryTable from './GalleryTable';
import '../../components/DashboardComponents/Opportunitypart/opportunity.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import baseUrl from '../../api/baseUrl';
//import { Link } from "react-router-dom";


function Galleries() {
  const [galleries ,setGalleries] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  var displayStatus=useState();

  const handleDisplay = async (galleryId) => {
    const updatedGalleries = galleries.map((gallery) => {
      if (gallery.id === galleryId) {
        displayStatus=!gallery.displayed
        return { ...gallery, displayed: displayStatus};
      }
      return gallery;
    });

    setGalleries(updatedGalleries);

    try {
      await axios.post(baseUrl+"/updategallery/"+galleryId+"/",
        { displayed: displayStatus },
        {
              headers: {
                  "Authorization": 'Bearer ' + String(auth.accessToken),
                  "Content-Type": 'application/json'
              }
          }
        ).then(res =>{
          console.log(res)
          alert("Displayed Changed successfully")
      })
      } catch (error) {
        navigate('/error');
    }

  };
  const fetchGalleries = async () => {
    try {
      const response = await axios.get(baseUrl+'/gallery');
      setGalleries(response.data);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
  };

  const handleDelete = async (event) => {
    
    axios.delete(baseUrl+'/deletegallery/'+event,
    {
        headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'application/json'
        }
    }
    )
    navigate("/gallery")
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  return (
    <div className="gallery-table">
      <h1>Manage Gallery Photos</h1>
      
      <GalleryTable galleries={galleries} onDisplay={handleDisplay} onDelete={handleDelete} />
    </div>
  );
}

export default Galleries;
