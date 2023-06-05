import { format } from "date-fns";

export const COLUMNS = [
  
  {
    Header: "id",
    accessor: "id",
    disableFilters: true, 
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "First Name",
    accessor: "first_name",
  },
  {
    Header: "Last Name",
    accessor: "last_name",
  },
  {
    Header: "Gender",
    accessor: "gender",
    disableFilters: true, 
  },
  {
    Header: "Grade",
    accessor: "grade_name",
  },
  {
    Header: "Family",
    accessor: "family_name",
  },
  {
    Header: "Combination",
    accessor: "combination_name",
  },
  {
    Header: "Action",
    accessor: "user_id",
    disableFilters: true, 
  },
  
];