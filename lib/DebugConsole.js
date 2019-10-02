class DebugConsole {
    /**
     * Server Log
     * 
     * Function to Enable Server Logs
     * 
     * @param {String} message 
     */
    static ServerLog(message) {
        console.log(`SERVER > ${message}`);
    }
}
module.exports = DebugConsole;
