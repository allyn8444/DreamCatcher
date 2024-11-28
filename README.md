## How to use our project:

- clone this repository
```bash
   git clone https://github.com/allyn8444/
   ```
- Check the Schematic Diagram and Copy the Circuit Diagram. (For more info, check the [project documentation](https://docs.google.com/document/d/1W3UlDw9eblVcIKKHZNt2959oXTZyLfrAGaKOUJA_Q1o/edit?usp=sharing))
- Also check the this [Tinkercad Diagram](https://www.tinkercad.com/things/77Hawcx0KD3-copy-of-motion-and-temperature-sensor-project-ds2?sharecode=MX6qyf7J8CmovFul3lb2Niv0tt2J1S9G0pq7DLUpKgg) for testing.
- get Arduino IDE and upload `DreamCatcher.ino` file
- check the COM ports in your end
- create an `.env` file and put serial port value e.g. `SERIAL_PORT = COM5`
- run: `node .\app.js`
- then open: `http://localhost:3000`
- the web app should pop up after opening the localhost.

### Additional Needs:
To be able to receive **telegram notifications**, you need to have the DreamCatcher Bot API Token.

For more information about the API Token and other issues, email me at:
ledesmaallynralf@gmail.com 

ENJOY!






---


## For notfications:
Arduino Uno should be connected to a computer or laptop to make the real time communication and notifications to work

---

## Limitation:

The Arduino Uno should be connected to a computer or laptop.
It won't be able to communicate data (to our web app) without a serial connection unless we will add additional modules.


