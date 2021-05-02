# HALTWebClient

## setup react envirnoment (Done once per PC)
1.	$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
2.	$ sudo apt get update
3.	$ sudo apt install nodejs
4.	$ node --version
5.	$ npm --version
6.	$ npm install -g create-react-app

## Project build (Done per project basis)
1.	$ create-react-app react-complete-guide --scripts-version 1.1.5
2.	Add the folder within the "src" of the repo --> to the "src" of your react project
3.	Install all below mentioned libraries

## Libraries used
#### Bootstrap for react
1.	$ npm install --save react-bootstrap bootstrap

2. React Bootstrap doen't include the StyleSheets, It only includes the JavaScript parts. Therefore to get some default styles paste the below line in the index.html file just above the line  <title>React App</title>

```
<link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
  crossorigin="anonymous"
/>
```

#### react router

3. npm install --save react-router-dom

#### styled-components

4. npm install --save styled-components

#### Nested Select Libraries

5. npm install --save css-animation

6. npm install --save rc-menu

#### Recharts Graph Library

7. npm install --save recharts

#### Google fonts
You can any fonts of your choice from the below link:
```
https://fonts.google.com/
```
Here I have selected Roboto font

8. Paste the below line in the index.html file
```
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap" rel="stylesheet">
```
Open index.css file and replace the "font-family" present in the body with the below line.
```
font-family: 'Roboto', sans-serif;
```

9. Redux

npm install --save react-redux

10. influx

npm install --save influx

11. react-p5

npm i --save react-p5

12. Rete

npm i --save rete

npm i --save rete-react-render-plugin rete-connection-plugin rete-area-plugin 

Rete Library dependency. Paste the below lines in the  index.html file for Rete library to work.

```
<script src="https://cdn.jsdelivr.net/npm/rete@1.0.0-alpha.9/build/rete.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/rete-vue-render-plugin@0.2.0/build/vue-render-plugin.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/rete-connection-plugin@0.1.2/build/connection-plugin.min.js"></script>
```

13. react-qr-scanner

npm i --save react-qr-scanner

14. semantic-ui-react

npm i --save semantic-ui-react

14. React Alert

npm install --save react-alert

15. React DateTime

npm install --save react-datetime-picker

16. react-heatmap-grid

npm i --save react-heatmap-grid

17. Three JS (JavaScript 3D library)

npm i --save three




