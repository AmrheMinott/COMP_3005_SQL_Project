# COMP_3005_SQL_Project
This project was assigned to be completed testing our understanding of the following concepts in SQL database
management

  E-R Diagrams
  Designing a Database
  Functional Dependencies
  Client side - Server side interaction with the database
  Query Creation based on given input

this project is a database where we query the Postgres sql database for a bookstore for the academic year.

This project makes use of the following programming languages
  Node.js
  Javascript
  HTML

The database used is Postgres and queries are made on the server file to be executed on the database





How to Run Project in Four (4) Steps

    Step 1: open terminal or command line
    Step 2: navigate to folder with server.js
    Step 3: execute in terminal "node server.js"
    Step 4: open browser and type http://localhost:3000/


Documents to find in Project

Main Directory

  This is the main file you are going to download from my Github account

    index.html - main entry point to project when server is run from the terminal and calling http://localhost:3000/

    book_store.js - this .js file that handles functionality of index.html

    server.js - this .js main server file that acts as a middle man between the Postgres server and client

    package-lock.json - node.js links to the needed dependencies for running the program overall

    package.json - this file is Node.js way of presenting my work as the owner and creator of the project to you the user along with the needed dependencies


    node_modules (folder)
      here is where you can find all the needed modules to run the project using the node.js aspect of the project

    pages (folder)
      here is where you can find all the HTML pages along with there accompanying Javascript (.js) logic handling files
        add_Book.html
        add_Book.js
        boss.html
        boss.js
        buying.html
        buying.js
        sign_in.html
        sign_in.js
        sign_up.html
        sign_up.js

    ScreenShots (folder)
      This folder holds images of the application actually functioning with images showing all the basic process such as adding and removing to/from the database

    Database_Designs (folder)
      this folder has a pdf of Functional Dependencies, E-R diagrams, Database Schema and Steps involved in process creating diagrams

    Text_Files (folder)
      DDL_for_BookStore_Constriants.txt - this text file has all the need code to create the tables needed to create database on the pg4Admin

      template_Insertions_Values - this test file has template values that can be inserted to the pg4Admin/sql server for testing  











END OF README.md
