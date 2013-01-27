del HardData.zip
7z a -tzip HardData.zip -r *.* -x!.* -x!*-* -x!bin -x!src -x!HDF_IOS_ANDROID -x!fuckwit -x!*~

..\..\net.rim.browser.tools.wcpc_1.5.1.201010291444-22\wcpc\bbwp.exe HardData.zip /g quarkquark

copy /Y bin\StandardInstall\HardData.cod "C:\Program Files\Research In Motion\BlackBerry Smartphone Simulators 6.0.0\6.0.0.294 (9780)"
