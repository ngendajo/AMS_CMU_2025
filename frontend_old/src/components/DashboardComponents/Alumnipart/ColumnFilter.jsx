export const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
      <span>
        <input
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          placeholder={`Search records...`}
          style={{
            fontSize: "0.7rem",
            margin: "1rem 0",
            width:'80px',
          }}
        />
      </span>
    );
  };