import React, { Component } from 'react';
import termMap from './termMap.json';
import './ItemCard.css';

/**
 * Creates card with item image, name, and info.
 * 
 * @class
 */
export default class ItemCard extends Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Shows modal window for editing item.
     */
    handleClick() {
        this.props.overlay(this.props.itemInfo);
    }

    /**
     * Generates the info box on the item card based on user configuration.
     * 
     * @param {Object} itemInfo Item Object from database.
     * @param {string} type ("small" | "large") determines which info is present on card.
     */
    generateItemInfo(itemInfo, type) {
        let li = [];
        let key = 0;
        let label;

        for (const prop in itemInfo) {
            if (type === "small" && termMap[prop].showOnSmallCard) {
                label = termMap[prop].shortLabel;
                li.push(<li className="p-r-1" key={key}>{label}: {itemInfo[prop]}</li>);
            } else if (type === "large" && termMap[prop].showOnLargeCard) {
                label = termMap[prop].fullLabel;
                li.push(<li className="p-r-1" key={key}>{label}: {itemInfo[prop]}</li>);
            }
            key++;
        }

        return li;
    }

    render() {
        const item = this.props.itemInfo;
        const list = this.generateItemInfo(item, this.props.type);
        const gridCols = (this.props.type === "small") ? "col-small" : "col-large";
        const flexSpace = (this.props.type === "small") ? "f-j-spacebetween" : "f-j-spacearound";

        return (
            <div className="w-100">
                <div id="itemCard" className={gridCols + " br-30 p-025 bg-lblue-hov bg-gray-a"} onClick={this.handleClick}>
                    <div id="photo" className="flex f-center">
                        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="item" />
                    </div>
                    <div id="itemName" className="p-l-025">
                        <h4>{item.name}</h4>
                    </div>
                    <div id="itemDetails" className="p-l-025">
                        <ul className={flexSpace + " h-100 flex f-across f-wrap f-ac-stretch"}>
                            {list}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}