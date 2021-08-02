How I concatenated the svg-s:

`awk '(FNR==1){print "`,\n'\''" FILENAME "'\'': `"}1' */*.svg | sed "s,.svg','," | sed -e "s,^'\(.*\)/,'\1:,g" | tr -d '\n' > map_symbols.ts`

... then edited the file (beginning, end)
