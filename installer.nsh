!include "MUI2.nsh"

; 安装界面配置
!define MUI_ABORTWARNING

; 欢迎页面
!insertmacro MUI_PAGE_WELCOME

; 开源协议页面
!insertmacro MUI_PAGE_LICENSE "D:\APP\github-repositores\Windows-Tools\asset\resources\LICENSE.txt"

; 安装目录选择页面
!insertmacro MUI_PAGE_DIRECTORY

; 安装进度页面
!insertmacro MUI_PAGE_INSTFILES

; 完成页面
!insertmacro MUI_PAGE_FINISH

; 卸载页面
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES