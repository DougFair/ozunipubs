import React from 'react'

const SubHeading = () => {
    return (
    <div className="subBanner" style={{margin: "0 20px"
}}>
        <p className="subBannerText" style={{lineHeight: 1.3, fontSize: "0.9rem"
        }}>If you work at an Australian University, or are just interested in what your colleagues at Aussie unis are doing, <span style={{fontWeight: "bold", fontStyle: "italic", color: "mediumslateblue" }}>"Aussie Uni Publications"</span>  &nbsp;is an easy way to view their latest papers. If you want to know what biomed papers are being published at Aussie Medical Research Institutes instead, go to our sister site <span style={{fontWeight: "bold", fontStyle: "italic", color: "orange" }}>"Aussie MRI Publications"</span></p>
        <hr style={{marginTop: "20px"}}/>
    </div>
    )
}

export default SubHeading

