#!/bin/bash

SRC=loopy-snippet.js
DEST=loopy-bookmarklet.js

echo "" >$DEST
echo "javascript:(function(){" >>$DEST
# exclude comments which arent allowed in bookmarklets
# IMPORTANT NOTE: therefore, it is important that comments in the source reside only on their own line
grep -v "//" $SRC >>$DEST
echo "" >>$DEST
echo "})()" >>$DEST


