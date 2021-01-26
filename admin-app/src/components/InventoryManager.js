import React, { Component } from 'react';
import ItemCard from './ItemCard';
import './InventoryManager.css';

/**
 * Component allows for full inventory search
 * 
 * @class
 */
export default class InventoryManager extends Component {
    constructor(props) {
        super(props);
        this.state = { query: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCreateOverlay = this.handleCreateOverlay.bind(this);
    }

    /**
     * Filter items based on the provided string.
     * 
     * Only items containing the query string in the 'name' attribute will be included in the search results.
     * 
     * @param {string} query The query to filter by.
     */
    getElements(query) {
        let key = 0;
        let items = this.props.inv;
        let elements = [];
        const cleanQuery = query.toLowerCase().trim();

        if (this.state.cleanQuery !== '') {
            items = items.filter(item => item.name.toLowerCase().includes(cleanQuery));
        }

        for (const i in items) {
            elements.push(
                <ItemCard itemInfo={items[i]} key={key} overlay={this.props.overlay} type="large" />
            );
            key++;
        }

        return elements;
    }

    /**
     * Updates state with new search query.
     * 
     * @param {Object} event HTML event.
     */
    handleChange(event) {
        this.setState({ query: event.target.value });
    }

    /**
     * Prevents reload.
     * 
     * @param {Object} event HTML event.
     */
    handleSubmit(event) {
        event.preventDefault();
    }

    /**
     * Generates create modal window.
     */
    handleCreateOverlay() {
        this.props.overlay();
    }

    render() {
        const elements = this.getElements(this.state.query);

        return (
            <div className="center-vh">
                <form onSubmit={this.handleSubmit} className="w-60 flex f-j-spacebetween f-ac-stretch mt-05 mb-05">
                        <button type="button" className="w-10 bg-accept fas fa-plus cw" />
                        <input className="w-75" type="text" value={this.state.value} onChange={this.handleChange} />
                        <button type="button" className="w-10 bg-accept fas fa-plus" onClick={this.handleCreateOverlay} />
                </form>
                <div className="adapt-width">
                    {elements}
                </div>
            </div>
        );
    }
}

