# Time Tracker Application

This is frontend of time tracker application

https://drive.google.com/file/d/1pu7KD_utpLHTp9tXAr8_eSy1g6oYhthx/view

# Steps to Run

1.  Clone the Repo from url https://github.com/anchal-simform/time_tracker_frontend

```bash

git clone https://github.com/anchal-simform/time_tracker_frontend

```

2.  Change into the project directory and follow below commands

Prerequisites: Setup and start the backend server first https://github.com/anchal-simform/time_tracker_server

3.  Run npm install command

```bash
npm run install

```

Before running the npm start make sure you create the .env file in project root directory and paste content from .env.example file and update
the Base url of backend server

```javascript

Login Creds :-

Admin creds :-

email: admin@yopmail.com
password: admin

User creds:

email: mark@yopmail.com
password: mark

email: johndoe@yopmail.com
password: johndoe

email: maryjane@yopmail.com
password: maryjane

email: peter@yopmail.com
password: peter


```

sample env

```env
REACT_APP_BASE_URL="http://localhost:4090"

```

4. Run project using npm run start

```bash

npm run start

```

5.  The project will run on localhost:3000, Go to http://localhost:3000 on your browser

Video Demo : https://drive.google.com/file/d/1hxRq5Vqb_2h0fWf5qzCiah8KdiEoY61o/view?usp=sharing

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
