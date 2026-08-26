import { Box } from 'theme-ui';

export default function ChartIcon() {
  return (
    <Box
      as="svg"
      sx={{
        width: '2rem',
        height: '2rem',
        strokeWidth: '1.5',
        flexShrink: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {/* <line x1='2' y1='4' x2='2' y2='19.95' vectorEffect='non-scaling-stroke' />
            <line x1='1.45' y1='20.5' x2='22' y2='20.5' vectorEffect='non-scaling-stroke' /> */}

      <line x1="0.5" y1="0" x2="0.5" y2="19" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="18.5" x2="19" y2="18.5" vectorEffect="non-scaling-stroke" />

      <path
        // d='M 5 17 C 7 10, 9 10, 11 12, 13 14, 16 18, 18 6'
        d="M 3 15 C 5 8, 7 8, 9 10, 11 12, 14 16, 16 4"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </Box>
  );
}
