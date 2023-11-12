#!/bin/bash

SRC=loopy-snippet.js
DEST=loopy-bookmarklet.js

echo "" >$DEST
echo "javascript:(function(){" >>$DEST

# use typescript compiler to strip out comments

tsc $SRC --allowJs --removeComments --outFile /dev/stdout | tr -d '\n' >>$DEST

echo "" >>$DEST
echo "})()" >>$DEST


