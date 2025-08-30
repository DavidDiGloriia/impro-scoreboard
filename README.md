Install on Windows : 

npm run electron:build
npx electron-builder --windows

Install on MacOS :

ng build --configuration production
npx electron-builder --config electron-builder.json


Check asar files

npx asar list /Applications/angular-electron.app/Contents/Resources/app.asar
