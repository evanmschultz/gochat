# Updated HTMX Refactoring Plan for GoChat

## Phase 1: HTMX Integration and Server-Side Preparation

1. Add HTMX library to the project

    - Include HTMX in the main HTML template

2. Modify existing Go handlers to support both JSON and HTML responses

    - Update `getChatHistory`, `getAllChatsForUser`, and `sendMessage` handlers
    - Create new HTML templates for partial updates (chat list, individual messages)

3. Implement new Go handlers for HTMX-specific endpoints

    - Add routes for partial HTML updates (e.g., new message, new chat)

4. Update the main HTML template to include initial HTMX attributes
    - Focus on the chat list and message list areas

## Phase 2: Frontend HTMX Implementation

1. Replace JavaScript-based AJAX calls with HTMX attributes

    - Update chat creation, message sending, and chat switching functionality

2. Implement progressive enhancement

    - Ensure basic functionality works without JavaScript
    - Use HTMX for enhanced interactivity

3. Retain necessary JavaScript for non-HTMX functions
    - Keep theme toggling and other UI-specific functionality

## Phase 3: Real-time Updates and WebSocket Integration

1. Evaluate WebSocket integration options with HTMX

    - Consider using Server-Sent Events (SSE) or HTMX's WebSocket extension

2. Implement server-side WebSocket or SSE handlers

    - Add new Go handlers for real-time events

3. Update frontend to handle real-time updates
    - Use HTMX attributes for WebSocket connections or SSE

## Phase 4: Authentication and Session Management

1. Implement proper user authentication

    - Replace hardcoded user ID with actual user sessions

2. Update HTMX requests to include necessary authentication information
    - Ensure all HTMX requests maintain user context

## Phase 5: Cleanup and Optimization

1. Refactor Go code to remove redundant JSON handling where possible
2. Optimize database queries for HTMX partial updates
3. Implement proper error handling and user feedback mechanisms
4. Ensure accessibility is maintained or improved

## Phase 6: Testing and Refinement

1. Implement unit tests for new and modified Go handlers
2. Conduct thorough integration testing of HTMX functionality
3. Perform cross-browser and device testing
4. Gather user feedback and make necessary refinements

## Phase 7: Documentation and Knowledge Transfer

1. Update API documentation to reflect new HTMX endpoints
2. Create developer guides for working with the HTMX-based system
3. Conduct team training sessions on HTMX and the new application structure
