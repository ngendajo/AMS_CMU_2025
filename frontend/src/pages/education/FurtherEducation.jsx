import React, { useState, useEffect } from 'react';
import EduCard from '../../components/education/edu-card';
import "./FurtherEducation.css";


import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import baseUrl from '../../api/baseUrl';

const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pdfUrl: "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pdfUrl: "https://www.pdfdrive.com/to-kill-a-mockingbird-pdf-33478553.html"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    pdfUrl: "https://www.pdfdrive.com/1984-pdf-33403723.html"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pdfUrl: "https://www.pdfdrive.com/pride-and-prejudice-pdf-33469123.html"
  },
  {
    id: 5,
    title: "Moby Dick",
    author: "Herman Melville",
    pdfUrl: "https://www.pdfdrive.com/moby-dick-pdf-33415644.html"
  }
];

const FurtherEducation = () => {
    const [activeTab, setActiveTab] = useState('Courses');
    const [education, setEducation] = useState([]);
    const [creatingNew, setCreatingNew] = useState(false);
    const [books, setBooks] = useState(sampleBooks);
    const [newBook, setNewBook] = useState({ title: '', author: '', pdfUrl: '' });
    const { auth } = useAuth();
    const handleAddBook = () => {
      setBooks([...books, { ...newBook, id: books.length + 1 }]);
      setNewBook({ title: '', author: '', pdfUrl: '' });
      setCreatingNew(false);
  };

  const handleRemoveBook = (bookId) => {
      setBooks(books.filter(book => book.id !== bookId));
  };
    const fetchEducation = async () => {
    try {
      const response = await axios.get(baseUrl+'/opportunity');
      console.log(response.data)
      const sortedOpportunities = response.data.sort((a, b) => a.approved - b.approved);
      setEducation(sortedOpportunities);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

    const eduData = education;
  
    const filteredEdu = eduData.filter(edu => edu.op_type === activeTab);

    const handleApprove = async (eduId, approved) => {
      try {
        await axios.patch(baseUrl + "/opportunity/" + eduId + "/approve",
        { approved: !approved },
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert(!approved ? "Posted successfully" : "Removed successfully");
          fetchEducation();
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    const handleSaveEdit = async (eduId, approved, opportunityData) => {
      try {
        await axios.put(baseUrl + "/opportunity/" + eduId + "/update/", opportunityData,
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert(approved ? "Posted successfully" : "Saved successfully");
          fetchEducation();
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    const handleCreateNew = async (opportunityData) => {
      if (opportunityData === null) {
        setCreatingNew(false);
        return;
      }
      try {
        await axios.post(baseUrl + "/opportunity/create/", opportunityData,
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert("Created successfully");
          fetchEducation();
          setCreatingNew(false);
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div className="edu-page">
        <div className="tabs">
          <button onClick={() => setActiveTab('Courses')} className={activeTab === 'Courses' ? 'active' : ''}>Courses</button>
          <button onClick={() => setActiveTab('Programs')} className={activeTab === 'Programs' ? 'active' : ''}>Programs</button>
          <button onClick={() => setActiveTab('Library')} className={activeTab === 'Library' ? 'active' : ''}>Library</button>
        </div>
        
        {(auth.user.is_crc || auth.user.is_superuser) && (
          <button onClick={() => setCreatingNew(true)} className="create-new-button">Create Draft</button>
        )}

{(auth.user.is_crc || auth.user.is_superuser) && activeTab === 'Library' && (
                <button onClick={() => setCreatingNew(true)} className="create-new-button">Add New Book</button>
            )}
            <div className="edu-cards-container">
                {activeTab === 'Library' && (
                    <>
                        {creatingNew && (
                            <div className="new-book-form">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Author"
                                    value={newBook.author}
                                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="PDF URL"
                                    value={newBook.pdfUrl}
                                    onChange={(e) => setNewBook({ ...newBook, pdfUrl: e.target.value })}
                                />
                                <button onClick={handleAddBook}>Add Book</button>
                            </div>
                        )}
                      {books.map(book => (
        <EduCard
          key={book.id}
          title={book.title}
          description={book.author}
          link={book.pdfUrl}
          approved={true}
          //onRemove={() => handleRemoveBook(book.id)}
          //canRemove={auth.user.is_crc || auth.user.is_superuser}

          alumni='true'
          type= "library"
          date= " "
        
        />
      ))}

                        
                    </>
                    
                )}
                 </div> {activeTab !== 'Library' && (

        <div className="edu-cards-container">
        {creatingNew && (
          <EduCard
            alumni='false'
            title=""
            type={activeTab}
            description=""
            date=""
            link=""
            approved={false}
            onApprove={() => handleApprove(null, false)}
            onSave={(x) => handleCreateNew(x)}
            isNew={true}
          />
        )}
        {auth.user.is_alumni && (
          filteredEdu.map(edu => (
            edu.approved ?
            <EduCard
              key={edu.id}
              alumni='true'
              title={edu.title}
              type={edu.op_type}
              description={edu.description}
              date={edu.diedline}
              link={edu.link}
              approved={edu.approved}
            />
            : null
          ))
        )}
        {(auth.user.is_crc || auth.user.is_superuser) && (
        filteredEdu.map(edu => (
          <EduCard
            key={edu.id}
            alumni='false'
            title={edu.title}
            type={edu.op_type}
            description={edu.description}
            date={edu.diedline}
            link={edu.link}
            approved={edu.approved}
            onApprove={() => handleApprove(edu.id, edu.approved)}
            onChange={(x) => handleSaveEdit(edu.id, edu.approved, x)}
          />
        ))
      )}
      </div>

    )}
    
      </div>

  );
};

export default FurtherEducation;