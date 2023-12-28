import styles from './reportsTables.module.css';

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, filteredRows },
}) {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      className={styles.filterSearchInput}
      placeholder={` بحث في ${filteredRows?.length} طلب`}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
export default DefaultColumnFilter;
