import React from 'react';
import "./Navbar.css";
function Navbar() {
  return (
    <div className='{style.div1}'>
        <nav style={{backgroundColor:"#085191",height:"50px",padding:"10px", justifyContent:"space-between",display:"flex",alignItems:"center"}}>
        <ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Home</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">About</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Contact</a>
  </li>

</ul>
        </nav>
    
    </div>
  )
}

export default Navbar;