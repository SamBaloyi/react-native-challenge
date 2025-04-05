# React Native Coding Challenge

## Project Overview
This repository contains my solution to the advanced React Native coding challenge. The application demonstrates my approach to building a production-ready React Native app with key features such as:

- Advanced state management with Redux Toolkit
- Data persistence and offline support
- Multi-screen navigation
- Clean architecture and code organisation
- Error handling
- Testing

## Features Implemented

### Core Features
- **Data Fetching**: Integration with a RESTful API to fetch and display data
- **Multi-Screen Navigation**: Implementation of a clean navigation flow using React Navigation
- **State Management**: Comprehensive Redux setup with proper action/reducer architecture
- **Offline Support**: Local data persistence for offline usage
- **Error Handling**: User-friendly error states and network error handling
- **CRUD Operations**: Ability to view, add, and manage items

### Additional Enhancements
- Pull-to-refresh functionality
- Loading states and indicators
- Clean, responsive UI
- Form validation

## Technical Stack
- **React Native**: Core framework
- **Redux Toolkit**: For state management
- **Expo Router**: For screen navigation
- **AsyncStorage**: For local data persistence
- **Axios**: For API requests
- **Jest & React Native Testing Library**: For testing

## Project Structure
```
src/
├── components/        # Reusable UI components
├── screens/           # Screen components
├── navigation/        # Navigation configuration
├── store/             # Redux store, slices, and actions
│   ├── hooks/        # Redux hooks
│   ├── slices/        # Redux toolkit slices
│   └── index.js       # Store configuration
├── services/          # API and data services
├── utils/             # Helper functions
├── hooks/             # Custom React hooks
└── constants/         # App constants
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native development environment

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SamBaloyi/react-native-challenge.git
   cd react-native-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on Android or iOS:
   ```bash
   # For Android
   npm run android
   # or
   yarn android

   # For iOS
   npm run ios
   # or
   yarn ios
   ```

## Application Flow
1. **Home Screen**: Displays a list of items fetched from the API
2. **Detail Screen**: Shows detailed information about a selected item
3. **Add/Edit Screen**: Allows creating new items or editing existing ones

## Implementation Details

### State Management
The application uses Redux Toolkit for state management, with a clean separation of concerns:
- **Slices**: Modular state management for different features
- **Thunks**: Handling asynchronous operations
- **Selectors**: Efficient data access patterns

### Offline Support
- Data is persisted locally using AsyncStorage
- Redux state is configured to persist between app launches
- The app gracefully handles offline scenarios by serving cached data

### Error Handling
- User-friendly error messages for network failures
- Form validation with clear error indicators
- Graceful degradation when services are unavailable

### Testing
The application includes unit and integration tests for key components and business logic using Jest and React Native Testing Library.

To run tests:
```bash
npm test
# or
yarn test
```

## Assumptions and Design Decisions
- Prioritised a clean, maintainable architecture over excessive feature implementation
- Used Redux Toolkit to reduce boilerplate and improve developer experience
- Focused on core user experience and error handling for a production-ready feel
- Implemented data persistence early in the development process to ensure offline capability

## Areas for Future Improvement
With additional time, I would enhance the application with:
- More comprehensive test coverage
- Animations and transitions for a more polished UX (Reanimated)
- Advanced caching strategies for improved offline experience
- Performance optimisations for large datasets
- Accessibility improvements
- User authentication system
- Social features to share posts
- Push notifications for post updates
- Advanced filtering and sorting options

## License
This project is licensed under the MIT License.

## Author
Sam Baloyi