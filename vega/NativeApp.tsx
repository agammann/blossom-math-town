import React from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';

type Round = {
  prompt: string;
  picture: string;
  choices: [string, string, string];
  answer: string;
  explanation: string;
};
type Game = {
  title: string;
  skill: string;
  teacher: string;
  intro: string;
  art: number;
  rounds: Round[];
};

const art = [
  require('./assets/pip.webp'),
  require('./assets/nori.webp'),
  require('./assets/milo.webp'),
  require('./assets/tilly.webp'),
  require('./assets/ziggy.webp'),
  require('./assets/otto.webp'),
  require('./assets/poppy.webp'),
  require('./assets/luna.webp'),
  require('./assets/sunny.webp'),
];

const q = (prompt: string, picture: string, choices: [string, string, string], answer: string, explanation: string): Round =>
  ({prompt, picture, choices, answer, explanation});

const games: Game[] = [
  {
    title: 'Counting Garden', skill: 'Count 1–10', teacher: 'Pip', art: 0,
    intro: 'Point to each berry as you count. Every berry gets one number.',
    rounds: [
      q('How many berries?', '●  ●  ●', ['2', '3', '4'], '3', 'There are three berries.'),
      q('How many berries?', '●  ●  ●  ●  ●', ['4', '5', '6'], '5', 'There are five berries.'),
      q('How many berries?', '●  ●', ['1', '2', '3'], '2', 'There are two berries.'),
      q('How many berries?', '●  ●  ●  ●', ['3', '4', '5'], '4', 'There are four berries.'),
      q('How many berries?', '●  ●  ●  ●  ●  ●', ['5', '6', '7'], '6', 'There are six berries.'),
    ],
  },
  {
    title: 'Snack Lab', skill: 'Make 10', teacher: 'Nori', art: 1,
    intro: 'A full tray holds ten snacks. Count the empty spaces to make ten.',
    rounds: [
      q('Six snacks are on the tray. How many more make ten?', '● ● ● ● ● ●  ○ ○ ○ ○', ['3', '4', '5'], '4', 'Six and four make ten.'),
      q('Eight snacks are on the tray. How many more make ten?', '● ● ● ● ● ● ● ●  ○ ○', ['1', '2', '3'], '2', 'Eight and two make ten.'),
      q('Five snacks are on the tray. How many more make ten?', '● ● ● ● ●  ○ ○ ○ ○ ○', ['4', '5', '6'], '5', 'Five and five make ten.'),
      q('Nine snacks are on the tray. How many more make ten?', '● ● ● ● ● ● ● ● ●  ○', ['0', '1', '2'], '1', 'Nine and one make ten.'),
      q('Seven snacks are on the tray. How many more make ten?', '● ● ● ● ● ● ●  ○ ○ ○', ['2', '3', '4'], '3', 'Seven and three make ten.'),
    ],
  },
  {
    title: 'Addition Pond', skill: 'Add within 10', teacher: 'Milo', art: 2,
    intro: 'Put two groups together. Count everything to find the sum.',
    rounds: [
      q('What is 3 + 2?', '● ● ●   +   ● ●', ['4', '5', '6'], '5', 'Three and two make five.'),
      q('What is 4 + 1?', '● ● ● ●   +   ●', ['4', '5', '6'], '5', 'Four and one make five.'),
      q('What is 2 + 2?', '● ●   +   ● ●', ['3', '4', '5'], '4', 'Two and two make four.'),
      q('What is 5 + 0?', '● ● ● ● ●   +   nothing', ['4', '5', '6'], '5', 'Adding zero leaves five.'),
      q('What is 3 + 4?', '● ● ●   +   ● ● ● ●', ['6', '7', '8'], '7', 'Three and four make seven.'),
    ],
  },
  {
    title: 'More or Less Market', skill: 'Compare groups', teacher: 'Tilly', art: 3,
    intro: 'Look at both groups. Which has more? They can also be the same.',
    rounds: [
      q('Which group has more?', 'A: ● ● ● ●     B: ● ●', ['A', 'B', 'Same'], 'A', 'Four is more than two.'),
      q('Which group has more?', 'A: ● ●     B: ● ● ●', ['A', 'B', 'Same'], 'B', 'Three is more than two.'),
      q('Which group has more?', 'A: ● ● ●     B: ● ● ●', ['A', 'B', 'Same'], 'Same', 'Both groups have three.'),
      q('Which group has more?', 'A: ●     B: ● ● ● ●', ['A', 'B', 'Same'], 'B', 'Four is more than one.'),
      q('Which group has more?', 'A: ● ● ● ● ●     B: ● ● ●', ['A', 'B', 'Same'], 'A', 'Five is more than three.'),
    ],
  },
  {
    title: 'Shape Studio', skill: 'Explore shapes', teacher: 'Ziggy', art: 4,
    intro: 'Look at sides and corners to tell shapes apart.',
    rounds: [
      q('Which shape has three sides?', '△    ○    □', ['Triangle', 'Circle', 'Square'], 'Triangle', 'A triangle has three sides.'),
      q('Which shape has no straight sides?', '○    △    □', ['Square', 'Circle', 'Triangle'], 'Circle', 'A circle has no straight sides.'),
      q('Which shape has four equal sides?', '□    ○    △', ['Circle', 'Square', 'Triangle'], 'Square', 'A square has four equal sides.'),
      q('Which shape has four corners and two long sides?', '▭    ○    △', ['Circle', 'Triangle', 'Rectangle'], 'Rectangle', 'A rectangle has four corners.'),
      q('Which shape looks like a round wheel?', '○    □    △', ['Circle', 'Square', 'Triangle'], 'Circle', 'A wheel is round like a circle.'),
    ],
  },
  {
    title: 'Take-Away Cave', skill: 'Subtract within 10', teacher: 'Otto', art: 5,
    intro: 'Start with a group, take some away, then count what remains.',
    rounds: [
      q('What is 5 − 2?', '● ● ● ● ●  →  take away 2', ['2', '3', '4'], '3', 'Five take away two leaves three.'),
      q('What is 4 − 1?', '● ● ● ●  →  take away 1', ['2', '3', '4'], '3', 'Four take away one leaves three.'),
      q('What is 6 − 3?', '● ● ● ● ● ●  →  take away 3', ['2', '3', '4'], '3', 'Six take away three leaves three.'),
      q('What is 3 − 0?', '● ● ●  →  take away none', ['2', '3', '4'], '3', 'Taking away zero leaves three.'),
      q('What is 7 − 4?', '● ● ● ● ● ● ●  →  take away 4', ['2', '3', '4'], '3', 'Seven take away four leaves three.'),
    ],
  },
  {
    title: 'Number Trail', skill: 'Order 0–20', teacher: 'Poppy', art: 6,
    intro: 'Follow the trail. Numbers go up by one each step.',
    rounds: [
      q('What comes after 7?', '6   →   7   →   ?', ['8', '9', '6'], '8', 'Eight comes after seven.'),
      q('What is missing?', '11   →   ?   →   13', ['10', '12', '14'], '12', 'Twelve is between eleven and thirteen.'),
      q('What comes before 5?', '?   →   5   →   6', ['3', '4', '7'], '4', 'Four comes before five.'),
      q('What comes after 18?', '17   →   18   →   ?', ['19', '20', '16'], '19', 'Nineteen comes after eighteen.'),
      q('What is missing?', '0   →   ?   →   2', ['1', '3', '4'], '1', 'One is between zero and two.'),
    ],
  },
  {
    title: 'Pattern Parade', skill: 'Repeat patterns', teacher: 'Luna', art: 7,
    intro: 'Find the part that repeats, then choose what comes next.',
    rounds: [
      q('What comes next?', 'Red  Blue  Red  Blue  ?', ['Red', 'Blue', 'Green'], 'Red', 'Red and blue repeat.'),
      q('What comes next?', 'Star  Moon  Star  Moon  ?', ['Moon', 'Star', 'Sun'], 'Star', 'Star and moon repeat.'),
      q('What comes next?', 'A  A  B  A  A  B  ?', ['A', 'B', 'C'], 'A', 'The A, A, B group starts again.'),
      q('What comes next?', 'Circle  Square  Square  Circle  ?', ['Circle', 'Square', 'Triangle'], 'Square', 'Circle, square, square repeats.'),
      q('What comes next?', '1  2  3  1  2  ?', ['1', '2', '3'], '3', 'The 1, 2, 3 group repeats.'),
    ],
  },
  {
    title: 'Sort & Spot', skill: 'Sort by a rule', teacher: 'Sunny', art: 8,
    intro: 'Check the rule first. Pick the item that belongs in the group.',
    rounds: [
      q('Choose a blue item.', 'Rule: blue', ['Blue star', 'Red star', 'Green circle'], 'Blue star', 'The blue star follows the rule.'),
      q('Choose a circle.', 'Rule: circle', ['Red square', 'Blue circle', 'Blue triangle'], 'Blue circle', 'The blue circle follows the rule.'),
      q('Choose a small item.', 'Rule: small', ['Large star', 'Small star', 'Large circle'], 'Small star', 'The small star follows the rule.'),
      q('Choose a red item.', 'Rule: red', ['Blue square', 'Green star', 'Red circle'], 'Red circle', 'The red circle follows the rule.'),
      q('Choose a triangle.', 'Rule: triangle', ['Yellow triangle', 'Yellow square', 'Blue circle'], 'Yellow triangle', 'The yellow triangle follows the rule.'),
    ],
  },
  {
    title: 'Measure Meadow', skill: 'Compare lengths', teacher: 'Luna', art: 7,
    intro: 'Compare the two lines from the same starting point.',
    rounds: [
      q('Which line is longer?', 'A: ━━━      B: ━━━━━━', ['A', 'B', 'Same'], 'B', 'Line B reaches farther.'),
      q('Which line is shorter?', 'A: ━━━━━━   B: ━━━', ['A', 'B', 'Same'], 'B', 'Line B is shorter.'),
      q('Which line is longer?', 'A: ━━━━     B: ━━━━', ['A', 'B', 'Same'], 'Same', 'The lines are equal in length.'),
      q('Which line is shorter?', 'A: ━━       B: ━━━━━', ['A', 'B', 'Same'], 'A', 'Line A is shorter.'),
      q('Which line is longer?', 'A: ━━━━━━━  B: ━━━', ['A', 'B', 'Same'], 'A', 'Line A reaches farther.'),
    ],
  },
];

type FocusButtonProps = {
  label: string;
  onPress: () => void;
  preferred?: boolean;
  primary?: boolean;
  width?: number;
  testID?: string;
};

const FocusButton = ({label, onPress, preferred, primary, width, testID}: FocusButtonProps) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      hasTVPreferredFocus={preferred}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={[styles.button, primary && styles.primaryButton, focused && styles.focusedButton, width ? {width} : null]}>
      <Text style={[styles.buttonText, primary && styles.primaryButtonText]} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
};

export const App = () => {
  const {width, height} = useWindowDimensions();
  const [screen, setScreen] = React.useState<'town' | 'game'>('town');
  const [gameIndex, setGameIndex] = React.useState(0);
  const [mode, setMode] = React.useState<'watch' | 'play' | 'finished'>('watch');
  const [roundIndex, setRoundIndex] = React.useState(0);
  const [answered, setAnswered] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');
  const compact = height < 620;

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'game') {
        setScreen('town');
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [screen]);

  const openGame = (index: number) => {
    setGameIndex(index);
    setMode('watch');
    setRoundIndex(0);
    setAnswered(false);
    setFeedback('');
    setScreen('game');
  };
  const startPractice = () => {
    setRoundIndex(0);
    setAnswered(false);
    setFeedback('');
    setMode('play');
  };
  const nextRound = () => {
    if (roundIndex === 4) {
      setMode('finished');
    } else {
      setRoundIndex(roundIndex + 1);
      setAnswered(false);
      setFeedback('');
    }
  };

  if (screen === 'town') {
    const cardWidth = Math.max(120, (width - 110) / 5);
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Blossom ✿</Text>
          <Text style={styles.headerHelp}>Little math adventures · Arrows move · Select plays</Text>
        </View>
        <View style={[styles.hero, compact && styles.compactHero]}>
          <Image source={require('./assets/town.webp')} style={styles.heroArt} resizeMode="cover" accessible={false} />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, compact && styles.compactHeroTitle]}>Choose an adventure</Text>
            <Text style={styles.heroSubtitle}>Ten games with your Blossom friends</Text>
          </View>
        </View>
        <TVFocusGuideView style={styles.grid}>
          {games.map((game, index) => (
            <View key={game.title} style={{width: cardWidth, padding: 5}}>
              <FocusButton
                label={game.title}
                onPress={() => openGame(index)}
                preferred={index === 0}
                primary
                width={cardWidth - 10}
                testID={`game-${index}`}
              />
              <Text style={styles.skill} numberOfLines={1}>{game.skill}</Text>
            </View>
          ))}
        </TVFocusGuideView>
        <Text style={styles.footer}>Count · Compare · Explore · Play again</Text>
      </View>
    );
  }

  const game = games[gameIndex];
  const round = game.rounds[roundIndex];
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>Blossom ✿</Text>
        <FocusButton label="Town" onPress={() => setScreen('town')} testID="town" />
      </View>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <Text style={styles.gameSkill}>{game.skill}</Text>
      </View>
      <View style={styles.gameLayout}>
        <View style={styles.teacherPanel}>
          <Image source={art[game.art]} style={[styles.teacherArt, compact && styles.compactTeacherArt]} resizeMode="contain" accessible={false} />
          <Text style={styles.teacherName}>Play with {game.teacher}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.playPanel}>
          {mode === 'watch' ? (
            <>
              <Text style={styles.sectionLabel}>Little lesson</Text>
              <Text style={styles.prompt}>{game.intro}</Text>
              <Text style={styles.caption}>Look, think, then choose. You can try five rounds at your own pace.</Text>
              <FocusButton label="My turn" onPress={startPractice} preferred primary testID="practice" />
            </>
          ) : mode === 'finished' ? (
            <>
              <Text style={styles.celebration}>You did it! ✿</Text>
              <Text style={styles.prompt}>Five rounds complete with {game.teacher}.</Text>
              <View style={styles.choiceRow}>
                <FocusButton label="Play again" onPress={startPractice} preferred primary testID="replay" />
                <FocusButton label="Choose a game" onPress={() => setScreen('town')} testID="choose-game" />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionLabel}>My turn · {roundIndex + 1} of 5</Text>
              <Text style={styles.prompt}>{round.prompt}</Text>
              <Text style={styles.picture}>{round.picture}</Text>
              <TVFocusGuideView style={styles.choiceRow}>
                {round.choices.map((choice, index) => (
                  <FocusButton
                    key={`${roundIndex}-${choice}`}
                    label={choice}
                    preferred={index === 0 && !answered}
                    primary
                    onPress={() => {
                      if (answered) return;
                      if (choice === round.answer) {
                        setAnswered(true);
                        setFeedback(`That's right! ${round.explanation}`);
                      } else {
                        setFeedback('Good try. Look carefully and choose again.');
                      }
                    }}
                    testID={`choice-${index}`}
                  />
                ))}
              </TVFocusGuideView>
              <Text style={[styles.feedback, answered && styles.success]} accessibilityLiveRegion="polite">{feedback || 'Use the arrows and Select to choose.'}</Text>
              {answered && <FocusButton label={roundIndex === 4 ? 'Finish' : 'Next round'} onPress={nextRound} preferred testID="next" />}
            </>
          )}
        </ScrollView>
      </View>
      <Text style={styles.footer}>Back returns to town</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#eaf5ff', paddingHorizontal: 36, paddingTop: 20, paddingBottom: 12},
  header: {height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  brand: {color: '#17265b', fontWeight: '900', fontSize: 38},
  headerHelp: {color: '#254774', fontSize: 20, fontWeight: '700'},
  hero: {height: 204, borderRadius: 24, overflow: 'hidden', backgroundColor: '#90ca77', marginTop: 8},
  compactHero: {height: 150},
  heroArt: {width: '100%', height: '100%'},
  heroCopy: {position: 'absolute', top: 18, right: 24, backgroundColor: 'rgba(19,45,70,0.78)', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10},
  heroTitle: {color: '#ffffff', fontSize: 32, fontWeight: '900'},
  compactHeroTitle: {fontSize: 26},
  heroSubtitle: {color: '#ffffff', fontSize: 17, fontWeight: '700'},
  grid: {flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', marginTop: 12},
  button: {minWidth: 138, minHeight: 64, backgroundColor: '#f9fcff', borderColor: '#bad1ee', borderWidth: 2, borderRadius: 18, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', margin: 4},
  primaryButton: {backgroundColor: '#1c4b91', borderColor: '#1c4b91'},
  focusedButton: {borderColor: '#ffbc42', borderWidth: 5, transform: [{scale: 1.04}]},
  buttonText: {color: '#17265b', fontSize: 20, fontWeight: '800', textAlign: 'center'},
  primaryButtonText: {color: '#ffffff'},
  skill: {color: '#244473', fontSize: 15, fontWeight: '700', textAlign: 'center'},
  footer: {color: '#35547a', fontSize: 16, fontWeight: '700', textAlign: 'center', paddingTop: 8},
  gameHeader: {height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  gameTitle: {color: '#17265b', fontSize: 34, fontWeight: '900'},
  gameSkill: {color: '#325b8d', fontSize: 19, fontWeight: '700'},
  gameLayout: {flex: 1, flexDirection: 'row'},
  teacherPanel: {width: 245, alignItems: 'center', justifyContent: 'center'},
  teacherArt: {width: 230, height: 270},
  compactTeacherArt: {width: 190, height: 200},
  teacherName: {color: '#17265b', fontSize: 22, fontWeight: '800'},
  playPanel: {flexGrow: 1, backgroundColor: '#ffffff', borderRadius: 28, borderWidth: 3, borderColor: '#c8dcf5', paddingHorizontal: 28, paddingVertical: 20, justifyContent: 'center', alignItems: 'flex-start'},
  sectionLabel: {color: '#466aa0', fontSize: 18, fontWeight: '800', marginBottom: 10},
  prompt: {color: '#17265b', fontSize: 28, fontWeight: '800', marginBottom: 12},
  picture: {color: '#225176', fontSize: 28, fontWeight: '700', backgroundColor: '#eef8e9', padding: 16, borderRadius: 20, alignSelf: 'stretch', marginBottom: 14},
  caption: {color: '#315176', fontSize: 20, marginBottom: 22},
  choiceRow: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 10},
  feedback: {color: '#3b557a', fontSize: 20, fontWeight: '700', marginVertical: 10},
  success: {color: '#187242'},
  celebration: {color: '#173f82', fontSize: 48, fontWeight: '900', marginBottom: 14},
});
