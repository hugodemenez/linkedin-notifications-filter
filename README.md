# LinkedIn Notification Filter

This Chrome extension helps users filter and manage LinkedIn notifications by allowing customization of which notification types appear in their feed. It integrates with LinkedIn's notification system to provide a cleaner, more focused notification experience.

## Overview

This extension adds notification filtering capabilities to LinkedIn by:
- Allowing users to select which types of notifications they want to see
- Providing options to filter out specific notification categories
- Maintaining a clean notification feed based on user preferences
- Saving filter settings locally for persistent customization

## Implementation Notes

The extension uses:
- Chrome Extension Manifest V3
- Content Scripts for LinkedIn notification page integration
- Chrome Storage API for saving user preferences
- DOM manipulation for filtering notification elements

## Running this extension

1. Clone this repository.
2. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Navigate to LinkedIn and open your notifications page
4. Click the extension icon in your browser toolbar to configure notification filters
5. Your notification feed will automatically update based on your filter settings
