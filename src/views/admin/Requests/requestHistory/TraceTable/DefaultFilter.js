import styles from "./traceTable.module.css";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, filteredRows },
}) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      className={styles.filterSearchInput}
      placeholder={` بحث في ${filteredRows?.length}`}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
export default DefaultColumnFilter;
