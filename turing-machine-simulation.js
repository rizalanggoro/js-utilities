// turing machine multi tape
const getHeadContent = (tape) => {
  if (tape.length === 0) tape.push({ content: "b", head: true });
  return tape.filter((it) => it.head === true)[0].content;
};

const findHeadIndex = (tape) => tape.findIndex((it) => it.head === true);

const moveHead = (tape, direction) => {
  const index = findHeadIndex(tape);
  if (direction !== "s") tape[index].head = false;

  if (direction === "r") {
    if (index === tape.length - 1) {
      // create new blank at last
      tape.push({ content: "b", head: true });
    } else {
      tape[index + 1].head = true;
    }
  } else if (direction === "l") {
    if (index === 0) {
      // create new blank at first
      tape.splice(0, 0, { content: "b", head: true });
    } else {
      tape[index - 1].head = true;
    }
  }

  return tape;
};

const replaceInput = (tape, newContent) =>
  tape.map((item) => {
    if (item.head === true) return { ...item, content: newContent };
    return item;
  });

const Turing = (ruleSets) => {
  return {
    move: (props) => {
      let input = "";
      for (const tape of props.tapeData) {
        input += getHeadContent(tape);
      }

      console.log(input);

      const rules = ruleSets[props.currentState];
      if (rules) {
        const transition = rules.filter((it) =>
          it.rule.startsWith(input + "/")
        )[0];
        if (transition) {
          const rule = transition.rule;
          const slashIndex = rule.indexOf("/");
          const commaIndex = rule.indexOf(",");

          const toReplace = rule.substring(
            slashIndex + 1,
            slashIndex + 1 + props.tapeData.length
          );
          const toDirection = rule.substring(commaIndex + 1);

          console.log({ slashIndex, rule, toReplace, toDirection });

          for (let a = 0; a < props.tapeData.length; a++) {
            props.tapeData[a] = [
              ...replaceInput(props.tapeData[a], toReplace.substring(a, a + 1)),
            ];
            props.tapeData[a] = [
              ...moveHead(props.tapeData[a], toDirection.substring(a, a + 1)),
            ];
          }

          return {
            newTapeData: [...props.tapeData],
            transition: {
              from: props.currentState,
              input,
              to: transition.to,
              replace: toReplace,
              direction: toDirection,
            },
          };
        }
      }

      return {
        newTapeData: [...props.tapeData],
        transition: {
          from: props.currentState,
          input,
          to: "-",
          replace: "-",
          direction: "-",
        },
      };
    },
  };
};
