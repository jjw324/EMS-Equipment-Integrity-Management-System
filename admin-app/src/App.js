import React, { Component } from 'react';
import './App.css';
import DashAlert from './components/DashAlert';
import InventoryManager from './components/InventoryManager';
import axios from 'axios';
import EditOverlay from './components/EditOverlay';
import CreateOverlay from './components/CreateOverlay';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      inv: [],
      itemNames: [],
      warnings: [],
      cautions: [],
      currentEdit: {},
      currentItem: {},
      showEditModal: false,
      showCreateModal: false,
      loading: true
    };

    this.setOverlay = this.setOverlay.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleGetTruckCheck = this.handleGetTruckCheck.bind(this);

  }
  /**
   * Load application with API data
   */
  async componentDidMount() {
    const allItems = await this.getAllItems();
    const inventoryChecks = await this.checkInventory();

    this.setState({
      warnings: inventoryChecks.warnings,
      cautions: inventoryChecks.cautions,
      inv: allItems,
      loading: false
    });

  }

  /**
   * Returns an object containing 2 lists of items that meet caution and warning criteria.
   * 
   * Warnings: Items where stock is 1 or 0, items that have expired, or items that will expire within a month.
   * Cautions: Items where the stock is below the set threshold for that item or items that will expire within 3 months.
   * 
   * @returns {Object} warnings: List of warnings, cautions: List of caution items
   */
  async checkInventory() {
    let officeCheck, storageCheck, expired, expiringWithinThreeMonths, expiringWithinOneMonth;

    try {
      // replace with an await promise.all
      officeCheck = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/office`)).data.results;
      storageCheck = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/storage`)).data.results;
      expired = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/expiration?expired=true`)).data.results;
      expiringWithinThreeMonths = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/expiration?from=1&until=3`)).data.results;
      expiringWithinOneMonth = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/expiration?until=1`)).data.results;
    } catch (err) {
      console.log(err);
      window.alert("Unable to make database call. See Console for more info. Reload page to try again.");
      return;
    }

    // Avoid duplicates (where there is a caution condition in both the office and the storage)
    let cautions = officeCheck.low.concat(storageCheck.low);
    let cautionIds = cautions.map(o => o.id);
    cautions = cautions.filter(({ id }, index) => !cautionIds.includes(id, index + 1));
    cautions = cautions.concat(expiringWithinThreeMonths);

    let warnings = officeCheck.out.concat(storageCheck.out);
    let warningIds = warnings.map(o => o.id);
    warnings = warnings.filter(({ id }, index) => !warningIds.includes(id, index + 1));
    warnings = warnings.concat(expiringWithinOneMonth, expired);

    return {
      warnings: warnings,
      cautions: cautions
    };
  }

  /**
   * Returns an array of all items listed in the database.
   * 
   * @returns {Object[]} All items in database.
   */
  async getAllItems() {
    let allItems;
    try {
      allItems = (await axios.get(`http://${process.env.REACT_APP_API_URL}/check/allitems`)).data.results;
    } catch (err) {
      console.log("Unable to make database call. See Console for more info. Please reload to try again.");
      return;
    }

    return allItems.ordinary_items.concat(allItems.special_items);
  }

  /**
   * Opens a modal window to create or edit an item.
   * 
   * @param {Object} [item] The item being edited. 
   */
  setOverlay(item) {
    if (item) {
      this.setState({
        currentEdit: { ...item },
        currentItem: { ...item },
        showEditModal: true
      });
    } else {
      this.setState({ showCreateModal: true });
    }
  }

  /**
   * Close the currently-open modal window.
   * 
   * @param {string} objName The name of the object calling the function. Should be `this.constructor.name` in most instances.
   */
  handleModalClose(objName) {
    let modalName;

    if (objName === "EditOverlay") modalName = "showEditModal";
    else if (objName === "CreateOverlay") modalName = "showCreateModal";
    else throw new Error("Unrecognized Modal");

    this.setState({
      currentEdit: {},
      [modalName]: false
    });

    this.componentDidMount() // TODO: update only the item affected
  }

  /**
   * Updates state with user input. Clears object if no event is passed.
   * 
   * @param {Object} event HTML event from form change.
   */
  handleItemChange(event) {
    if (!event) {
      this.setState({ currentEdit: {} });
      return;
    }
    let newObj = this.state.currentEdit;
    newObj[event.target.id] = event.target.value
    this.setState({ currentEdit: newObj });
  }

  handleExpand(event) {
    // code for expanding the Report Library
  }

  render() {
    if (this.state.loading) {
      return <h1>LOADING...</h1>; // TODO: Replace with animation or something nicer
    }

    return (
      <>
        <EditOverlay editingItem={this.state.currentEdit} show={this.state.showEditModal} handleClose={this.handleModalClose} handleFormChange={this.handleItemChange} readOnlyItem={this.state.currentItem} />
        <CreateOverlay editingItem={this.state.currentEdit} show={this.state.showCreateModal} handleClose={this.handleModalClose} handleFormChange={this.handleItemChange} />
        <div id="app">
          <div className="bg-dblue flex f-j-spacearound" id="title">
            <button className="fas fa-lg fa-bars show-tablet w-5 bg-none b-none" />
            <h1>EMS Equiment Integrity Management System</h1>
            <button className="cw fas fa-lg fa-bars show-tablet w-5 b-none" />
          </div>
          <div id="reportlib" className="bg-lblue" onClick={this.handleExpand}>
            <div className="flex f-j-spacebetween padding-mobile">
              <button className="fas fa-lg fa-chevron-down show-mobile w-5 bg-none b-none p-l-1" />
              <h2 className="f-grow">Report Library</h2>
              <button className="fas fa-lg fa-chevron-down show-mobile w-5 bg-none b-none p-r-1 cw" />
            </div>
          </div>
          <div id="inv" className="scroll-y">
            <h2>Inventory Manager</h2>
            <InventoryManager itemNames={this.state.itemNames} inv={this.state.inv} overlay={this.setOverlay} />
          </div>
          <div id="warning" className="bg-red scroll-y">
            <DashAlert title="Warning" items={this.state.warnings} overlay={this.setOverlay} />
          </div>
          <div id="caution" className="bg-yellow scroll-y">
            <DashAlert title="Caution" items={this.state.cautions} overlay={this.setOverlay} />
          </div>
          <div id="footer" className="bg-gray center-vh text-center">
            <p className="text-white text-bold">Jacob Williamson, Drexel University, 2020-21. &nbsp;
            <a className="text-white" href="https://github.com/jjw324">GitHub.</a> &nbsp;
            <a className="text-white" href="https://www.linkedin.com/in/jjw324">LinkedIn.</a>
            </p>
          </div>
        </div>
      </>
    );
  }
}