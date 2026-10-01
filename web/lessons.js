import { WORDS } from './math.js';
import { ADD_ROUNDS } from './extra-math.js';
import { MORE_GAMES, MORE_NARRATION } from './more-lessons.js';
export const GAMES={
  count:{title:'Counting Garden',teacher:'pip',name:'Pip',skill:'Count 1–10'},
  snack:{title:'Snack Lab',teacher:'nori',name:'Nori',skill:'Make 10'},
  add:{title:'Addition Pond',teacher:'milo',name:'Milo',skill:'Add within 10',greeting:"Hi, I'm Milo! Let's put two groups of berries together. Watch me, or try it yourself!",watchIntro:'When we add, we put groups together. Watch Milo to see how.',prompt:'How many berries altogether? Touch the berries in both groups, then choose a number.',retry:"Let's count both groups again. Every berry belongs in our total!",hint:'Count all the berries once, across both groups. The last number is how many altogether.',finish:'Hooray! Five lovely sums. You can visit the town or play again!',demoStart:'Milo has two berries here, and three berries over here.',demoJoin:"Let's count the two groups together.",demoEnd:'Two plus three equals five. We have five berries altogether!'},
  compare:{title:'More or Less Market',teacher:'tilly',name:'Tilly',skill:'Compare groups',greeting:"Hello, I'm Tilly! Let's compare our berry baskets. We can find more, fewer, or the same amount!",watchIntro:'We can compare baskets by counting or matching berries. Watch Tilly to see how.',morePrompt:'Which basket has more berries? Count both baskets, then choose.',fewerPrompt:'Which basket has fewer berries? Count both baskets, then choose.',retry:"Let's look at both baskets again. Count the berries, or show a hint.",hint:'Match one berry from each basket. The basket with berries left over has more. The other basket has fewer.',finish:'Lovely comparing! Five baskets explored. You can visit the town or play again!',demoStart:'The left basket has three berries. The right basket has five berries.',demoPair:'Match one berry on the left with one berry on the right.',demoEnd:'Two berries are left over on the right. The right basket has more berries. The left has fewer.'},
  shape:{title:'Shape Studio',teacher:'ziggy',name:'Ziggy & Sunny',skill:'Explore shapes',greeting:"I'm Ziggy! Sunny and I love shapes. Let's look at circles, triangles, squares, and long rectangles!",watchIntro:'A shape keeps its name when it turns or changes colour. Watch Ziggy and Sunny to explore.',retry:"Let's look at the shape again. Notice the edges and corners, then try another picture.",finish:'Wonderful shape spotting! Five shapes explored. You can visit the town or play again!'}
};
export const SHAPE_INFO={
  circle:{label:'Circle',spoken:'a circle',prompt:'Find a circle. It has a round edge and no corners.',hint:'A circle has a round edge and no corners. Look for the round shape.',success:"Yes, a circle! A circle stays round when we turn it.",demo:'A circle has a round edge and no corners. It is round all the way around.'},
  triangle:{label:'Triangle',spoken:'a triangle',prompt:'Find a triangle. It has three straight sides and three corners.',hint:'Count three straight sides and three corners. That is a triangle.',success:'Yes, a triangle! Three straight sides and three corners.',demo:'A triangle has three straight sides and three corners. Count the corners with Ziggy.'},
  square:{label:'Square',spoken:'a square',prompt:'Find a square. It has four equal sides and four square corners.',hint:'A square has four equal sides and four square corners, even when it turns.',success:'Yes, a square! Four equal sides and four square corners.',demo:"I'm Sunny! A square has four equal sides and four square corners. It is still a square when it turns."},
  rectangle:{label:'Long rectangle',spoken:'a long rectangle',prompt:'Find a long rectangle. It has two long sides, two shorter sides, and four square corners.',hint:'Look for two long sides, two shorter sides, and four square corners. That is our long rectangle.',success:'Yes, our long rectangle! Two long sides, two shorter sides, and four square corners.',demo:'This long rectangle has two long sides and two shorter sides. Its four corners are square corners.'}
};
export const additionSuccess=(a,b)=>`Lovely! ${WORDS[a]} plus ${WORDS[b]} equals ${WORDS[a+b]}. That is our total!`;
export const countedBerries=n=>`${WORDS[n]} ${n===1?'berry':'berries'}!`;
export const basketCount=(side,n)=>`${WORDS[n]} ${n===1?'berry':'berries'} in the ${side} basket.`;
export const compareSuccess=(answer,ask)=>answer==='same'?'Yes! Both baskets have the same number of berries.':`Yes! The ${answer} basket has ${ask} berries.`;
Object.assign(GAMES,MORE_GAMES);
GAMES.add.emptyHint='Both groups are empty. Zero plus zero is zero. There are no berries to count.';
GAMES.compare.sameHint='Every berry has a partner. No berries are left over. Both baskets have the same amount.';
export const NEW_NARRATION=[...MORE_NARRATION];
const add=(character,text)=>NEW_NARRATION.push({character,text,speed:character==='milo'?1:.96});
for(const [view,game] of Object.entries(GAMES))if(['add','compare','shape'].includes(view)){
  for(const key of ['greeting','watchIntro','prompt','retry','hint','emptyHint','sameHint','finish','demoStart','demoJoin','demoPair','demoEnd','morePrompt','fewerPrompt'])if(game[key])add(game.teacher,game[key]);
  add(game.teacher,'We can take a little pause. Press Watch to start again.');
  add(game.teacher,"Now it's your turn! Press My turn to play.");
}
for(let n=1;n<=10;n++)add('milo',countedBerries(n));
for(const [a,b] of ADD_ROUNDS)add('milo',additionSuccess(a,b));
for(const side of ['left','right'])for(let n=0;n<=10;n++)add('tilly',basketCount(side,n));
for(const ask of ['more','fewer'])for(const answer of ['left','right','same'])add('tilly',compareSuccess(answer,ask));
for(const character of ['ziggy','sunny']){
  for(const info of Object.values(SHAPE_INFO))for(const key of ['prompt','hint','success'])add(character,info[key]);
  add(character,GAMES.shape.retry);add(character,GAMES.shape.finish);
}
for(const shape of ['circle','triangle'])add('ziggy',SHAPE_INFO[shape].demo);
for(const shape of ['square','rectangle'])add('sunny',SHAPE_INFO[shape].demo);
add('sunny',"Now it's your turn! Press My turn to play.");
add('sunny','We can take a little pause. Press Watch to start again.');
