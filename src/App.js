import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import PapersDisplay from './PapersDisplay';
import moment from 'moment';
import DateInput from './DateInput'
import Spinner from './Spinner'
import WelcomeBanner from './WelcomeBanner'
import Toolbar from "./Toolbar"
import {Route, Switch} from 'react-router-dom'
import {splitInstitutes} from './institutes'
import SubHeading from './SubHeading'
import ResetButton from "./ResetButton"
import ApiError from "./ApiError"
import Contact from './Contact'
import About from './About'




class App extends Component {
  state= {
    idlistAll: [],
    idlistSelected: [],
    papersList : [],
    dateMinus3: moment().subtract("3", "days").format("YYYY/MM/DD"),
    inputedDate1: "",
    inputedDate2: "",
    loading: false,
    selectedInstitute: "",
    allInstituteList: [],
    apiError: false,
  }

  componentDidMount () {
    let allInstituteList = []
    splitInstitutes.forEach(instituteList => {
      let instAfill = []
      instituteList.forEach(institute => {
      instAfill.push(institute+"[Affiliation] OR ")
      })
      allInstituteList.push(instAfill)
    })
    
    this.setState({loading: true, allInstituteList})
    
    let loop = 0
    allInstituteList.forEach(institute => {
    
    const instituteString = institute.toString().replace(/,/g,"").slice(0,-4)
    let urlunencoded = `(((${instituteString})) AND ("`
    const urlEncoded = encodeURIComponent(urlunencoded)
    
    const dateParams = `${this.state.dateMinus3}"[Date - Entrez] : "3000"[Date - Entrez])`
    const dateParamsEncoded = encodeURIComponent(dateParams)


    const url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10000&term=${urlEncoded}${dateParamsEncoded}`
    axios.get(url)
    .then(response => {        
      const idlistAll = this.state.idlistAll.concat(response.data.esearchresult.idlist)
      this.setState({idlistAll}, () => {
      loop = loop +1
    })
      allInstituteList.length === loop &&
      this.addPapers()

    })
      .catch(error => 
          this.setState({apiError: true, loading: false})
      )
  })
}


dateInput = (date1, date2) => {
  if (!this.state.selectedInstitute) {
     alert('The date input does not work if all Institutes are selected. Go to the drop-down menu to select an institute before you input a date.')
  } else {
  const convertedDate1 = moment(date1, "YYYY-MM-DD").format("YYYY/MM/DD")
  let convertedDate2 = ""
  if (date2) {
  convertedDate2 = moment(date2, "YYYY-MM-DD").format("YYYY/MM/DD")
  }
  this.setState({inputedDate1:convertedDate1, inputedDate2:convertedDate2}, () => 
    this.getIdList()
  )
}
}

getIdList = () => {
  this.setState({loading: true})
  let dateParams = ""
  
  if (!this.state.inputedDate1) {
      dateParams = `${this.state.dateMinus3}"[Date - Entrez] : "3000"[Date - Entrez])`
  } else if (this.state.inputedDate1 && !this.state.inputedDate2){
      dateParams = `${this.state.inputedDate1}"[Date - Entrez] : "3000"[Date - Entrez])`
  } else if (this.state.inputedDate1 && this.state.inputedDate2) {
      dateParams = `${this.state.inputedDate1}"[Date - Entrez] : "${this.state.inputedDate2}"[Date - Entrez])`
  }

  const urlunencoded = `((${this.state.selectedInstitute}[Affiliation]) AND ("`
  const urlEncoded = encodeURIComponent(urlunencoded)
  const dateParamsEncoded = encodeURIComponent(dateParams)
  const url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=10000&term=${urlEncoded}${dateParamsEncoded}&api_key=${process.env.REACT_APP_PUBMED_API_KEY}`
  
  axios.get(url)
  .then(response => {
    this.setState({idlistSelected: response.data.esearchresult.idlist}, () => {
      this.addPapers()
      })
  })
  .catch(error => 
    this.setState({apiError: true, loading: false})
  )
}


  addPapers = () => { 
    this.setState({loading: true})
    let idlistToDisplay=[]  
    if (this.state.selectedInstitute) {
      if (this.state.idlistSelected.length > 2000) {
        alert("Your search returned: " + this.state.idlistSelected.length + " papers. All papers beyond the 2000th have been removed. If you want to see more papers in that date range, please perform separate searches using closer start and end dates.")
        idlistToDisplay = this.state.idlistSelected.slice(0,2000) 
      } else {
        idlistToDisplay = this.state.idlistSelected
      } 
    } else {
      idlistToDisplay = this.state.idlistAll
    }
    let paperListString = []
    let paperList = []
    
    let idlistToDisplaySet = [...new Set(idlistToDisplay)]

    if (idlistToDisplaySet.length < 350){
      paperListString.push([idlistToDisplaySet.toString()])
    } else {
      for (let i=0; i < idlistToDisplaySet.length; i+=349) {
        paperListString.push([idlistToDisplaySet.slice(i,i+349).toString()]);
      }
    }

    if (idlistToDisplaySet.length) {
      let loop = 0
      paperListString.forEach(listString => {
        axios.get( `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${listString}&api_key=${process.env.REACT_APP_PUBMED_API_KEY}`)       
        .then(response => {
              let myObj=response.data.result
              Object.keys(myObj).forEach(key => {
                let paperObj = {}
                if (key !== "uids") {
                let id = myObj[key].uid
                let title = myObj[key].title
                let  journal = myObj[key].fulljournalname
                let  volume = myObj[key].volume
                let  pages = myObj[key].pages
                let  doi = myObj[key].elocationid
                let  authors = myObj[key].authors
                let  pubdate = myObj[key].pubdate.slice(0,4) 
              let authorList = []
              authors.map((author, idx) =>
              idx > 0
                ? authorList.push(" " + author.name)
                : authorList.push(author.name)
              )
            paperObj.id = id;
            paperObj.title = title;
            paperObj.journal = journal;
            paperObj.authors = authorList.toString();
            paperObj.doi = doi;
            paperObj.volume = volume;
            paperObj.pages = pages;
            paperObj.pubdate = pubdate;  
            paperList.push(paperObj);
            }})       
          })
          .then(result => {
            loop === paperListString.length && 
            this.setState({ papersList: paperList, loading: false })
          })
          .catch(error => 
            this.setState({apiError: true, loading: false})
          )
          loop = loop + 1
      });
    } else {
      this.setState({ papersList: paperList, loading: false })
    }
  }



instituteSelect = (institute) => {
  if (institute === "All") {
    this.setState({loading: true, selectedInstitute: "", inputedDate1: "", inputedDate2: ""}, () => {this.addPapers()})
  } else {
  this.setState({loading: true, selectedInstitute: institute}, () => {
      this.getIdList()
  })}
}

resetDates = () => {
  this.setState({inputedDate1: "", inputedDate2: ""}, () => this.getIdList() ) 
}

apiReset = () => {
  if (this.state.selectedInstitute){
  this.setState({apiError:false}, () => this.getIdList()) 
  } else {
    this.setState({apiError:false}, () => this.addPapers()) 
  }
}

  render() {
    let papersDisplay = ""

      papersDisplay =  <PapersDisplay 
      papersList = {this.state.papersList}
      inputedDate1 = {this.state.inputedDate1}
      inputedDate2 = {this.state.inputedDate2}
      selectedInstitute = {this.state.selectedInstitute}
      idlistAll = {this.state.idlistAll}
      idlistSelected = {this.state.idlistSelected}
      /> 
      
      if(this.state.loading) {
        papersDisplay = <Spinner />
      } else if (this.state.apiError) {
        papersDisplay = <ApiError 
        apiReset={this.apiReset}
        />
      }
    
    return ( 
      <div className="App">
      <Toolbar />
      <Switch>
          <Route exact path="/" render= {() => 
            <>
            <WelcomeBanner />
            <DateInput
              dateInput = {this.dateInput}
              instituteSelect = {this.instituteSelect}
            /> 
            <SubHeading />  
            {this.state.inputedDate1 &&
            <ResetButton 
              resetDates = {this.resetDates}
            />
            }
            
            <div className="displayContainer">
              {this.state.selectedInstitute ?
              <div>
              <h1 className="instituteTitle">{this.state.selectedInstitute}</h1>
              <p className="instituteTitleSubHeading">Customise search dates above</p>
              </div>
              :
              <div>
              <h1 className="instituteTitle">All Australian Unis</h1>
              <p className="instituteTitleSubHeading">Select a specific Uni above</p>
              </div>
              }
              {papersDisplay}
            </div>
            </>
            } 
          />
           <Route exact path="/about" render= {() => 
              <About />
            }
            />
            <Route exact path="/contact" render= {() => 
              <Contact />
            }
            />
        </Switch>
      </div>

    );
  }
}
export default App;
