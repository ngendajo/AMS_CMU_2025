import React, { useState, useEffect } from 'react';
import SearchBar from "../../components/dashboard/search-bar";
import './AlumniStoryPostForm.css';
import AlumniList from '../../components/directory/alumni-list';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';
import useAuth from '../../hooks/useAuth';
import ReactPaginate from 'react-paginate';

export default function AlumniBusiness() {
    const [selectedAlumni, setSelectedAlumni] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [alumniData, setAlumniData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { auth } = useAuth();

    const [formData, setFormData] = useState({
        alumn: [],
        title: '',
        description: '',
        image: '',
        video: '',
        displayed: false,
        createdat: new Date().toISOString(),
    });

    const [submittedPosts, setSubmittedPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('New Business');
    const [showImageInput, setShowImageInput] = useState(false); // Track image input visibility
    const [showVideoInput, setShowVideoInput] = useState(false); // Track video input visibility

    useEffect(() => {
        const getAlumniUsers = async () => {
            try {
                const response = await axios.get(baseUrl + '/alumnilist/', {
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                    },
                    withCredentials: true,
                });
                const alumniList = response.data.map((element) => ({
                    id: element.alumn_id,
                    profilePic: baseUrlforImg + "/media/" + element.image_url,
                    email: element.email,
                    firstName: element.first_name,
                    lastName: element.last_name,
                    gradeName: element.grade_name,
                    familyName: element.family_name,
                    combinationName: element.combination_name,
                }));
                setAlumniData(alumniList);
            } catch (err) {
                console.log(err);
            }
        };
        getAlumniUsers();
    }, [auth]);

    const fetchStories = async () => {
        try {
            const response = await axios.get(baseUrl + '/alumni-business/', {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                },
                withCredentials: true,
            });
            const stories = response.data;
            const displayed = stories.filter((story) => story.displayed);
            setSubmittedPosts(stories);
            setDisplayedPosts(displayed);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStories();
    }, [auth]);

    const filteredAlumni = alumniData
        .filter((alum) => `${alum.firstName} ${alum.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.lastName.localeCompare(b.lastName));

    const alumniPerPage = 4;
    const offset = currentPage * alumniPerPage;
    const currentAlumni = filteredAlumni.slice(offset, offset + alumniPerPage);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectAlumni = (alumni) => {
        setSelectedAlumni((prev) => {
            const isSelected = prev.find((alum) => alum.id === alumni.id);
            const updatedSelection = isSelected ? prev.filter((alum) => alum.id !== alumni.id) : [...prev, alumni];
            setFormData({
                ...formData,
                alumn: updatedSelection.map((alum) => alum.id),
            });
            return updatedSelection;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a timestamp in the format YYYYMMDDHHMMSS
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            
            // Generate a new filename with timestamp
            const newFileName = `${timestamp}_${file.name}`;
            
            // Create a new file with the modified name and the same file contents
            const renamedFile = new File([file], newFileName, {
                type: file.type,
                lastModified: file.lastModified,
            });

            // Determine the appropriate field based on file type
            const fieldName = file.type.startsWith("image") ? "image" : "video";

            // Update formData with the renamed file
            setFormData({
                ...formData,
                [fieldName]: renamedFile,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a new FormData object to prepare for file upload
            const formDataToSend = new FormData();
            
            // Append each field in formData to formDataToSend
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("displayed", formData.displayed);
            formDataToSend.append("createdat", formData.createdat);
    
            // Append selected alumni IDs as an array
            formData.alumn.forEach(alumId => formDataToSend.append("alumn", alumId));
            
            // Append image and video files only if they exist
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }
            if (formData.video) {
                formDataToSend.append("video", formData.video);
            }
    
            // Send the formDataToSend object in the request
            const response = await axios.post(baseUrl + '/alumni-business/', formDataToSend, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": "multipart/form-data", // Required for file upload
                },
                withCredentials: true,
            });
    
            const newStory = response.data;
    
            // Update posts based on the displayed status
            if (formData.displayed) {
                setDisplayedPosts([...displayedPosts, newStory]);
            } else {
                setSubmittedPosts([...submittedPosts, newStory]);
            }
    
            alert("Submitted successfully");
            setActiveTab('Submitted Business');
        } catch (err) {
            console.error(err);
        }
    };
    

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'New Business':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="story-form-group">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="story-form-group">
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Description" 
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="story-form-group media-option">
                        <div className="submit-container">
                            <button type="button" onClick={() => setShowImageInput(!showImageInput)}>
                                {showImageInput ? 'Hide Image Input' : 'Add Image'}
                            </button>
                        </div>
                            
                            {showImageInput && (
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            )}
                            <div className="submit-container">
                                <button type="button" onClick={() => setShowVideoInput(!showVideoInput)}>
                                    {showVideoInput ? 'Hide Video Input' : 'Add Video'}
                                </button>
                            </div>
                            
                            {showVideoInput && (
                                <input
                                    type="file"
                                    id="video"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                />
                            )}
                        </div>
                        <div className="submit-container">
                            <button type="submit">Submit</button>
                            <label>
                                <input
                                    type="checkbox"
                                    name="displayed"
                                    checked={formData.displayed}
                                    onChange={(e) => setFormData({ ...formData, displayed: e.target.checked })}
                                />
                                Make Displayed
                            </label>
                        </div>
                    </form>
                );
            case 'Submitted Business':
                return (
                    <div className="submitted-posts-list">
                        {submittedPosts.map((post) => (
                            <div key={post.id} className="post-item">
                                <p>{post.title}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'Displayed Business':
                return (
                    <div className="submitted-posts-list">
                        {displayedPosts.map((post) => (
                            <div key={post.id} className="post-item">
                                <p>{post.title}</p>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const removeAlumni = (id) => {
        setSelectedAlumni(selectedAlumni.filter(alum => alum.id !== id));
    };

    return (
        <div className="alumni-story-container">
            <div className="DirectoryList">
                <div className="alumni-list-container">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search alumni..." />
                    <div className='list' >
                        <AlumniList alumni={currentAlumni} onSelect={handleSelectAlumni} />
                    </div>
                    
                    <div className='alu-paginate'>
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(filteredAlumni.length / alumniPerPage)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={'alu-pagination'}
                            activeClassName={'active'}
                        />

                    </div>
                </div>
            </div>
            <div className="story-form-container">
                <div className="page-title">
                    {selectedAlumni.length > 0 ? (
                        <>
                            <span>Write Alumni Business for </span>
                            {selectedAlumni.map((alum, index) => (
                                <span key={alum.id}>
                                    {alum.firstName} {alum.lastName}
                                    <button onClick={() => removeAlumni(alum.id)} style={{ marginLeft: '5px' }}>X</button>
                                    {index < selectedAlumni.length - 1 && ', '}
                                </span>
                            ))}
                        </>
                    ) : (
                        <span>Select Alumni</span>
                    )}
                </div>
                <div className="story-tabs">
                    <button
                        className={activeTab === 'New Business' ? 'active' : ''}
                        onClick={() => setActiveTab('New Business')}
                    >
                        New Business
                    </button>
                    <button
                        className={activeTab === 'Submitted Business' ? 'active' : ''}
                        onClick={() => setActiveTab('Submitted Business')}
                    >
                        Submitted Business
                    </button>
                    <button
                        className={activeTab === 'Displayed Business' ? 'active' : ''}
                        onClick={() => setActiveTab('Displayed Business')}
                    >
                        Displayed Business
                    </button>
                </div>
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
