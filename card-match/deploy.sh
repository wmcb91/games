sed -i '.bak' "s/^.*$/  &/g" game.js

echo "(function(){" | cat - game.js > top-wrap.js
echo "})();" >> top-wrap.js

rm game.js
mv top-wrap.js game.js

npx babel game.js --out-file game.min.js
uglifyjs game.min.js -c -m -o game-uglifyjs.min.js

rm game.min.js
mv game-uglifyjs.min.js game.min.js

mv game.js.bak game.js