class Logger {
  constructor(parent = document.body) {
    if (parent && parent.appendChild) {
      this.log_window = document.createElement("div");
      this.log_window.className = "log-window";
      this.log_window.innerHTML = "<textarea class='log-window__log' disabled>Logger initialised...</textarea><div class='log-window__close-button'>&#x2716;</div>";
      this.log_window_log = this.log_window.getElementsByClassName("log-window__log")[0];
      this.log_window_close_button = this.log_window.getElementsByClassName("log-window__close-button")[0];

      this.log_window_close_button.addEventListener("click", function() {
        this.parentNode.classList.toggle("is-closed")
      })

      parent.appendChild(this.log_window);

      return {
        log: this.log.bind(this)
      }
    } else {
      console.error(parent + " of type '" + (typeof parent) + "' is not a valid DOM node");
    }

    return false;
  }

  log(message) {
    var message_node = document.createTextNode("\n" + message);
    this.log_window_log.appendChild(message_node);
    this.log_window_log.scrollTop = this.log_window_log.scrollHeight;

    return true;
  }
}
