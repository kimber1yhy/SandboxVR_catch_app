This README provides a step-by-step guide on how to set up and run the web application. The frontend application uses ReactJS and TypeScript, and the backend uses Node.js, and the database uses PostgreSQL.

## Prerequisites

Before running the application, check that you have the following software installed:

1. Node.js (version 20 or above)
2. npm (Node Package Manager)
3. PostgreSQL

## Setup Steps

Follow these steps to set up and run the application:

1. Clone the repository:

```
git clone https://github.com/kimber1yhy/SandboxVR_catch_app.git
```

2. Navigate to the project directory:

```
cd <project-directory>
```

3. Install root dependencies:

```
npm install
```

4. Install backend dependencies:

```
cd backend
npm install
```

5. Set up the PostgreSQL database:

- Create a new PostgreSQL database for the application.

6. Set up .env file

- Create a `.env` file in the root directory.
- Set the following environment variables in the `.env` file:

```
  SERVER_PORT=<your-server-port>
  DB_HOST=<your-database-host>
  DB_PORT=<your-database-port>
  DB_DATABASE=<your-database-name>
  DB_USERNAME=<your-database-username>
  DB_PASSWORD=<your-database-password>
  REACT_APP_DB_HOST=<same-as-DB_HOST>
  REACT_APP_SERVER_PORT=<same-as-SERVER_PORT>
```

7. Start the application at root directory:

```
npm start
```

8. Access the application in your web browser at `http://localhost:3000`.

## Available Scripts

Root:

- `npm start`: Starts the frontend development, starts the backend server, runs the database migrations and runs the database seed.

## API Documentation

### 1. /api/list

- **HTTP Method**: GET
- **Function**: getTopPlayersData
- **Description**: This is used to get the top 100 players' data. When a GET request is made to the endpoint, the getTopPlayersData function will be called. It fetches the name and score of the top 100 players in descending order based on their scores. The result will be displayed in the leaderboard.
- **Request Parameters**: None
- **Response Format**: JSON
- **Response Structure**:

```json
[
 {
   "id": "31bfc737-c5c4-404e-8ed1-c23da9444cb0",
   "name": "Player 1",
   "score": 1000
 },
 {
   "id": "4735c551-8513-4279-83be-2b463a209052",
   "name": "Player 2",
   "score": 950
 },
 ...
]
```

### 2. /api/saveData

- **HTTP Method**: POST
- **Function**: savePlayerData
- **Description**: This is used to save a player's data. When a POST request is made to the endpoint, the savePlayerData function will be called. It stores the player's name and score received in the request payload. The id (primary key - UUID) of each record will be generated automatically. It will return the player id in the database after saving.
- **Request Parameters**:

```
name (string): The name of the player.
score (integer): The score achieved by the player.
```

- **Request Structure**:

```json
{
  "name": "Player Name",
  "score": 1000
}
```

- **Response Format**: JSON
- **Response Structure**:

```json
{
  "id": "31bfc737-c5c4-404e-8ed1-c23da9444cb0"
}
```

### 3. /api/getPlayerRank/:playerId

- **HTTP Method**: GET
- **Function**: getPlayerRank
- **Description**: This is used to get the current player's rank and the total number of players in the database. When a GET request is made to the endpoint, the getPlayerRank function will be called. It returns the rank of the player based on their score and the total number of players in the database.
- **Request Parameters**:

```
userId (string): The UUID of the player
```

- **Response Format**: JSON
- **Response Structure**:

```json
{
  "rank": 1,
  "totalRecords": 50
}
```

## Troubleshooting

If you cannot run the application successfully, please check the following:

- Make sure you have all the software from the prerequisites section installed.
- Double-check the .env file values are correct.
