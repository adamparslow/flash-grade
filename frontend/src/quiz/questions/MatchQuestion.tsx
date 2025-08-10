import { useMemo, useState } from "react";
import type { QuestionProps } from "../QuizPage";
import { Button, Stack } from "@mui/material";

type ButtonState = "default" | "success" | "fail" | "selected";

export function MatchQuestion({ question, onNext }: QuestionProps) {
  const leftButtons = useMemo(() => question.translations
    .map(t => ({ ...t }))
    .sort(() => Math.random() - 0.5), [question]);
  const rightButtons = useMemo(() => question.translations.map(t => ({ ...t })).sort(() => Math.random() - 0.5), [question]);

  const [buttonStateMatrix, setButtonStateMatrix] = useState<ButtonState[][]>([["default", "default", "default", "default"], ["default", "default", "default", "default"]]);
  const [selectedButton, setSelectedButton] = useState<number[] | null>(null);

  const changeMatrixStates = (updates: Array<[number, number, ButtonState]>) => {
    setButtonStateMatrix(prev => {
      const next = prev.map(r => [...r]);
      for (const [c, r, s] of updates) next[c][r] = s;
      return next;
    });
  };

  const handleButtonClick = (column: "left" | "right", row: number) => {
    const columnIndex = column === "left" ? 0 : 1;

    if (selectedButton === null) {
      setSelectedButton([columnIndex, row]);
      changeMatrixStates([
        [columnIndex, row, "selected"],
      ])
      return;
    }

    const getTranslation = (column: number, row: number) => {
      return column === 0 ? leftButtons[row] : rightButtons[row];
    }

    const currSelectedTranslation = getTranslation(selectedButton[0], selectedButton[1]);
    const currTranslation = getTranslation(columnIndex, row);

    if (currSelectedTranslation.id === currTranslation.id) {
      changeMatrixStates([
        [selectedButton[0], selectedButton[1], "success"],
        [columnIndex, row, "success"],
      ])
      setSelectedButton(null);
    } else {
      changeMatrixStates([
        [selectedButton[0], selectedButton[1], "fail"],
        [columnIndex, row, "fail"],
      ])
      setSelectedButton(null);

      setTimeout(() => {
        changeMatrixStates([
          [selectedButton[0], selectedButton[1], "default"],
          [columnIndex, row, "default"],
        ])
      }, 1000)
    }
  };

  return (
    <Stack height="100%" padding={2}>
      <Stack direction="row" flex={1} gap={2}>
        <Stack flex={1} justifyContent="space-evenly" height="100%">
          {leftButtons.map((translation, index) => (
            <QuestionButton state={buttonStateMatrix[0][index]} onClick={() => handleButtonClick("left", index)}>
              {translation.english}
            </QuestionButton>
          ))}
        </Stack>
        <Stack flex={1} justifyContent="space-evenly" height="100%">
          {rightButtons.map((translation, index) => (
            <QuestionButton state={buttonStateMatrix[1][index]} onClick={() => handleButtonClick("right", index)}>
              {translation.tagalog}
            </QuestionButton>
          ))}
        </Stack>
      </Stack>

      <Stack flex={1} paddingTop={2}>
        <Button
          onClick={onNext}
          variant="contained"
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

const buttonColor: Record<ButtonState, "info" | "error" | "success" | "primary"> = {
  "default": "info",
  "fail": "error",
  "success": "success",
  "selected": "primary"
}

function QuestionButton({ children, state, onClick }: { children: React.ReactNode, state: ButtonState, onClick: () => void }) {
  return <Button
    variant="contained"
    color={buttonColor[state]}
    onClick={onClick}
  >
    {children}
  </Button>
}