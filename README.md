# Connect Project
Welcome to our Discord clone project for App Academy! We recreated a web page where users can create their own private or public servers and channels where you can invite friends or strangers in order to trade messages with them in real time. This project was done by Sean Kwasnicki, Eli Suffridge, and WeiCheng Chen.

# Link to Live Site
https://connect-imdc.onrender.com/

# WikiLinks

# Technologies used to create this project. 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)



# Getting Started

To see Connect live, click on the live link above. To run Connect locally on your machine, follow these steps:

* Clone the repository:
  * `git clone https://github.com/Sean-Kwasnicki/Connect.git`

There is a demo user already created in the database.

* Navigate to the backend folder and install Python packages:
  * `pipenv install`
  * `pipenv shell`

* Create and seed the database with:
  * `flask db upgrade`
  * `flask seed all`

* Start the server:
  * `flask run`

* CD into the `react-app` folder and run:
  * `npm install`

* Start the app with:
  * `npm run build` (for websockets to work)

* Testing Websocket Functionality:
  * Open up the site in another browser (preferred) or a new tab, then check when messages are created/deleted.

