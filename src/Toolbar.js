import React from 'react'
import {Link} from 'react-router-dom'
import './Toolbar.css'

const Toolbar = () => {
    
    return (
        <nav className="nav">
            <div>
                <Link to="/" className="link">UNI PUBS</Link>
            </div>
            <div>
                <Link to="/about" className="link">About</Link>
                <Link to="/contact" className="link">Contact</Link>
            </div>
        </nav>
      );
}
 
export default Toolbar;