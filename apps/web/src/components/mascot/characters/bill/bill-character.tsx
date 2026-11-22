import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from 'motion/react'
import { useSyncExternalStore } from 'react'

import type { MascotCharacterProps } from '../../mascot-character'
import type { MascotReaction } from '../../mascot-context'
import {
  getMascotResumeCycle,
  subscribeMascotResume,
} from '../../mascot-resume'

const spring = {
  type: 'spring',
  stiffness: 360,
  damping: 24,
  mass: 0.72,
} as const

// DONGY 8-bit look: Bill is drawn on a pixel grid with flat fills, square
// pixels and stepped edges. Motion (the split, clap, waves, rain) is unchanged.
const INK = 'hsl(var(--mascot-ink))'
const PAPER = 'hsl(var(--mascot-paper))'

/** Tear down the middle of the receipt: x alternates 67/73 every 6 units. */
function tearPath() {
  let d = ''
  for (let k = 0; k <= 17; k++) {
    const x = k % 2 === 0 ? 67 : 73
    const yTop = k === 17 ? 14 : 116 - 6 * k
    d += `H${x}V${yTop}`
  }
  return d
}

const LEFT_BODY =
  'M70 14H36V18H32V22H28V128H34V122H40V128H46V122H52V128H58V122H64V128' +
  tearPath() +
  'H70Z'
const RIGHT_BODY =
  'M70 14H104V18H108V22H112V122H106V128H100V122H94V128H88V122H82V128H76V122H70V128' +
  tearPath() +
  'H70Z'

/** A square pixel coin. */
function PixelCoin({ x, y, r }: { x: number; y: number; r: number }) {
  const s2 = Math.round(r * 2)
  const inner = Math.round(r)
  return (
    <>
      <rect
        x={x - s2 / 2}
        y={y - s2 / 2}
        width={s2}
        height={s2}
        fill={PAPER}
        stroke="hsl(var(--mascot-stroke))"
        strokeWidth="1.6"
      />
      <rect
        x={x - inner / 2}
        y={y - inner / 2}
        width={inner}
        height={inner}
        fill="hsl(var(--mascot-accent))"
      />
    </>
  )
}

export type BillSortingPhase = 'waiting' | 'catching' | 'reading' | 'filing'

type BillCharacterProps = MascotCharacterProps & {
  sortingPhase?: BillSortingPhase
  sortingArms?: boolean
}

export function BillCharacter({
  className,
  docked = false,
  open = false,
  reaction = 'idle',
  reactionKey = 0,
  sortingPhase,
  sortingArms = true,
}: BillCharacterProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <BillArtwork
        className={className}
        docked={docked}
        open={open}
        reaction={reaction}
        reactionKey={reactionKey}
        sortingPhase={sortingPhase}
        sortingArms={sortingArms}
      />
    </LazyMotion>
  )
}

function BillArtwork({
  className,
  docked,
  open,
  reaction,
  reactionKey,
  sortingPhase,
  sortingArms,
}: Required<Omit<MascotCharacterProps, 'className'>> & {
  className?: string
  sortingPhase?: BillSortingPhase
  sortingArms: boolean
}) {
  const reducedMotion = useReducedMotion()
  const resumeCycle = useSyncExternalStore(
    subscribeMascotResume,
    getMascotResumeCycle,
    () => 0,
  )
  const ambient =
    !reducedMotion && reaction === 'idle' && !open && !sortingPhase
  const clap = reaction === 'celebrate'
  const splitDistance = docked ? 7 : 15

  const wholeAnimation = reducedMotion
    ? { x: 0, y: 0, rotate: 0, scale: docked ? 0.78 : 1 }
    : reaction === 'celebrate'
      ? {
          x: 0,
          y: [0, -6, 0],
          rotate: 0,
          scale: docked ? 0.78 : [1, 1.04, 1],
        }
      : reaction === 'success'
        ? {
            x: 0,
            y: [0, -13, 0, -6, 0],
            rotate: [0, -4, 4, -2, 0],
            scale: docked ? 0.78 : [1, 1.07, 0.98, 1.03, 1],
          }
        : reaction === 'welcome'
          ? {
              x: 0,
              y: [0, -4, 0, -2, 0],
              rotate: [0, -3, 2, -2, 0],
              scale: docked ? 0.78 : 1,
            }
          : reaction === 'acknowledge'
            ? {
                x: 0,
                y: [0, 3, 0],
                rotate: [0, 5, 0],
                scale: docked ? 0.78 : 1,
              }
            : reaction === 'failure'
              ? {
                  x: [0, -3, 3, -2.5, 2, 0],
                  y: [0, 1.5, 0],
                  rotate: [0, -2.5, 2.5, -1.5, 1, 0],
                  scale: docked ? 0.78 : 1,
                }
              : reaction === 'thinking'
                ? {
                    x: 0,
                    y: [0, -2.5, 0],
                    rotate: [-1, 1, -1],
                    scale: docked ? 0.78 : 1,
                  }
                : {
                    x: 0,
                    y: ambient ? [0, -5, 0] : 0,
                    rotate: ambient ? [-1.2, 1.4, -0.8, 1.2] : 0,
                    scale: docked ? 0.78 : 1,
                  }

  return (
    <m.svg
      key={
        reaction === 'idle'
          ? `idle-${resumeCycle}`
          : `${reaction}-${reactionKey}`
      }
      viewBox="0 0 140 158"
      shapeRendering="crispEdges"
      data-mascot-reaction={reaction}
      data-mascot-open={open ? 'true' : 'false'}
      data-mascot-cycle={resumeCycle}
      className={className}
      aria-hidden="true"
      focusable="false"
      initial={
        reaction === 'idle'
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: docked ? 0.78 : 1,
            }
          : false
      }
      animate={{ opacity: 1, ...wholeAnimation }}
      transition={
        reaction === 'idle'
          ? {
              opacity: { duration: 0.24 },
              scale: spring,
              y: ambient
                ? {
                    duration: 3.6,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }
                : spring,
              rotate: ambient
                ? {
                    duration: 5.4,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }
                : spring,
            }
          : reaction === 'thinking'
            ? {
                y: { duration: 1.35, ease: 'easeInOut', repeat: Infinity },
                rotate: {
                  duration: 1.35,
                  ease: 'easeInOut',
                  repeat: Infinity,
                },
                scale: spring,
              }
            : reaction === 'acknowledge'
              ? {
                  duration: 0.7,
                  times: [0, 0.45, 1],
                  ease: 'easeInOut',
                }
              : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ overflow: 'visible', transformOrigin: '70px 138px' }}
    >
      <m.rect
        x="34"
        y="142"
        width="72"
        height="6"
        fill="hsl(var(--mascot-ink) / 0.22)"
        initial={{ scaleX: 1, opacity: 0.18 }}
        animate={{
          scaleX:
            reaction === 'success' || reaction === 'celebrate'
              ? [1, 0.75, 1]
              : open
                ? 1.34
                : docked
                  ? 0.78
                  : 1,
          opacity:
            reaction === 'success' || reaction === 'celebrate'
              ? [0.18, 0.1, 0.18]
              : docked
                ? 0.12
                : 0.18,
        }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ transformOrigin: '70px 145px' }}
      />

      {(reaction === 'success' || reaction === 'celebrate') && (
        <m.rect
          x="20"
          y="26"
          width="100"
          height="100"
          fill="hsl(var(--mascot-accent) / 0.14)"
          stroke="hsl(var(--mascot-accent) / 0.18)"
          strokeWidth="1"
          initial={false}
          animate={{
            opacity: 1,
            scale: reaction === 'celebrate' ? [0.82, 1.1, 1] : [0.75, 1.08, 1],
          }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '70px 76px' }}
        />
      )}

      {(reaction === 'welcome' || reaction === 'acknowledge') && (
        <StickArm
          pose={reaction === 'welcome' ? 'wave' : 'toss'}
          reducedMotion={Boolean(reducedMotion)}
        />
      )}

      {sortingPhase && sortingArms && (
        <SortingArms
          phase={sortingPhase}
          reducedMotion={Boolean(reducedMotion)}
        />
      )}

      <ReceiptHalf
        side="left"
        open={open}
        clap={clap}
        splitDistance={splitDistance}
        reducedMotion={Boolean(reducedMotion)}
      />
      <ReceiptHalf
        side="right"
        open={open}
        clap={clap}
        splitDistance={splitDistance}
        reducedMotion={Boolean(reducedMotion)}
      />

      <m.rect
        x="65"
        y="16"
        width="10"
        height="104"
        fill={PAPER}
        initial={false}
        animate={{
          opacity: open ? 0 : clap && !reducedMotion ? [1, 0, 1, 0, 1] : 1,
        }}
        transition={
          clap && !reducedMotion
            ? { duration: 0.95, ease: [0.22, 1, 0.36, 1] }
            : { duration: reducedMotion ? 0 : 0.12 }
        }
      />

      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <m.g
            key="twins"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={{ delay: reducedMotion ? 0 : 0.16, duration: 0.24 }}
            style={{ transformOrigin: '70px 70px' }}
          >
            <TwinFace x={46 - splitDistance} />
            <TwinFace x={94 + splitDistance} />
          </m.g>
        ) : (
          <m.g
            key={`face-${reaction}-${reactionKey}`}
            initial={{ opacity: 0, scale: 0.82, y: 2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            style={{ transformOrigin: '70px 65px' }}
          >
            <FullFace
              reaction={reaction}
              ambient={ambient}
              sortingPhase={sortingPhase}
            />
          </m.g>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reaction === 'thinking' && (
          <m.g
            key={`thinking-${reactionKey}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ transformOrigin: '112px 25px' }}
          >
            {[0, 1, 2].map((dot) => (
              <m.rect
                key={dot}
                x={101 + dot * 8}
                y={27 - dot * 6}
                width={4 + dot * 2}
                height={4 + dot * 2}
                fill="hsl(var(--mascot-accent))"
                animate={
                  reducedMotion
                    ? undefined
                    : { y: [0, -3, 0], opacity: [0.45, 1, 0.45] }
                }
                transition={{
                  delay: dot * 0.14,
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </m.g>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reaction === 'success' && (
          <m.g
            key={`success-${reactionKey}`}
            data-mascot-fx="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessRain reducedMotion={Boolean(reducedMotion)} />
          </m.g>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reaction === 'celebrate' && (
          <m.g
            key={`celebrate-${reactionKey}`}
            data-mascot-fx="celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessSparkles reducedMotion={Boolean(reducedMotion)} />
            <CelebrateCoins reducedMotion={Boolean(reducedMotion)} />
          </m.g>
        )}
      </AnimatePresence>

      {reaction === 'acknowledge' && (
        <g data-mascot-fx="acknowledge">
          <AcknowledgeToss reducedMotion={Boolean(reducedMotion)} />
        </g>
      )}
    </m.svg>
  )
}

function ReceiptHalf({
  side,
  open,
  clap,
  splitDistance,
  reducedMotion,
}: {
  side: 'left' | 'right'
  open: boolean
  clap: boolean
  splitDistance: number
  reducedMotion: boolean
}) {
  const left = side === 'left'
  const bodyPath = left ? LEFT_BODY : RIGHT_BODY
  const direction = left ? -1 : 1
  const clapMotion = clap && !open && !reducedMotion

  return (
    <m.g
      data-mascot-clap={clap && !open ? 'true' : undefined}
      initial={false}
      animate={{
        x: open
          ? direction * splitDistance
          : clapMotion
            ? [
                0,
                direction * splitDistance,
                0,
                direction * (splitDistance * 0.55),
                0,
              ]
            : 0,
        y: open ? -1 : clapMotion ? [0, -3, 0, -2, 0] : 0,
        rotate: open
          ? direction * 4.2
          : clapMotion
            ? [0, direction * 9, 0, direction * 5, 0]
            : 0,
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : clapMotion
            ? { duration: 0.95, ease: [0.22, 1, 0.36, 1] }
            : spring
      }
      style={{ transformOrigin: '70px 74px' }}
    >
      <path
        d={bodyPath}
        fill={PAPER}
        stroke="hsl(var(--mascot-stroke))"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      {/* Pixel shading: a darker band on the outer edge and above the teeth. */}
      <rect
        x={left ? 30 : 106}
        y="24"
        width="4"
        height="92"
        fill={
          left
            ? 'hsl(var(--mascot-paper-mid))'
            : 'hsl(var(--mascot-paper-edge))'
        }
      />
      <rect
        x={left ? 30 : 76}
        y="116"
        width={left ? 34 : 34}
        height="4"
        fill="hsl(var(--mascot-paper-edge))"
      />
      <m.path
        d={bodyPath}
        fill={
          left
            ? 'hsl(var(--mascot-accent) / 0.16)'
            : 'hsl(var(--mascot-ink) / 0.06)'
        }
        initial={false}
        animate={{ opacity: clap ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.32 }}
      />

      <ReceiptPrint left={left} />
    </m.g>
  )
}

/**
 * Thermal-print look: short pixel "words" and dashed dividers instead of solid
 * lines. The left half reads like item names, the right like prices.
 */
const PRINT_ROWS = [
  { y: 29, left: [6, 4], right: [5, 3], color: 'hsl(var(--mascot-accent))' },
  { y: 36, dashed: true, color: 'hsl(var(--mascot-rule) / 0.55)' },
  { y: 89, left: [4, 2, 3], right: [4], color: 'hsl(var(--mascot-rule))' },
  { y: 95, left: [3, 4], right: [3], color: 'hsl(var(--mascot-rule))' },
  { y: 101, dashed: true, color: 'hsl(var(--mascot-rule) / 0.55)' },
  { y: 107, left: [5, 2], right: [5], color: 'hsl(var(--mascot-accent))' },
] as const

function ReceiptPrint({ left }: { left: boolean }) {
  const start = left ? 36 : 78
  const end = left ? 62 : 104
  const rects: { x: number; y: number; w: number; fill: string }[] = []
  for (const row of PRINT_ROWS) {
    if ('dashed' in row) {
      for (let x = start; x + 2 <= end; x += 4) {
        rects.push({ x, y: row.y, w: 2, fill: row.color })
      }
      continue
    }
    const words = left ? row.left : row.right
    // Item names start at the left edge; prices are right-aligned.
    const total = words.reduce((sum, w) => sum + w * 2 + 2, -2)
    let x = left ? start : end - total
    for (const w of words) {
      rects.push({ x, y: row.y, w: w * 2, fill: row.color })
      x += w * 2 + 2
    }
  }
  return (
    <g data-mascot-print={left ? 'left' : 'right'}>
      {rects.map((r) => (
        <rect
          key={`${r.x}-${r.y}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height="2"
          fill={r.fill}
        />
      ))}
    </g>
  )
}

/**
 * Bill's face, drawn by hand in design/mascot-face-editor.html. Rects are [x,
 * y, width, height] in the SVG's 140×158 viewBox.
 */
const FACE_EYES = [
  [52, 56, 10, 10],
  [78, 56, 10, 10],
] as const
const FACE_MOUTH = [
  [62, 72, 4, 2],
  [74, 72, 4, 2],
  [62, 74, 2, 10],
  [76, 74, 2, 10],
  [68, 78, 4, 6],
  [64, 84, 12, 2],
] as const
/** The mouth's vertical span, used to flip it into a frown. */
const MOUTH_TOP = 72
const MOUTH_BOTTOM = 86

function FaceRects({
  rects,
  flip = false,
}: {
  rects: ReadonlyArray<readonly [number, number, number, number]>
  flip?: boolean
}) {
  return (
    <>
      {rects.map(([x, y, w, h]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={flip ? MOUTH_TOP + MOUTH_BOTTOM - (y + h) : y}
          width={w}
          height={h}
        />
      ))}
    </>
  )
}

function FaceEyes() {
  return (
    <g fill={INK}>
      <FaceRects rects={FACE_EYES} />
    </g>
  )
}

function FaceMouth({ mood = 'smile' }: { mood?: 'smile' | 'frown' | 'flat' }) {
  return (
    <g fill={INK} data-mascot-mouth={mood}>
      {mood === 'flat' ? (
        <rect x="64" y="80" width="12" height="2" />
      ) : (
        <FaceRects rects={FACE_MOUTH} flip={mood === 'frown'} />
      )}
    </g>
  )
}

function FullFace({
  reaction,
  ambient,
  sortingPhase,
}: {
  reaction: MascotReaction
  ambient: boolean
  sortingPhase?: BillSortingPhase
}) {
  if (sortingPhase) {
    return (
      <g data-mascot-sorting-face={sortingPhase}>
        <FaceEyes />
        <FaceMouth mood={sortingPhase === 'reading' ? 'flat' : 'smile'} />
      </g>
    )
  }

  if (reaction === 'failure') {
    return (
      <g>
        <FaceEyes />
        <FaceMouth mood="frown" />
        <m.g
          initial={{ y: -2, opacity: 0 }}
          animate={{ y: [0, 5, 5], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: 1, ease: 'easeIn' }}
          fill="hsl(var(--mascot-accent) / 0.85)"
        >
          <rect x="90" y="67" width="2" height="2" />
          <rect x="89" y="69" width="4" height="2" />
          <rect x="88" y="71" width="6" height="6" />
          <rect x="89" y="77" width="4" height="2" />
        </m.g>
      </g>
    )
  }

  const thinking = reaction === 'thinking'
  return (
    <g>
      <m.g
        animate={
          ambient
            ? { x: [0, 0, 0, 2.4, 2.4, 0, 0, 0, -2.2, -2.2, 0] }
            : { x: 0 }
        }
        transition={
          ambient
            ? {
                duration: 11,
                times: [
                  0, 0.18, 0.28, 0.34, 0.46, 0.52, 0.64, 0.72, 0.78, 0.9, 1,
                ],
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : { duration: 0.2 }
        }
      >
        <m.g
          animate={
            ambient
              ? { scaleY: [1, 1, 0.08, 1, 1, 1, 0.08, 1, 1] }
              : { scaleY: 1 }
          }
          transition={
            ambient
              ? {
                  duration: 8.2,
                  times: [0, 0.42, 0.44, 0.47, 0.82, 0.86, 0.88, 0.91, 1],
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.1 }
          }
          style={{ transformOrigin: '70px 61px' }}
        >
          <FaceEyes />
        </m.g>
      </m.g>
      <FaceMouth mood={thinking ? 'flat' : 'smile'} />
    </g>
  )
}

/** The same face at half size, on each half when Bill is torn open. */
function TwinFace({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 66) scale(0.5) translate(-70 -71)`}>
      <FaceEyes />
      <FaceMouth />
    </g>
  )
}

function SortingArms({
  phase,
  reducedMotion,
}: {
  phase: BillSortingPhase
  reducedMotion: boolean
}) {
  const transition = {
    duration: reducedMotion ? 0 : 0.28,
    ease: [0.23, 1, 0.32, 1],
  } as const
  return (
    <g data-mascot-sorting-arms={phase}>
      <m.g
        animate={{
          rotate: phase === 'catching' || phase === 'reading' ? -26 : 8,
        }}
        transition={transition}
        style={{ transformOrigin: '40px 83px' }}
      >
        <path
          d="M41 83L17 65"
          fill="none"
          stroke="hsl(var(--mascot-ink))"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
        <rect x="14" y="62" width="6" height="6" fill={INK} />
      </m.g>
      <m.g
        animate={{
          rotate: phase === 'filing' ? -46 : phase === 'reading' ? -13 : 12,
        }}
        transition={transition}
        style={{ transformOrigin: '100px 83px' }}
      >
        <path
          d="M100 83L125 67"
          fill="none"
          stroke="hsl(var(--mascot-ink))"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
        <rect x="122" y="64" width="6" height="6" fill={INK} />
      </m.g>
    </g>
  )
}

function StickArm({
  pose,
  reducedMotion,
}: {
  pose: 'wave' | 'toss'
  reducedMotion: boolean
}) {
  const wave = pose === 'wave'

  return (
    <m.g
      data-mascot-arm={pose}
      initial={{ opacity: 0, rotate: wave ? 18 : 12 }}
      animate={
        reducedMotion
          ? { opacity: [1, 0], rotate: wave ? -28 : 82 }
          : wave
            ? {
                opacity: [0, 1, 1, 1, 0],
                rotate: [12, -38, -2, -36, 24],
              }
            : {
                opacity: [0, 1, 1, 0],
                rotate: [12, 82, 88, 40],
              }
      }
      transition={
        reducedMotion
          ? { duration: 0.35 }
          : wave
            ? {
                duration: 2.05,
                times: [0, 0.12, 0.4, 0.64, 1],
                ease: 'easeInOut',
              }
            : {
                duration: 0.55,
                times: [0, 0.3, 0.55, 1],
                ease: 'easeInOut',
              }
      }
      style={{ transformOrigin: '100px 76px' }}
    >
      <path
        d="M100 76L134 56"
        fill="none"
        stroke="hsl(var(--mascot-ink))"
        strokeWidth="3.4"
        strokeLinecap="square"
      />
    </m.g>
  )
}

function SuccessSparkles({ reducedMotion }: { reducedMotion: boolean }) {
  const sparkles = [
    { x: 28, y: 38, dx: -8, dy: -12 },
    { x: 112, y: 42, dx: 9, dy: -10 },
    { x: 70, y: 18, dx: 0, dy: -14 },
  ] as const

  return (
    <g data-mascot-sparkles="true">
      {sparkles.map((sparkle, index) => (
        <m.g
          key={`${sparkle.x}-${sparkle.y}`}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{
            x: reducedMotion ? 0 : sparkle.dx,
            y: reducedMotion ? 0 : [0, sparkle.dy, sparkle.dy + 4],
            opacity: [0, 1, 0],
            scale: [0.3, 1, 0.7],
          }}
          transition={{ delay: index * 0.06, duration: 0.72, ease: 'easeOut' }}
          style={{ transformOrigin: `${sparkle.x}px ${sparkle.y}px` }}
        >
          <path
            d={`M${sparkle.x - 2.4} ${sparkle.y}H${sparkle.x + 2.4}M${sparkle.x} ${sparkle.y - 2.4}V${sparkle.y + 2.4}`}
            stroke="hsl(var(--mascot-accent))"
            strokeWidth="2.2"
            strokeLinecap="square"
          />
        </m.g>
      ))}
    </g>
  )
}

function SuccessRain({ reducedMotion }: { reducedMotion: boolean }) {
  const drops = [
    { kind: 'coin', x: 18, delay: 0, spin: 50 },
    { kind: 'bill', x: 40, delay: 0.1, spin: -36 },
    { kind: 'coin', x: 62, delay: 0.04, spin: 28 },
    { kind: 'bill', x: 86, delay: 0.16, spin: 44 },
    { kind: 'coin', x: 108, delay: 0.08, spin: -40 },
    { kind: 'bill', x: 28, delay: 0.28, spin: 22 },
    { kind: 'coin', x: 74, delay: 0.22, spin: -18 },
    { kind: 'bill', x: 122, delay: 0.18, spin: 32 },
  ] as const

  return (
    <g data-mascot-rain="true">
      {drops.map((drop, index) => (
        <m.g
          key={`${drop.kind}-${drop.x}-${index}`}
          initial={{ y: -18, opacity: 0, rotate: 0 }}
          animate={{
            y: reducedMotion ? 64 : [-18, 150],
            opacity: reducedMotion ? 1 : [0, 1, 1, 0],
            rotate: reducedMotion ? drop.spin / 4 : [0, drop.spin],
          }}
          transition={{
            delay: reducedMotion ? 0 : drop.delay,
            duration: reducedMotion ? 0 : 1.35,
            ease: 'easeIn',
          }}
          style={{ transformOrigin: `${drop.x}px 0px` }}
        >
          {drop.kind === 'coin' ? (
            <PixelCoin x={drop.x} y={0} r={5} />
          ) : (
            <g>
              <rect
                x={drop.x - 7}
                y="-4.5"
                width="14"
                height="9"
                fill="hsl(var(--mascot-paper))"
                stroke="hsl(var(--mascot-stroke))"
                strokeWidth="1.3"
              />
              <path
                d={`M${drop.x - 4} -1H${drop.x + 4}`}
                stroke="hsl(var(--mascot-rule))"
                strokeWidth="1.1"
                strokeLinecap="square"
              />
            </g>
          )}
        </m.g>
      ))}
    </g>
  )
}

function CelebrateCoins({ reducedMotion }: { reducedMotion: boolean }) {
  const coins = [
    { x: 26, y: 48, dx: -16, dy: -14 },
    { x: 114, y: 44, dx: 16, dy: -12 },
    { x: 32, y: 98, dx: -14, dy: 8 },
    { x: 110, y: 100, dx: 14, dy: 7 },
    { x: 70, y: 20, dx: 2, dy: -18 },
  ] as const

  return (
    <>
      {coins.map((coin, index) => (
        <m.g
          key={`${coin.x}-${coin.y}`}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            x: reducedMotion ? 0 : coin.dx,
            y: reducedMotion ? 0 : [0, coin.dy, coin.dy + 6],
            opacity: reducedMotion ? 1 : [0, 1, 0],
            scale: reducedMotion ? 1 : [0.4, 1.1, 0.85],
            rotate: reducedMotion ? 0 : [0, 40 * (index % 2 ? -1 : 1)],
          }}
          transition={{ delay: index * 0.05, duration: 0.95, ease: 'easeOut' }}
          style={{ transformOrigin: `${coin.x}px ${coin.y}px` }}
        >
          <PixelCoin x={coin.x} y={coin.y} r={6} />
        </m.g>
      ))}
    </>
  )
}

function AcknowledgeToss({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <g>
      <m.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: reducedMotion ? 1 : [0, 1, 1, 0],
          scale: 1,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.7,
          times: [0, 0.12, 0.62, 1],
          ease: 'easeOut',
        }}
        style={{ transformOrigin: '128px 96px' }}
      >
        <path
          d="M118 86L121 110H135L138 86Z"
          fill="hsl(var(--mascot-paper))"
          stroke="hsl(var(--mascot-stroke))"
          strokeWidth="1.8"
          strokeLinejoin="miter"
        />
        <path
          d="M123 92H133M122 99H134"
          stroke="hsl(var(--mascot-rule))"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
        <m.g
          initial={false}
          animate={reducedMotion ? { rotate: -28 } : { rotate: [0, -36, 0] }}
          transition={{
            duration: reducedMotion ? 0 : 0.45,
            times: [0, 0.35, 1],
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '118px 84px' }}
        >
          <rect
            x="116"
            y="81"
            width="24"
            height="4.5"
            fill="hsl(var(--mascot-ink))"
          />
        </m.g>
      </m.g>
      {!reducedMotion && (
        <m.path
          d="M124 52H134L132 62H122Z"
          fill="hsl(var(--mascot-paper))"
          stroke="hsl(var(--mascot-stroke))"
          strokeWidth="1.5"
          strokeLinejoin="miter"
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: [0, 4, 6],
            y: [0, -4, 34],
            opacity: [0, 1, 0],
            rotate: [0, 18, 80],
          }}
          transition={{ duration: 0.42, delay: 0.06, ease: 'easeIn' }}
          style={{ transformOrigin: '128px 56px' }}
        />
      )}
    </g>
  )
}
