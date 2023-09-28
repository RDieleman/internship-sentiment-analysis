import {
  Table,
  Cell,
  TableBody,
  Collection,
  useTableOptions,
  Row,
  Column,
  Button,
  TableHeader,
  Checkbox,
} from "react-aria-components";

import "./CustomTable.css";

function CustomTableColumn(props) {
  return (
    <Column {...props}>
      {({ allowsSorting, sortDirection }) => (
        <>
          {props.children}
          {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === "ascending" ? "▲" : "▼"}
            </span>
          )}
        </>
      )}
    </Column>
  );
}

function CustomTableHeader({ columns, children, className }) {
  let { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  return (
    <TableHeader className={className}>
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <Column />}
      {selectionBehavior === "toggle" && (
        <Column>{selectionMode === "multiple" && <MyCheckbox />}</Column>
      )}
      <Collection items={columns}>{children}</Collection>
    </TableHeader>
  );
}

function CustomTableRow({ id, columns, children }) {
  let { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <Row id={id}>
      {allowsDragging && (
        <Cell>
          <Button slot="drag">≡</Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell>
          <MyCheckbox />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </Row>
  );
}

function MyCheckbox() {
  return (
    <Checkbox slot="selection">
      {({ isIndeterminate }) => (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          {isIndeterminate ? (
            <rect x={1} y={7.5} width={15} height={3} />
          ) : (
            <polyline points="1 9 7 14 15 4" />
          )}
        </svg>
      )}
    </Checkbox>
  );
}

export {
  Table as CustomTable,
  TableBody as CustomTableBody,
  Cell as CustomTableCell,
  CustomTableColumn,
  CustomTableHeader,
  CustomTableRow,
};
