Build on Windows (installateur .exe) :

npm run electron:build:win

Build on MacOS (.dmg) :

npm run electron:build:mac

codesign --force --deep --sign - /Applications/improvisation-be-app.app
xattr -rd com.apple.quarantine /Applications/improvisation-be-app.app

Check asar files :

npx asar list /Applications/improvisation-be-app.app/Contents/Resources/app.asar
