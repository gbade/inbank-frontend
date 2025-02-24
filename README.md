# Purchase Approval Frontend

This is a Vue.js frontend application for handling purchase approvals. 

## Project Overview

This application provides a form interface where users can:
- Enter their Personal ID 
- Specify a purchase amount 
- Set a payment period (between 12 and 60 months)
- Submit the form for approval
- View the approval result

## Technologies Used

- Vue 3
- TypeScript
- Vuex for state management
- Jest for testing
- Tailwind CSS for styling

## Project Structure

```
purchase-approval-frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable Vue components
│   ├── store/           # Vuex store modules
│   ├── views/           # Page components
│   ├── tests/           # Test files
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Public static assets
└── package.json         # Project dependencies and scripts
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd purchase-approval-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

To run the application in development mode:
```bash
npm run serve
```

The application will be available at `http://localhost:8081`

To build for production:
```bash
npm run build
```

## Running Tests

To run the test suite:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

## Key Features

- Form validation for all input fields
- Real-time error messaging
- Integration with backend API for purchase approval
- Responsive design
- Loading states during API calls
- Error handling and success messaging

## Components

- `PurchaseApproval.vue`: Main form component
- `FormInput.vue`: Reusable form input component
- `ApprovalResult.vue`: Component for displaying approval results

## Store Structure

The Vuex store manages:
- Form state
- API communication
- Error handling
- Loading states
