# EMS-Equipment-Integrity-Management-System
Emergency Medical Services Equipment Management System using React, Node, MySql, and MongoDB. Deployed with Docker.

## State of the Project
Shelved for now.

This project outgrew my original intentions and experienced scope creep without the necessary forethought. Adding features has become difficult due to an unclear vision at the start. Should I return to this project, it will undergo heavy refactoring and it will be redesigned in a way that allows growth.

## Intention
The original intention of this project was to gain experience with React. I planned only to do enough to satisfy my curiousity after using it on a few academic assignments.

## Idea Motivation
As the Chief of Drexel University Emergency Medical Services, I have seen how the Equipment Lieutenant manages the inventory. They use a large spreadsheet to track our over 100 inventory items. I felt that there could be a better, more customized solution to meet our needs. 

The long-term vision is for this application to be an all-in-one solution for equipment management. 

## Technologies Used
Node, Express.js - the API
React - the front end application
MySql - Relational Database
MongoDB - Document Database
Docker - Deployment

## How to Run
Using Docker Compose, the stack can be brought up by the command `docker-compose up`

On initial run, it takes a while to set up. The MySql database tends to take the longest due to loading the provided dump with test data. Before the database is ready, the API will send warning messages about being unable to connect. It will retry every 30 seconds until it is able to connect.

Once the API is ready (the API connects to both the MySql database and the MongoDB database), then the React App will be available on localhost:5000. The React App was tested in Chrome.