import React from 'react'
import './PaperDisplay.css'
import moment from 'moment';


const PapersDisplay = (props) => {
    let heading = ""

    if((props.inputedDate1 || props.inputedDate2) &&!props.idlistSelected.length) {
    heading =
      <div>
      {!props.inputedDate2 ? 
       <p className="noPapers">There have been no papers published at {props.selectedInstitute} since {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}.</p>
      : 
      <p className="noPapers">There were no papers published at {props.selectedInstitute} between {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")} - {moment(props.inputedDate2, "YYYY-MM-DD").format("DD/MM/YYYY")}.</p>
      }
    </div>
  } else {
  
  if (props.inputedDate1) {
      heading = 
      <div>
      {!props.inputedDate2 ? 
          <div>
          <h2 className="dateHeading">Papers published since {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}</h2>
          <h2 className="totalpapers">({props.papersList.length} in total)</h2>
          </div>
          :
          <div>
          <h2 className="dateHeading">Papers published between {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")} - {moment(props.inputedDate2, "YYYY-MM-DD").format("DD/MM/YYYY")} </h2>
          <h2 className="totalpapers">({props.papersList.length} in total)</h2>
          </div>
          }
      </div>
  } else if (props.selectedInstitute){
     if (props.papersList.length) { 
    heading = 
    <div>        
    <h2 className="dateHeading">Papers in last the 3 days</h2>
    <h2 className="totalpapers">({props.papersList.length} in total)</h2>
    </div>
     } else {
     heading = 
    <p className="noPapers">There were no papers published at {props.selectedInstitute} in the last 3 days.</p>
    }
  } else if (!props.selectedInstitute){
    heading = 
    <div>        
    {<div>
      <h2 className="dateHeading">Papers in the last 3 days</h2>
      <h2 className="totalpapers">({props.papersList.length} in total)</h2>
    </div>}
    {!props.papersList.length && 
    <p className="noPapers">There were no papers published at any Australian Uni in the last 3 days.</p>
    }
    </div>
  }
}

let listDisplay = ""
if (props.papersList.length) {
 listDisplay = props.papersList.map(data => {
    let volume = ""
    if (data.volume === "") {
      volume = " volume/pages not yet available"
    } else {
    volume = `${data.volume}: `
    }
    return (   
    <div className="paperlistContainer" key={props.selectedInstitute ? data.id : (data.id+"a")}>
      <span>
        <span className="title">{`${data.title} `}</span>
        <span className="authors">{`${data.authors}, `}</span>
        <span className="year">{`(${data.pubdate}), `}</span>
        <span className="journal">{`${data.journal},  `}</span>
        <span className="volume">{`${volume} `}</span>
        <span className="pages">{`${data.pages},  `}</span>
        <span className="doi">{`${data.doi}, `}</span>
        <span className="pmid">PMID: <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${data.id}`} target="_blank" rel="noopener noreferrer">{data.id}.</a></span>
      </span>
    </div>
    )
})
}
    return (
        <div>
            {heading}
            {listDisplay}
        </div>
        )
}

export default PapersDisplay