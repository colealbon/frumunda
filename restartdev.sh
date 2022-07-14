# manual approach (once per coding sesh) to automate nx monorepo builds -> dist -> 
# netlify dev netlify deploy triggered by file save.

# open screen 1
#  cd ~/cafe-society
#  nx build news-train --watch --verbose --configuration=development
# open screen 2
#  cd ~/cafe-society
#  fswatch -o ./dist/apps/news-train | xargs -n1 -I{} ./restartdev.sh
 
echo restart
# killall node
BROWSER=none netlify dev &

