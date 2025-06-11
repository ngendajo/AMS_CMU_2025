import React, { useState, useEffect } from 'react';
import AlumniList from '../../components/directory/alumni-list';
import AlumniDetail from '../../components/directory/alumni-detail.jsx';
import SearchBar from '../../components/dashboard/search-bar';
import './AlumniDirectory.css';

import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';
import useAuth from '../../hooks/useAuth';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { useRef, useCallback } from 'react';

const AlumniDirectory = () => {
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const handleClear = () => {
        setSelectedAlumni(null);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [alumniData, setAlumniData] = useState([]);
    const [outcomeSummary, setOutcomeSummary] = useState({});
    // const [alumni, setAlumni] = useState([]);
    const [filters, setFilters] = useState({
        gender: [],
        graduation_year: [],
        family: [],
        combination: [],
        industry: [],
    });

    const [gradeFilter, setGradeFilter] = useState('');
    const [familyFilter, setFamilyFilter] = useState('');
    const [combinationFilter, setCombinationFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const [pagination, setPagination] = useState({
                current_page: 1,
                page_size: 10,
                total: 0,
                has_next: false,
                has_previous: false,
              });

    const { auth } = useAuth();

    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const loader = useRef(null);
    const gradeOptions = filters.graduation_year.map((item, index) => {
        const year = item.family__grade__graduation_year_to_asyv;
        const name = item.family__grade__grade_name;
        const label = `${name} (${year})`;
        const value = year; 
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      });
    const familyOptions = filters.family.map((item) => ({
        label: item.family__family_name,
        value: item.family__id, 
      }));
    const combinationOptions = filters.combination.map((item) => ({
        label: item.combination__combination_name,
        value: item.combination_id,
    }));
    const industryOptions = filters.industry;

    useEffect(() => {
        const fetchAlumni = async () => {
            setLoading(true);
            const params = {
                page: pagination.current_page,
                page_size: pagination.page_size,
            };
            if (gradeFilter) params.year = gradeFilter;
            if (familyFilter) params.family = familyFilter;
            if (combinationFilter) params.combination = combinationFilter;
            if (industryFilter) params.industry = industryFilter;
    
            try {
                const response = await axios.get(baseUrl + '/alumni-directory/', {
                    params,
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials: true
                });
    
                const alumnilist = response.data.data.map((element) => ({
                    id: element.id,
                    profilePic: baseUrlforImg + element.image_url,
                    email: element.email,
                    firstName: element.first_name,
                    lastName: element.rwandan_name,
                    phone: element.phone,
                    gradeName:element.family.grade.grade_name,
                    familyName:element.family.family_name,
                    combinationName:element.combination.combination_name,
                    grade: element.family.grade.grade_name || "none",
                    family: element.family.family_name || "none",
                    combination: element.combination.combination_name || "",
                    industry: element.employment.industry || ""
                }));
    
                setAlumniData((prevData) => [...prevData, ...alumnilist]);
                setFilters(response.data.filters);
                setOutcomeSummary(response.data.outcome_summary);
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.pagination.total,
                    has_next: response.data.pagination.has_next,
                    has_previous: response.data.pagination.has_previous,
                }));
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
    
        fetchAlumni();
    }, [pagination.current_page, gradeFilter, familyFilter, combinationFilter, industryFilter]);

    useEffect(() => {
        setAlumniData([]);
        setPagination((prev) => ({
            ...prev,
            current_page: 1
        }));
    }, [gradeFilter, familyFilter, combinationFilter, industryFilter]);

    const lastAlumniElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pagination.has_next) {
                setPagination(prev => ({
                    ...prev,
                    current_page: prev.current_page + 1
                }));
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, pagination.has_next]);    

    const handleDownload = async () => {
        try {
            const params = {
                page_size: 10000, // or any high number to ensure you get all data
            };
            if (gradeFilter) params.year = gradeFilter;
            if (familyFilter) params.family = familyFilter;
            if (combinationFilter) params.combination = combinationFilter;
            if (industryFilter) params.industry = industryFilter;
    
            const response = await axios.get(baseUrl + '/alumni-directory/', {
                params,
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials: true
            });
    
            const allAlumni = response.data.data.map((element) => ({
                id: element.id,
                email: element.email,
                firstName: element.first_name,
                lastName: element.rwandan_name,
                phone: element.phone,
                grade: element.family.grade.grade_name || "none",
                family: element.family.family_name || "none",
                combination: element.combination.combination_name || "",
                industry: element.employment.industry || ""
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(allAlumni);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumni');
    
            // Add filter info on a second sheet
            const filterInfo = [
                ['Grade Filter', gradeFilter || 'None'],
                ['Family Filter', familyFilter || 'None'],
                ['Combination Filter', combinationFilter || 'None'],
                ['Industry Filter', industryFilter || 'None'],
            ];
            const filterSheet = XLSX.utils.aoa_to_sheet(filterInfo);
            XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filters');
    
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(data, 'alumni_list.xlsx');
    
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    const handleGradeFilter = () => {
        setGradeFilter('');
    };
    const handleFamilyFilter = () => {
        setFamilyFilter('');
    };
    const handleCombinationFilter = () => {
        setCombinationFilter('');
    };
    const handleIndustryFilter = () => {
        setIndustryFilter('');
    };
    
    return (
        <div className="DirectoryWrapper">
            <div className="DirectoryRest">
                <div className="DirectoryList">
                    <div className="DirectorySearchWrapper">
                        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search alumni..." per="100"/>
                    </div>
                    <div className="filter-bar">
                        <div className={`filter-button ${gradeFilter ? 'filter-applied' : ''}`}>
                            {gradeFilter && <button onClick={handleGradeFilter}>&#x2715;</button>}
                            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
                                <option value="" disabled>Grade</option>
                                {gradeOptions}
                            </select>
                        </div>
                        <div className={`filter-button ${familyFilter ? 'filter-applied' : ''}`}>
                            {familyFilter && <button onClick={handleFamilyFilter}>&#x2715;</button>}
                            <select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>
                            <option value="" disabled>Family</option>
                            {familyOptions.slice().sort((a, b) => a.label.localeCompare(b.label)).map((family) => (
                                <option key={family.value} value={family.value}>
                                {family.label}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className={`filter-button ${combinationFilter ? 'filter-applied' : ''}`}>
                            {combinationFilter && <button onClick={handleCombinationFilter}>&#x2715;</button>}
                            <select value={combinationFilter} onChange={(e) => setCombinationFilter(e.target.value)}>
                                <option value="" disabled>Combination</option>
                                {combinationOptions.slice().sort((a, b) => a.label.localeCompare(b.label)).map((combination) => (
                                    <option key={combination.value} value={combination.value}>{combination.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={`filter-button ${industryFilter ? 'filter-applied' : ''}`}>
                            {industryFilter && <button onClick={handleIndustryFilter}>&#x2715;</button>}
                            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                                <option value="" disabled>Industry</option>
                                {industryOptions.slice().sort().map((industry) => (
                                    <option key={industry} value={industry}>{industry}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="directory-title">
                        Search Results:
                        <button onClick={handleDownload}>Download Excel</button>
                    </div>
                    <div className="directory-content">
                        <AlumniList alumni={alumniData} onSelect={setSelectedAlumni} lastRef={lastAlumniElementRef} />
                        <div ref={loader}></div>
                    </div>
                </div>
                <div className="DirectoryDetail">
                    <AlumniDetail selectedAlumni={selectedAlumni} handleClear={handleClear}
                                  gradeFilter={gradeFilter}
                                  familyFilter={familyFilter}
                                  combinationFilter={combinationFilter}
                                  industryFilter={industryFilter}
                                  outcomeSummary={outcomeSummary}
                                  />
                </div>
            </div>
        </div>
    );
};

export default AlumniDirectory;