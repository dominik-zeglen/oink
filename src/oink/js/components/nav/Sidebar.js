import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


const drawerStyle = {
  height: 'calc(100vh - 66px)',
  top: '66px',
};
const groupLabelStyle = {
  margin: '16px 0 0 16px',
};
const menu = [
  {
    key: 'unnamedGroup',
    children: [
      { name: 'Main page', view: 'index' },
    ],
  },
  {
    key: 'contentGroup',
    name: 'Manage',
    children: [
      { name: 'Objects', view: 'manageCategory' },
      { name: 'Modules', view: 'manageModules' },
    ],
  },
];

const GroupLabel = props => (
  <small style={groupLabelStyle}>{props.name}</small>
);

const Sidebar = props => (
  <Drawer open={props.open} containerStyle={drawerStyle}>
    {menu.map(menuGroup => (
      <div key={menuGroup.key}>
        {menuGroup.name && <GroupLabel name={menuGroup.name} />}
        {menuGroup.children.map(menuElement => <MenuItem key={menuElement.name} onClick={props.onMenuItemClick}>{menuElement.name}</MenuItem>)}
      </div>
    ))}
  </Drawer>
);

export {
  Sidebar as default,
};
