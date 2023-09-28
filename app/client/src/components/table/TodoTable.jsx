import {
  CustomTable,
  CustomTableBody,
  CustomTableCell,
  CustomTableColumn,
  CustomTableHeader,
  CustomTableRow,
} from "./CustomTable";

const TodoTable = ({ items = [], onSelectionChange }) => {
  const selectedKey = new Set();

  const setSelectedKey = (set) => {
    onSelectionChange(set.values().next().value);
  };

  const columns = [
    { name: "Message", key: "message", isRowHeader: true },
    { name: "Author", key: "author" },
    { name: "Reaction", key: "reaction" },
  ];

  const itemToRow = (item) => {
    return {
      id: item._id,
      author: "Anonymous",
      message: item.content || "No message.",
      reaction:
        item.analysis && item.analysis.emotion
          ? item.analysis.emotion
          : "Being analysed",
    };
  };

  const rowsAssigned = items
    .filter((item) => item.is_assigned)
    .map((item) => itemToRow(item));

  return (
    <div className="table-group">
      <CustomTable
        selectionBehavior="replace"
        selectionMode="single"
        onRowAction={(key) => console.log("clicked with key: ", key)}
        selectedKeys={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        <CustomTableHeader columns={columns}>
          {(column) => (
            <CustomTableColumn isRowHeader={column.isRowHeader}>
              {column.name}
            </CustomTableColumn>
          )}
        </CustomTableHeader>
      </CustomTable>
      <div className="table-separator">Assigned to Me</div>
      <CustomTable
        selectionBehavior="replace"
        selectionMode="single"
        onRowAction={(key) => console.log("clicked with key: ", key)}
        selectedKeys={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        <CustomTableHeader columns={columns} className="gone">
          {(column) => (
            <CustomTableColumn isRowHeader={column.isRowHeader}>
              {column.name}
            </CustomTableColumn>
          )}
        </CustomTableHeader>
        <CustomTableBody items={rowsAssigned} renderEmptyState={() => "None."}>
          {(item) => (
            <CustomTableRow columns={columns}>
              {(column) => (
                <CustomTableCell>{item[column.key]}</CustomTableCell>
              )}
            </CustomTableRow>
          )}
        </CustomTableBody>
      </CustomTable>
    </div>
  );
};

export default TodoTable;
