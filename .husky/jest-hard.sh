rm -r -f coverage

filelist=$(git diff --cached --name-only --diff-filter=d | grep -E '.(jsx|tsx|jsx|tsx|vue)$')

if [ `echo $filelist | wc -w` -lt 1 ]; then
    echo -e "You have no staged .js or .vue files to test\n"
    exit
fi
for filename in $filelist; 
do
  nx test --all --codeCoverage --skip-nx-cache --jestConfig=./jest-hard.config.ts --findRelatedTests=${filename}
done;