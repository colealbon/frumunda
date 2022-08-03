# manual approach (once per coding sesh) to automate nx monorepo builds -> dist -> 
# netlify dev netlify deploy triggered by file save.

# open screen 1
#  cd ~/albondigas
#  nx build cafe-society.news --watch --verbose --configuration=development
# open screen 2
#  cd ~/albondigas
#  ./restartdev.sh; fswatch -o ./dist/apps/cafe-society.news | xargs -n1 -I{} ./restartdev.sh
 
echo restart
# killall node
BROWSER=none netlify dev &

