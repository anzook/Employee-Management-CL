# Employee-Management-CL
### A simple CLI application to manage company roll

This application is a basic MySQL study in CRUD actions. 

# Design Notes

The application design is anything but DRY as-is, but is laid out in such a way that VIEW/ADD/UPDATE/DELETE actions are grouped as such. This was more an exercise for the developer to work within those individual action sets. 

There are also some Easter-eggs in asynchronous function handling through homemade middleware and default array function exercise overwrites.

## Viewing and using the website
Follow the link to the deployed application above, or 

Download the repo:

Install the node dependencies:
`npm instal`
* inquirer _for handling CLI interface_
* console.table _for handling easy table prints_
* mysql _for handling databse interface_

 and then initalize the server by running:
`node cli.js`

<!-- Here is an example of the front end:
![Mainpage Screenshot Demo](/public/assets/images/Duly_noted_ex.png) -->


All website assets are contained within the repo (https://github.com/anzook/Employee-Management-CL)


## Acknowledgements and Credits

Website created as an assignment for the Johns Hopkins full-stack web development bootcamp (in partnership with Trilogy Education Services).
Guidance and assistance provided by:
* Stetson Lewis (Instructor)
* Donald Hesler (TA)
* Dan Thareja (Inspiration)