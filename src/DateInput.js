import React, {Component} from 'react'
import './DateInput.css'
import {institutes} from './institutes'

class DateInput extends Component {
    state = {
        newStartDate: "",
        newEndDate: "",
        institute: ""
}


    handleSubmit = (evt) => {
        evt.preventDefault()
        if(!this.state.newStartDate && !this.state.newEndDate){
            alert("You must at least enter !a Start Date")
        } else if (!this.state.newStartDate && this.state.newEndDate){
            this.setState({newStartDate: "", newEndDate: ""}, () => alert("You must enter a Start Date if you want an End Date"))
        } else {
        this.props.dateInput(this.state.newStartDate, this.state.newEndDate)
        this.setState({newStartDate: "", newEndDate: ""}) 
        }  
    }
    
    handleChange = (evt) => (
        this.setState({[evt.target.name]: evt.target.value})
        )

    handleInstituteChange = (evt) => {
        this.setState({institute: evt.target.value})        
        this.props.instituteSelect(evt.target.value)
    }
        

    render() {
     let dropdown = institutes.map((item, idx) => {
     return(
     item === "" ? 
     <option value={item} key={idx} disabled selected hidden>Select an MRI</option>
     :
     <option key={idx} value={item}>{item}</option>
     )})
        
        
    
    return ( 
        <div className="dateInput">
                <div className="dropdown">
                    <div>
                    <p className= "instituteFormTitle">Select MRI</p>
                    </div>
                    <div className="dropdownMenu">
                            <select onChange={this.handleInstituteChange}>
                                {dropdown}
                            </select>
                    </div>
                </div>
           
                <div className="dateModule">
                <form  className="dateInputForm" onSubmit={this.handleSubmit}>      <div className = "inputUnits">      
                    <div className="inputUnit">
                        <div className="column"><p className="inputLabel">Start</p></div>  
                        <div className="column">
                            <input className="dateForm" type="date" name="newStartDate" value={this.state.newStartDate} placeholder="DD/MM/YYYY" onChange={this.handleChange}/>   
                        </div>
                    </div>
                    
                    <div className="inputUnit"> 
                        <div className="column"><p className="inputLabel">End</p></div>
                        <div className="column">
                            <input id="inputLabelEnd" className="dateForm" type="date" name="newEndDate" value={this.state.newEndDate} placeholder="Present or enter DD/MM/YYYY" onChange={this.handleChange}/>
                        </div>
                    </div>
                    </div> 

                    <div className="column" style={{display: "flex", alignItems: "center"}}>
                        <button className="dateInputButton" type="submit" >Submit</button>
                    </div>   
                </form>
                <div className="titleInstruct" >
                    <p>You must enter a Start Date. End Date will default to today.</p>
                </div>
            </div>
        </div>
        )
    }
}

export default DateInput