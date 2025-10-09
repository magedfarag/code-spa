// Console Error Monitor for StoreZ Testing
// This script will capture and log all console errors

const errors = [];

// Override console.error to capture errors
const originalError = console.error;
console.error = function(...args) {
    const errorInfo = {
        timestamp: new Date().toISOString(),
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
        stack: new Error().stack,
        url: window.location.href
    };
    
    errors.push(errorInfo);
    
    // Log to a visible element if it exists
    const errorDisplay = document.getElementById('error-monitor');
    if (errorDisplay) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color: red; font-family: monospace; font-size: 12px; border-bottom: 1px solid #ccc; padding: 5px;';
        errorDiv.innerHTML = `
            <strong>[${errorInfo.timestamp}]</strong><br>
            <span style="color: #d73a49;">${errorInfo.message}</span><br>
            <span style="color: #666; font-size: 11px;">URL: ${errorInfo.url}</span>
        `;
        errorDisplay.appendChild(errorDiv);
        errorDisplay.scrollTop = errorDisplay.scrollHeight;
    }
    
    // Still call original console.error
    originalError.apply(console, args);
};

// Capture unhandled errors
window.addEventListener('error', function(event) {
    const errorInfo = {
        timestamp: new Date().toISOString(),
        message: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error ? event.error.stack : 'No stack trace available',
        url: window.location.href,
        type: 'unhandled'
    };
    
    errors.push(errorInfo);
    console.error('Unhandled Error:', errorInfo.message);
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    const errorInfo = {
        timestamp: new Date().toISOString(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason && event.reason.stack ? event.reason.stack : 'No stack trace available',
        url: window.location.href,
        type: 'promise'
    };
    
    errors.push(errorInfo);
    console.error('Unhandled Promise Rejection:', errorInfo.message);
});

// Function to get all captured errors
window.getConsoleErrors = function() {
    return errors;
};

// Function to clear error log
window.clearConsoleErrors = function() {
    errors.length = 0;
    const errorDisplay = document.getElementById('error-monitor');
    if (errorDisplay) {
        errorDisplay.innerHTML = '<strong>Console Error Monitor - Cleared</strong>';
    }
};

// Function to export errors as JSON
window.exportConsoleErrors = function() {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `console-errors-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

// Add error monitor display to page
function addErrorMonitorDisplay() {
    if (document.getElementById('error-monitor')) return;
    
    const monitor = document.createElement('div');
    monitor.id = 'error-monitor';
    monitor.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        height: 300px;
        background: #f8f9fa;
        border: 2px solid #dc3545;
        border-radius: 5px;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    monitor.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
            <strong style="color: #dc3545;">🔍 Console Error Monitor</strong>
            <div>
                <button onclick="window.clearConsoleErrors()" style="font-size: 10px; margin-right: 5px;">Clear</button>
                <button onclick="window.exportConsoleErrors()" style="font-size: 10px; margin-right: 5px;">Export</button>
                <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="font-size: 10px;">Hide</button>
            </div>
        </div>
        <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
            Monitoring console errors in real-time...
        </div>
    `;
    
    document.body.appendChild(monitor);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addErrorMonitorDisplay);
} else {
    addErrorMonitorDisplay();
}

console.log('🔍 Console Error Monitor initialized! Use window.getConsoleErrors() to retrieve captured errors.');