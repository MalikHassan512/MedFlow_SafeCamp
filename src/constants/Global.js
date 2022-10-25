class Global {
  isObserverEnabled;
  currentScreen;
  isCallInprogress;
  isNewEventReceived;
  isLoggingOut;
  loginUser;
  constructor() {
    this.isObserverEnabled = false;
    this.currentScreen = '';
    this.isCallInprogress = false;
    this.isNewEventReceived = false;
    this.isLoggingOut = false;
    this.loginUser = null;
  }
}
export default new Global();
