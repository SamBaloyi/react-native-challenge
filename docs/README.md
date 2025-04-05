# react-native-challenge

Below is a sample **README.md** for an **experienced React Native** coding challenge. This challenge targets **3+ years** of professional React Native experience, with an emphasis on more advanced functionality (state management, offline support, testing, etc.). Feel free to adjust the content and difficulty based on your specific needs.

---

# React Native Coding Challenge

Welcome to our **Advanced React Native** coding challenge! We’ve designed this exercise for **senior-level React Native developers** with 3+ years of experience. This challenge will assess your ability to architect and implement complex features in a production-like environment, including:

- Advanced state management  
- Data persistence/offline support  
- Navigation and UI structure  
- Testing and code quality  

We value **clean code**, **scalability**, and **best practices**. You don’t need to polish every detail (e.g., pixel-perfect UI), but we’re looking for a thoughtfully structured solution that showcases how you’d approach a real-world scenario.

---

## Table of Contents

1. [Overview](#overview)  
2. [Core Requirements](#core-requirements)  
3. [Optional Enhancements](#optional-enhancements)  
4. [Project Setup](#project-setup)  
5. [Testing](#testing)  
6. [Submission](#submission)  
7. [Evaluation Criteria](#evaluation-criteria)  
8. [Time Estimate](#time-estimate)  
9. [Tips & Guidance](#tips--guidance)

---

## Overview

You will build a **multi-screen React Native** app that:

1. **Fetches** data from an API (or mock server).  
2. **Displays** the data in a list (with some advanced UI/UX elements like pull-to-refresh or pagination).  
3. **Allows** creating/updating/deleting of items (if time permits).  
4. **Persists** data locally for offline usage.  
5. **Includes** a robust state management setup (Redux, MobX, React Context + Hooks, or your preferred solution).  

**Goal**: Demonstrate how you structure, organize, and implement a mid-size React Native application with real-world concerns like navigation, data flow, testing, and offline capabilities.

---

## Core Requirements

1. **Data Source**  
   - Use either a real external API (e.g., [JSONPlaceholder](https://jsonplaceholder.typicode.com/)) or a local mock server (like [json-server](https://github.com/typicode/json-server)).  
   - The data can be anything—e.g., “Posts,” “Users,” or “Products.”  

2. **Multi-Screen Navigation**  
   - Implement at least **two screens** using a navigation solution such as [React Navigation](https://reactnavigation.org/).  
     - **Screen A**: Shows a list of items fetched from the API (with pagination or infinite scroll if desired).  
     - **Screen B**: Shows item details (e.g., a detail view or edit form).  

3. **Offline / Persistence**  
   - When the user has no internet, they should still see previously fetched data.  
   - You can use libraries like **Redux Persist**, **AsyncStorage**, or any other approach.  

4. **Advanced State Management**  
   - Use **Redux**, **MobX**, or **React Context + Hooks** in a scalable way.  
   - Structure your actions, reducers, or stores logically.  

5. **Create or Update an Item** (Optional but Recommended)  
   - Provide a form or UI that allows adding a new item or editing an existing one.  
   - Reflect changes both in local and remote data (if possible).  

6. **Error Handling**  
   - Show a user-friendly message if data fails to load or if the network request fails.  

7. **UI/UX**  
   - Don’t worry about perfect design, but ensure your screens are clear, consistent, and user-friendly.  

---

## Optional Enhancements

Feel free to add any of the following **if time permits** and you want to showcase more advanced skills:

1. **Testing**  
   - Write unit or integration tests using **React Native Testing Library**, **Jest**, or **Enzyme**.  

2. **Animations**  
   - Use React Native’s animation APIs (e.g., `Animated`) for transitions or user interaction.  

3. **Push Notifications** or **Deep Linking**  
   - Showcase advanced RN features.  

4. **Profile & Optimize**  
   - Identify any performance bottlenecks.  
   - Use techniques like memoization or lazy-loading.  

---

## Project Setup

1. **Folder Structure**  
   - You can put everything under a single `react-native-advanced` folder in the repo.  
   - Example structure:
     ```
     react-native-advanced/
       ├── src/
       │   ├── components/
       │   ├── screens/
       │   ├── store/ (if using Redux or MobX)
       │   ├── services/ (API calls)
       │   └── ...
       ├── App.js
       ├── package.json
       └── ...
     ```
2. **Dependencies**  
   - Use your preferred package manager (npm or yarn).  
   - The following libraries are recommended (but not mandatory if you have a different preference):  
     - React Navigation (for multi-screen flow)  
     - Redux or Context + Hooks (for state management)  
     - Redux Persist or AsyncStorage (for offline)  

3. **Running Your App**  
   - Include instructions in a local README or in your PR description (e.g., `npm install` then `npx react-native run-ios` / `run-android` or `npx expo start`).  

4. **Mock Server (Optional)**  
   - If you prefer to avoid external APIs, set up [json-server](https://github.com/typicode/json-server) locally.  
   - Provide instructions to start it (e.g., `npm run mock-server`).  

---

## Testing

1. **Minimum**: Demonstrate basic coverage of your core logic (API calls, offline functionality, etc.).  
2. **React Native Testing Library**: Recommended for component testing.  
3. **Jest**: Can be used for unit testing your utilities, reducers, or other logic.

> **Tip**: Even just a few tests can demonstrate your knowledge of testing best practices.

---

## Submission

1. **Fork** this repository and clone to your local machine.  
2. **Create a new branch** (e.g., `feature/advanced-rn-challenge`).  
3. **Implement** the requirements in the `react-native-advanced` folder.  
4. **Commit & Push** your code frequently with clear commit messages.  
5. **Open a Pull Request** (PR) into the main branch of this repo.  
6. **Include** in your PR description:
   - How to run the app (installation, commands, etc.).  
   - Any assumptions or trade-offs you made.  
   - Any known issues or areas you’d like to improve if given more time.  

---

## Evaluation Criteria

1. **Project & Code Structure**  
   - Is the app organized into logical folders (components, screens, store, etc.)?  
   - Are naming conventions and file organization clear?

2. **Advanced State Management**  
   - Are you using Redux, MobX, or Context effectively?  
   - Is data flow easy to follow?

3. **Offline & Persistence**  
   - Does the app handle offline scenarios gracefully?  
   - Is there a clear approach to caching or persisting data?

4. **Data Fetching & Error Handling**  
   - Are API calls abstracted or well-organized?  
   - Do you handle errors (e.g., network failures, invalid data) properly?

5. **User Experience**  
   - Is navigation straightforward, and do screens render quickly?  
   - Is the list easily scrollable or paginated?

6. **Testing**  
   - Do you cover critical logic or major components with unit/integration tests?  
   - Are tests meaningful and passing?

7. **Overall Code Quality**  
   - Readability, maintainability, and adherence to best practices.  
   - Clean code, minimal repetition, and appropriate use of React Native/JS features.

---

## Time Estimate

- This is a more **in-depth** challenge. We recommend spending **2-4 hours** on it, depending on your familiarity with the libraries.
- If you have limited time, focus on **core features** (API fetch, offline, navigation, basic state management).

---

## Tips & Guidance

- **Prioritize**: Implement core functionality well rather than trying to include every fancy feature.  
- **Document**: If you skip something or have a partial implementation, explain how you’d solve it or what you’d do with more time.  
- **Keep it Real**: Show how you code in a real-world scenario—commit often, structure logically, handle errors gracefully.  
- **Ask Questions**: If you feel any requirement is ambiguous, note your assumptions in the PR description.

---

**Thank you for taking the time to complete this challenge.** We look forward to reviewing your submission and discussing it during the interview. Good luck!
