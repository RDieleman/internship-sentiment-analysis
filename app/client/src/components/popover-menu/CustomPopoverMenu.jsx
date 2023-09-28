import {
  Item,
  Popover,
  MenuTrigger,
  Button,
  Menu,
} from "react-aria-components";

import "./CustomPopoverMenu.css";

function CustomMenuButton({ label, children, ...props }) {
  return (
    <MenuTrigger {...props}>
      <Button>{label}</Button>
      <Popover>
        <Menu {...props}>{children}</Menu>
      </Popover>
    </MenuTrigger>
  );
}

function CustomMenuItem(props) {
  return (
    <Item
      {...props}
      className={({ isFocused, isSelected }) =>
        `custom-menu-item ${isFocused ? "focused" : ""}`
      }
    />
  );
}

export { CustomMenuButton, CustomMenuItem };
