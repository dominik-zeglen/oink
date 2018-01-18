import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';


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
      { name: 'Main page', view: '' },
    ],
  },
  {
    key: 'contentGroup',
    name: 'Manage',
    children: [
      { name: 'Objects', view: 'list/' },
      { name: 'Modules', view: 'modules/' },
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
        {menuGroup.children.map(menuElement => (
          <Link to={`${props.rootPath}/${menuElement.view}`} key={menuElement.name}>
            <MenuItem>
              {menuElement.name}
            </MenuItem>
          </Link>
        ))}
      </div>
    ))}
  </Drawer>
);

export {
  Sidebar as default,
};
