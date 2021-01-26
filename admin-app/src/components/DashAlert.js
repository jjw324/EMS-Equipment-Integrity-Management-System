import React, { Component } from 'react';
import ItemCard from './ItemCard';
import './DashAlert.css'

/**
 * Generates an alert panel for the items passed in as a prop.
 * 
 * @class
 */
export default class DashAlert extends Component {
    constructor() {
        super();

        this.state = { expanded: false };

        this.handleExpand = this.handleExpand.bind(this);
    }

    handleExpand() {
        this.setState({ expanded: !this.state.expanded });
    }
    // add function to generate cards instead of doing it in render

    render() {
        let key = 0;
        const items = this.props.items;
        let elements = [];

        for (const i in items) {
            elements.push(
                <ItemCard itemInfo={items[i]} key={key} overlay={this.props.overlay} type="small" />
            );
            key++;
        }

        const expanded = (this.state.expanded) ? "toggle-mobile-a" : "toggle-mobile-b";

        return (
            <div>
                <div className="flex f-j-spacebetween padding-mobile" onClick={this.handleExpand}>
                    <button className="fas fa-lg fa-chevron-down show-mobile w-5 bg-none b-none p-l-1" />
                    <h2 className="f-grow">{this.props.title}</h2>
                    <button className="fas fa-lg fa-chevron-down show-mobile w-5 bg-none b-none cw p-r-1" />
                </div>
                <div className={expanded}>
                    {elements}
                </div>
            </div>
        );
    }
}