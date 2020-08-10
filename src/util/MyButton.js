import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


export default ({children, onClick,title, btnClassName,tipClassName}) => (
  <Tooltip title={title} className={tipClassName} >
       <IconButton onClick={onClick} className={btnClassName}>
           {children}
          
       </IconButton>
   </Tooltip>
  )
