Install:

npm install

===============================
For runnning development:

npm start

===============================

For making production:

npm run build

then new files can be generate in the "build" folder.

also don't forget delete *.map files from static/js and static/css when production version was ready. 



=================


for running backend, just with terminal, navigate to backend folder and enter "node index"

for making production version of backend, just run "minify.bat" file or enter node minify, then a new file can be generate "index.min.js", you can use for production version.


also in the config.js file, make sure about "development" variable, if you want to modify in your system, always set to true, also in frontend, you can see developer variable in the Helper.js file.