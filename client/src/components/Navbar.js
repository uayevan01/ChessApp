import React, { useContext, useReducer } from 'react'
import { Link } from 'react-router-dom'
import  { useState } from 'react';

function Navbar() {
     
    const [textField, setTextField] = useState('');
    const [filter, setFilter] = useState('all');
    //const [userObject, setuserObject] = useState(userObject);
    //replace userObject 
    return (
      <div style={{zIndex: '6', width: '100vw', height: '8vh', position: 'fixed', backgroundColor: 'white'}}>
          <Link to="/">
            <div style={{position: 'absolute', backgroundColor: 'lightblue', width: 'auto', height: '100%', fontSize: '8vh'}}>
                FeenChess
            </div>
          </Link>
          
      </div>  
    );
  }

export default Navbar;