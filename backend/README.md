# Gym Management System Backend

This is a simple Node.js backend for the Gym Management System. It uses a JSON file as a database for storing and retrieving data.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

\`\`\`bash
npm install
\`\`\`

### Running the Server

To start the server in development mode:

\`\`\`bash
npm run dev
\`\`\`

To start the server in production mode:

\`\`\`bash
npm start
\`\`\`

The server will run on port 5000 by default. You can change this by setting the PORT environment variable.

## API Endpoints

### Members

- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Trainers

- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Messages

- `GET /api/messages` - Get all messages
- `GET /api/messages/category/:category` - Get messages by category
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Create new message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

### Settings

- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings

### Analytics

- `GET /api/analytics` - Get all analytics
- `GET /api/analytics/:category` - Get specific analytics category

## Database Structure

The database is stored in a JSON file (`database.json`) with the following structure:

- `members` - Array of member objects
- `classes` - Array of class objects
- `trainers` - Array of trainer objects
- `messages` - Array of message objects
- `settings` - Object containing gym settings
- `analytics` - Object containing analytics data

## Error Handling

All API endpoints include error handling and will return appropriate HTTP status codes and error messages if something goes wrong.
\`\`\`
