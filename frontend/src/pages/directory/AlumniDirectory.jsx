import React, { useState, useEffect } from 'react';
import AlumniList from '../../components/directory/alumni-list';
import AlumniDetail from '../../components/directory/alumni-detail.jsx';
import SearchBar from '../../components/dashboard/search-bar';
import './AlumniDirectory.css';
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';
import useAuth from '../../hooks/useAuth';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AlumniDirectory = () => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alumniData, setAlumniData] = useState([]);

  const [gradeFilter, setGradeFilter] = useState('');
  const [familyFilter, setFamilyFilter] = useState('');
  const [combinationFilter, setCombinationFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const [gradeOptions, setGradeOptions] = useState([]);
  const [familyOptions, setFamilyOptions] = useState([]);
  const [combinationOptions, setCombinationOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const alumniPerPage = 4;

  const handleClear = () => setSelectedAlumni(null);

  useEffect(() => {
    const getAlumni = async () => {
      try {
        const response = await axios.get(baseUrl + '/alumnilist/', {
          headers: {
            Authorization: 'Bearer ' + auth.accessToken,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });

        const alumnilist = response.data.map((element) => ({
          id: element.id,
          profilePic: baseUrlforImg + "/media/" + element.image_url,
          email: element.email,
          firstName: element.first_name,
          lastName: element.last_name,
          phone: element.phone1,
          gradeName: element.grade_name,
          familyName: element.family_name,
          combinationName: element.combination_name,
          grade: element.grade_name || "none",
          family: element.family_name || "none",
          combination: element.combination_name || "",
          industry: element.career || ""
        }));

        setAlumniData(alumnilist);
        setGradeOptions([...new Set(alumnilist.map(a => a.grade))]);
        setFamilyOptions([...new Set(alumnilist.map(a => a.family))]);
        setCombinationOptions([...new Set(alumnilist.map(a => a.combination))]);
        setIndustryOptions([...new Set(alumnilist.map(a => a.industry))]);

      } catch (err) {
        console.log(err);
      }
    };

    getAlumni();
  }, [auth]);

  const filteredAlumni = alumniData
    .filter((a) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((a) => !gradeFilter || a.grade === gradeFilter)
    .filter((a) => !familyFilter || a.family === familyFilter)
    .filter((a) => !combinationFilter || a.combination === combinationFilter)
    .filter((a) => !industryFilter || a.industry === industryFilter)
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAlumni);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumni');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'alumni_list.xlsx');
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const offset = currentPage * alumniPerPage;
  const currentAlumni = filteredAlumni.slice(offset, offset + alumniPerPage);

  return (
    <div className="DirectoryWrapper">

      <div className="DirectorySearchWrapper">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search alumni..." per="100" />
      </div>

      <div className="filter-bar">
        {/* Grade */}
        <div className={`filter-button ${gradeFilter ? 'filter-applied' : ''}`}>
          {gradeFilter && <button onClick={() => setGradeFilter('')}>&#x2715;</button>}
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="" disabled>Grade</option>
            {gradeOptions.sort().map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* Family */}
        <div className={`filter-button ${familyFilter ? 'filter-applied' : ''}`}>
          {familyFilter && <button onClick={() => setFamilyFilter('')}>&#x2715;</button>}
          <select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>
            <option value="" disabled>Family</option>
            {familyOptions.sort().map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Combination */}
        <div className={`filter-button ${combinationFilter ? 'filter-applied' : ''}`}>
          {combinationFilter && <button onClick={() => setCombinationFilter('')}>&#x2715;</button>}
          <select value={combinationFilter} onChange={(e) => setCombinationFilter(e.target.value)}>
            <option value="" disabled>Combination</option>
            {combinationOptions.sort().map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div className={`filter-button ${industryFilter ? 'filter-applied' : ''}`}>
          {industryFilter && <button onClick={() => setIndustryFilter('')}>&#x2715;</button>}
          <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
            <option value="" disabled>Industry</option>
            {industryOptions.sort().map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="directory-title">
        Search Results:
        <button onClick={handleDownload}>Download Excel</button>
      </div>

      <div className="directory-content">
        <AlumniList alumni={currentAlumni} onSelect={setSelectedAlumni} />
      </div>

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

      {/* MODAL */}
      {selectedAlumni && (
        <div className="lockScreen" onClick={handleClear}>
          <div className="zoomedInContainer" onClick={(e) => e.stopPropagation()}>
            <div className="zoomedIn">
              <AlumniDetail
                selectedAlumni={selectedAlumni}
                handleClear={handleClear}
                gradeFilter={gradeFilter}
                familyFilter={familyFilter}
                combinationFilter={combinationFilter}
                industryFilter={industryFilter}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
