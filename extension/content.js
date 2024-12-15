// Create and inject the sidebar
function createSidebar() {
    // Create toggle button first
    const toggleButton = document.createElement('div');
    toggleButton.id = 'sidebar-toggle';
    toggleButton.innerHTML = '◀';
    toggleButton.title = 'Toggle Sidebar';
    
    const sidebar = document.createElement('div');
    sidebar.id = 'linkedin-notifications-sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <h2>LinkedIn Notifications</h2>
            <button id="start-analysis">Start Analysis</button>
        </div>
        <div id="notifications-list"></div>
    `;
    
    document.body.appendChild(toggleButton);
    document.body.appendChild(sidebar);

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        #linkedin-notifications-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            width: 350px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            z-index: 9999;
            padding: 10px;
            box-sizing: border-box;
            overflow: hidden;
            font-family: Arial, sans-serif;
            transition: transform 0.3s ease;
        }

        #linkedin-notifications-sidebar.hidden {
            transform: translateX(100%);
        }

        #sidebar-toggle {
            position: fixed;
            right: 360px;
            top: 50%;
            transform: translateY(-50%);
            background: #0a66c2;
            color: white;
            width: 20px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px 0 0 4px;
            z-index: 10000;
            transition: right 0.3s ease;
            font-size: 12px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }

        #sidebar-toggle.hidden {
            right: 10px;
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .sidebar-header h2 {
            margin: 0;
            font-size: 16px;
        }

        #start-analysis {
            background-color: #0a66c2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        #notifications-list {
            height: calc(100vh - 60px);
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 5px;
        }

        .notification-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }

        .notification-item:hover {
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(styles);

    // Add click handler for the toggle button
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        toggleButton.classList.toggle('hidden');
        toggleButton.innerHTML = sidebar.classList.contains('hidden') ? '▶' : '◀';
    });

    // Add click handler for the analysis button
    const startButton = sidebar.querySelector('#start-analysis');
    let analysisInterval;
    
    startButton.addEventListener('click', () => {
        if (analysisInterval) {
            // Stop analysis
            clearInterval(analysisInterval);
            analysisInterval = null;
            startButton.textContent = 'Start Analysis';
        } else {
            // Start analysis
            scrapeAndDisplayNotifications();
            analysisInterval = setInterval(scrapeAndDisplayNotifications, 5000);
            startButton.textContent = 'Stop Analysis';
        }
    });
}

function scrapeAndDisplayNotifications() {
    const notificationElements = document.querySelectorAll([
        'div.notification-badge',
        '.nt-segment',
        '.notification-list__item',
        '.artdeco-list__item',
        '.notification-item',
        '.feed-shared-notification-item'
    ].join(','));

    const notifications = Array.from(notificationElements).map(notification => {
        try {
            const textElement = notification.querySelector('.notification-text, .feed-shared-text, .notification-content');
            const text = textElement ? textElement.textContent.trim() : notification.textContent.trim();
            const link = notification.closest('a')?.href || notification.querySelector('a')?.href || '';
            const timeElement = notification.querySelector('.notification-time, time');
            const timestamp = timeElement ? timeElement.textContent.trim() : '';

            return { text, link, timestamp };
        } catch (error) {
            console.error('Error processing notification:', error);
            return null;
        }
    }).filter(n => n !== null);

    displayNotifications(notifications);
}

function displayNotifications(notifications) {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;

    notificationsList.innerHTML = notifications.length === 0 
        ? '<p>No notifications found</p>' 
        : notifications.map(notification => `
            <div class="notification-item" ${notification.link ? `data-link="${notification.link}"` : ''}>
                <div>${notification.text}</div>
            </div>
        `).join('');

    // Add click handlers
    notificationsList.querySelectorAll('.notification-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            window.open(item.dataset.link, '_blank');
        });
    });
}

// Initialize the sidebar
createSidebar();

// Add click handlers for notification items
document.addEventListener('click', (e) => {
    const notificationItem = e.target.closest('.notification-item[data-link]');
    if (notificationItem) {
        window.open(notificationItem.dataset.link, '_blank');
    }
}); 