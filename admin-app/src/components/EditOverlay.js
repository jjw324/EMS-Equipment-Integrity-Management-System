import axios from 'axios';
import React, { Component } from 'react';
import './EditOverlay.css';
import termMap from './termMap.json';

/**
 * Provides modal window for editing currently-existing inventory items.
 * 
 * @class
 */
export default class EditOverlay extends Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
        this.handleExitClick = this.handleExitClick.bind(this);
        this.generateForm = this.generateForm.bind(this);
    }

    /**
     * Confirms user input and then patches the event in the database if changes were made.
     * 
     * @param {Object} event HTML event.
     */
    async handleSubmit(event) {
        event.preventDefault();

        let changedRows = [];
        let changedObj = {};
        for (const prop in this.props.editingItem) {
            if (this.props.editingItem[prop] !== this.props.readOnlyItem[prop]) {
                changedRows.push(`${termMap[prop].fullLabel}: ${this.props.readOnlyItem[prop]} --> ${this.props.editingItem[prop]}`);
                changedObj[prop] = this.props.editingItem[prop];
            }
        }

        if (changedRows.length === 0) {
            const res = window.confirm("No changes made. Is this correct?");
            if (res) {
                this.props.handleClose("EditOverlay");
            }
            return;
        }

        const res = window.confirm(`Changes made:\n\n${changedRows.join('\n')}\n\nSubmit?`);

        if (res) {
            try {
                const dbRes = (this.props.editingItem.hasOwnProperty('id'))
                    ? await axios.patch(`http://${process.env.REACT_APP_API_URL}/item/${this.props.editingItem.id}`, changedObj)
                    : await axios.patch(`http://${process.env.REACT_APP_API_URL}/specialitem/${this.props.editingItem.serial_number}`, changedObj);

                console.log(dbRes);
                this.props.handleClose("EditOverlay");
            } catch (err) {
                console.log(err);
                window.alert("Unable to patch item to database. Please try again.");
            }
        }
    }

    /**
     * Deletes the item from the database.
     */
    async handleDelete() {
        const res = window.confirm("Are you sure you'd like to delete this item? Once deleted, the item cannot be retrived");

        if (res) {
            try {
                const dbRes = (this.props.editingItem.hasOwnProperty('id'))
                    ? await axios.delete(`http://${process.env.REACT_APP_API_URL}/item/${this.props.editingItem.id}`)
                    : await axios.delete(`http://${process.env.REACT_APP_API_URL}/specialitem/${this.props.editingItem.serial_number}`);

                console.log(dbRes);
                this.props.handleClose("EditOverlay");
            } catch (err) {
                console.log(err);
                window.alert("Unable to delete item from database. Please try again.");
            }
        }
    }

    /**
     * Confirms if the user wants to close the modal and then closes the modal based on user's choice.
     */
    handleExitClick() {
        const item = this.props.editingItem;
        const readOnly = this.props.readOnlyItem;
        let editMade, res;
        
        for (const prop in item) {
            if (item[prop] !== readOnly[prop]) editMade = true;
        }

        res = (editMade) ? window.confirm("Are you sure you want to exit? Any edits will be lost.") : true;

        if (res) {
            this.props.handleClose("EditOverlay");
        }
    }

    /**
     * Generates an HTML form to edit the desired item. 
     * 
     * @param {Object} item The item to be edited
     */
    generateForm(item) {
        let labels = [];
        let boxes = [];
        let key = 0;

        for (const property in item) {
            let inputType;
            if (termMap[property].type === "String") inputType = "text";
            else if (termMap[property].type === "Number") inputType = "number";
            else if (termMap[property].type === "YYYY-MM-DD") inputType = "date";

            key++;
            labels.push(<div key={key} className="mb-05"><label htmlFor={property} >{termMap[property].fullLabel}:</label><br /></div>); //push label
            key++;
            if (termMap[property].readOnly) {
                boxes.push(<div key={key} className="mb-05"><p>{this.props.editingItem[property]} (read-only)</p></div>);
            } else {
                boxes.push(
                    <div key={key}>
                        <input className="w-100 mb-05" type={inputType} id={property} name={property} onChange={this.props.handleFormChange} value={this.props.editingItem[property]} required />
                        <br />
                    </div>
                );
            }
        }
        return (
            <>
                <div id="labels">{labels}</div>
                <div id="boxes">{boxes}</div>
                <div id="confirm" className="flex f-j-spacebetween f-ai-center">
                    <button type="submit" className="fas fa-check w-83 bg-accept h-50" />
                    <button type="button" className="fas fa-trash w-15 bg-reject h-50" onClick={this.handleDelete} />
                </div>
            </>
        )
    }

    render() {
        if (!this.props.show) return null;

        const formElements = this.generateForm(this.props.editingItem);

        return (
            <div className="center-vh w-100 h-100 bg-haze fixed-u-l" onClick={this.handleExitClick}>
                <form className="w-40" onSubmit={this.handleSubmit}>
                    <div id="editOverlay-main" className="w-100 h-100 br-15 p-r-1 p-l-1 bg-white border-box" onClick={(e) => e.stopPropagation()}>
                        <div id="editOverlayTitle" className="flex f-j-spacebetween f-ai-center">
                            <button type="button" onClick={this.handleExitClick} className="br-1 w-5 mt-1 mb-1 fas fa-times" />
                            <h2>Edit Item</h2>
                            <button type="button" onClick={this.handleExitClick} className="w-5 h-75 cw"><i className="fas fa-times"></i></button>
                        </div>
                        {formElements}
                    </div>
                </form>
            </div>
        )
    }
}