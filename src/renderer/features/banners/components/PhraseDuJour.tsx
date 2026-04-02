import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Collapse,
  Button
} from '@mui/material';

type Phrase = {
  phrase: string;
  transliteration?: string;
  explanation: string;
  sentence: string;
};

// Hardcoded constant array of phrase objects
const PHRASES: Phrase[] = [
  {
    phrase: "Да нет, наверное",
    transliteration: "Da nyet, navernoye",
    explanation: "Literally 'Yes no maybe'. Used to express a polite but firm 'probably not'.",
    sentence: "— Ты пойдёшь на вечеринку? — Да нет, наверное."
  },
  {
    phrase: "Руки не доходят",
    transliteration: "Ruki ne dokhodyat",
    explanation: "Literally 'the hands don't reach'. Used when you haven't had the time or energy to do something.",
    sentence: "Я хочу починить полку, но руки не доходят."
  },
  {
    phrase: "Всё пучком",
    transliteration: "Vsyo puchkom",
    explanation: "Colloquial for 'everything is fine' or 'everything is under control'.",
    sentence: "Не волнуйся, у меня всё пучком!"
  },
  {
    phrase: "Anecdata",
    explanation: "Anecdotal data, usually misused.",
    sentence: "Their idea of facts is anecdata followed by bigotry."
  }
];

export const PhraseDuJour = () => {
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [expanded, setExpanded] = useState(false);
  const BLOOD_GLOW = '#FF4545'; // COLORS.bloodGlow placeholder

  useEffect(() => {
    const STORAGE_KEY = 'phrase-du-jour-indices';

    // TODO: Abstract.
    const shuffle = (array: number[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Extract.
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedIndices: number[] = storedData ? JSON.parse(storedData) : [];
    const indices = storedIndices.length === 0 ? shuffle(PHRASES.map((_, index) => index)) : storedIndices;

    // Shift.
    const phraseIndex = indices.shift() ?? 0;
    setCurrentPhrase(PHRASES[phraseIndex]);

    // Load.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(indices));
  }, []);

  if (!currentPhrase) return null;

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        // maxWidth: 500, 
        m: 2, 
        border: `1px solid ${BLOOD_GLOW}`,
        backgroundColor: 'rgba(255, 69, 69, 0.05)' 
      }}
    >
      <CardContent sx={{
        '&:last-child': {
          paddingBottom: '16px',
        },
      }}>
        <Collapse in={expanded}>
          <Typography
            sx={{ color: BLOOD_GLOW, fontWeight: 'bold' }} variant="overline"
          >
            Phrase Du Jour
          </Typography>
        </Collapse>
        <Button variant="text" onClick={() => setExpanded(!expanded)} sx={{
          display: 'flex',
          flexDirection: expanded ? 'column' : 'row',
          textAlign: 'left',
          gap: '1rem',
        }}>
          <Typography
            variant="h6" component="div" fontSize={12} sx={{
              color: BLOOD_GLOW, mb: 0.5
            }}
          >
            {currentPhrase.phrase}
          </Typography>

          {currentPhrase.transliteration && <Typography
            fontSize={12}
            variant="subtitle2" color="text.secondary" gutterBottom
          >
            {currentPhrase.transliteration}
          </Typography>}

          <Collapse in={!expanded}>
            <Typography variant="body1" fontSize={12}>
              {currentPhrase.explanation}
            </Typography>
          </Collapse>
        </Button>
        <Collapse in={expanded}>
          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Meaning:
            </Typography>
            <Typography variant="body1">
              {currentPhrase.explanation}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
              Example:
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "{currentPhrase.sentence}"
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
