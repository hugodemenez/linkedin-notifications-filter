document.addEventListener('DOMContentLoaded', async () => {
    // Get notifications when popup opens
    await getLinkedInNotifications();
    
    // Set up automatic scraping every 5 seconds
    setInterval(getLinkedInNotifications, 5000);
});

async function getLinkedInNotifications() {
    try {
        // Query the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        console.log('Current tab:', tab);
        
        if (!tab.url.includes('linkedin.com')) {
            throw new Error('Not a LinkedIn page');
        }
        
        // Inject content script to get notifications
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapeNotifications
        });

        console.log('Scraping results:', results);
        
        if (results && results[0] && results[0].result) {
            displayNotifications(results[0].result);
        } else {
            throw new Error('No results from scraping');
        }
    } catch (error) {
        console.error('Error getting notifications:', error);
        document.getElementById('notifications-list').innerHTML = 
            `<p>Please open LinkedIn to see notifications</p><p>Error: ${error.message}</p>`;
    }
}

function scrapeNotifications() {
    // Try different selectors that LinkedIn might use for notifications
    const notificationElements = document.querySelectorAll([
        'div.notification-badge',           // Try notification badge class
        '.nt-segment',                      // Notification segment
        '.notification-list__item',         // Notification list items
        '.artdeco-list__item',             // LinkedIn's artdeco list items
        '.notification-item',               // Generic notification items
        '.feed-shared-notification-item'    // Feed notifications
    ].join(','));

    console.log('Found notification elements:', notificationElements.length);
    
    return Array.from(notificationElements).map(notification => {
        try {
            // Try to find the text content
            const textElement = notification.querySelector('.notification-text, .feed-shared-text, .notification-content');
            const text = textElement ? textElement.textContent.trim() : notification.textContent.trim();
            
            // Try to find the link
            const link = notification.closest('a')?.href || 
                        notification.querySelector('a')?.href || '';
                        
            // Try to find timestamp
            const timeElement = notification.querySelector('.notification-time, time');
            const timestamp = timeElement ? timeElement.textContent.trim() : '';

            console.log('Scraped notification:', { text, link, timestamp });
            
            return { text, link, timestamp };
        } catch (error) {
            console.error('Error processing notification:', error);
            return null;
        }
    }).filter(n => n !== null);
}

function displayNotifications(notifications) {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';

    if (notifications.length === 0) {
        notificationsList.innerHTML = '<p>No notifications found</p>';
        return;
    }

    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = 'notification-item';
        div.innerHTML = `<div>${notification.text}</div>`;
        
        if (notification.link) {
            div.addEventListener('click', () => {
                chrome.tabs.create({ url: notification.link });
            });
        }

        notificationsList.appendChild(div);
    });
}
