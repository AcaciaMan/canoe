// add javascript code to listen for the pressing of the 't' and 'g' key and for how long it is pressed
// and send a message to the server with the time it was pressed
// and the key that was pressed
// and the time it was released
// and the key that was released

document.addEventListener("DOMContentLoaded", () => {
  const keys = ["t", "g"];
  const keyPressTimes = {};

  document.addEventListener("keydown", (event) => {
    if (keys.includes(event.key) && !keyPressTimes[event.key]) {
      const pressedAt = Date.now();
      const key = event.key;

      keyPressTimes[event.key] = pressedAt;

      const message = {
        event: "keydown",
        key,
        pressedAt,
      };

      // Send the message to the server
      fetch("/api/key-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
    }
  });

  document.addEventListener("keyup", (event) => {
    if (keys.includes(event.key) && keyPressTimes[event.key]) {
      const releasedAt = Date.now();
      const pressedAt = keyPressTimes[event.key];
      const key = event.key;

      const message = {
        event: "keyup",
        key,
        pressedAt,
        releasedAt,
      };

      // Send the message to the server
      fetch("/api/key-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));

      // Clear the key press time
      delete keyPressTimes[event.key];
    }
  });
});
