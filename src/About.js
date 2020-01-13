import React from 'react'
import './About.css'

const About = () => 
            <div >
                <div className="aboutContainer">
                    <div className="aboutHeader">
                        <h1>About Aussie MRI Pubs...</h1>
                            <p>In essence, it is easy to search Pubmed for any papers published by a particular Australian university, however, if you are interested in what is going on at Australian unis across the board, it is much more difficult. <span className="titleSpan">Aussie Uni Pubs</span> lets you do this with ease.
                            </p>
                            <p>Currently we  search all Universities that are listed on the <a href="https://www.studyinaustralia.gov.au/English/Australian-Education/Universities-Higher-Education/list-of-australian-universities/">studyinaustralia.gov.au</a> website. Unfortunately, we cannot promise we will pick up every paper that is published in any selected time period as authors sometimes will list their affilation using a non-standard abbreviation or name. Although this is unavoidable, we are pretty confident we will pick up the majority of papers for any given Australian within the time frames entered.  
                            </p>
                            
                            <p >Please use the <span><a href="/contact">Contact</a></span> page to provide any feedback on this app. We are very open to suggestions! 
                            </p>
                    </div>
                </div>
            </div>

export default About;

