import React from 'react';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';
import "./styles/AddWord.scss";


class AddWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            notification: null,
            english: "",
            persian: "",
            synonym: "",
            antonym: "",
            reference:""
        }
    }

    renderSpinner = () => {
        if (this.state.isSubmitting) {
            return <Spinner />
        }
    }

    handleInputChange = (event, stateProp) => {
        this.setState({
            [stateProp]: event.target.value
        })
    }

    renderInput = (lang, isTextArea, label, stateProp) => {
        return (
            <div className="input">
                <label htmlFor={`search-box ${stateProp}`}>
                    {label}
                </label>
                {isTextArea ? 
                    <textarea className={`form-control input-box ${lang}`} 
                    id={`search-box ${stateProp}`} 
                    type="text" 
                    value={this.state[stateProp]}
                    onChange={(event) => this.handleInputChange(event, stateProp)}
                    /> :
                    <input className={`form-control input-box ${lang}`} 
                    id={`search-box ${stateProp}`} 
                    type="text" 
                    value={this.state[stateProp]}
                    onChange={(event) => this.handleInputChange(event, stateProp)}
                    />
                }   
            </div>
        )
    }

    renderNotification = () => {
        const {notification} = this.state;
        if (notification !== null) {
            return (
                <div className={`notification ${notification.success ? "success" : "error"}`}>
                    {notification.message}
                </div>
            )
        }
    }

    formPersianMeaning = () => {
        let meaning = this.state.persian;
        if (this.state.synonym !== "") meaning += ` ???????????? ${this.state.synonym}`;
        if (this.state.antonym !== "") meaning += ` ?????????? ${this.state.antonym}`;
        if (this.state.reference !== "") meaning += ` ??? ${this.state.reference}`;
        return meaning;
    }

    addWord = () => {
        const persian = this.formPersianMeaning();
        if (this.state.english !== "" && this.state.persian !== "") {
            axios.post("http://localhost:3100/add", {english:this.state.english, persian:persian}, {withCredentials: true}).then(
                respone => {
                    this.setState({
                        isSubmitting: false,
                        notification: respone.data.status === 200 ? {
                            message: "?????? ???????? ?????? ???? ???????????? ???????????? ????!",
                            success: true
                        } : {
                            message: "???????????? ???? ???????? ?????????? ????!???????? ?????? ???????? ???? ?????????? ?????? ?????????? ???? ?????? ?????????? ????????",
                            success: false
                        }
                    })
                }
            )
            this.setState({
                isSubmitting: true,
                notification: null
            })
        }
        else {
            this.setState({
                notification:{
                    success: false,
                    message: "???????? ???? ???? ?????????? ???? ???? ????????!"
                }
            })
        }
    }

    render() {
        return (
            <div className="add-word">
                <div className="header">
                    ???????????? ????????
                </div>
                <div className="inputs">
                    {this.renderInput("en-me", true, "??????????????", "english")}
                    {this.renderInput("fa-me", true, "??????????", "persian")}
                    {this.renderInput("en-me", false, "????????????", "synonym")}
                    {this.renderInput("en-me", false, "??????????", "antonym")}
                    {this.renderInput("en-me", false, "??????????", "reference")}
                </div>
                <div className="buttons">
                    <button onClick={this.addWord} type="button" className="btn btn-primary edit-button">????????????</button>
                </div>
                {this.renderSpinner()}
                {this.renderNotification()}
            </div>
        )
    }
}


export default AddWord;