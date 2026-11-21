/**
 * DONGY: every `lucide-react` import resolves here (see the `lucide-react`
 * alias in vite.config.ts / vitest.config.ts). Icons that have a pixel-art
 * counterpart are swapped for it; anything else falls through to lucide.
 */
import { forwardRef } from 'react'
// The real package, reached by its file path so the alias does not loop.
import type { LucideProps } from 'lucide-react'
import * as lucide from 'lucide-react/dist/esm/lucide-react.mjs'

import { pixelIconMarkup } from './icons.generated'

export * from 'lucide-react/dist/esm/lucide-react.mjs'

const kebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

function pixelIcon(name: string) {
  const markup = pixelIconMarkup[name]
  const original = (lucide as Record<string, { displayName?: string }>)[name]
  if (!markup) return original
  // Keep lucide's own class (e.g. Loader2 → `lucide-loader-circle`).
  const iconClass = `lucide-${kebab(original?.displayName ?? name)}`
  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        strokeWidth: _strokeWidth,
        absoluteStrokeWidth: _absoluteStrokeWidth,
        className,
        children: _children,
        ...rest
      },
      ref,
    ) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
        shapeRendering="crispEdges"
        aria-hidden={
          rest['aria-label'] || rest['aria-labelledby'] ? undefined : true
        }
        className={['lucide', iconClass, className].filter(Boolean).join(' ')}
        {...rest}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    ),
  )
  Icon.displayName = name
  return Icon
}

export const Activity = pixelIcon('Activity') as typeof lucide.Activity
export const AlertCircle = pixelIcon('AlertCircle') as typeof lucide.AlertCircle
export const AlertTriangle = pixelIcon(
  'AlertTriangle',
) as typeof lucide.AlertTriangle
export const AppWindowMac = pixelIcon(
  'AppWindowMac',
) as typeof lucide.AppWindowMac
export const Archive = pixelIcon('Archive') as typeof lucide.Archive
export const ArchiveRestore = pixelIcon(
  'ArchiveRestore',
) as typeof lucide.ArchiveRestore
export const Armchair = pixelIcon('Armchair') as typeof lucide.Armchair
export const ArrowDown = pixelIcon('ArrowDown') as typeof lucide.ArrowDown
export const ArrowDownUp = pixelIcon('ArrowDownUp') as typeof lucide.ArrowDownUp
export const ArrowDownWideNarrow = pixelIcon(
  'ArrowDownWideNarrow',
) as typeof lucide.ArrowDownWideNarrow
export const ArrowLeft = pixelIcon('ArrowLeft') as typeof lucide.ArrowLeft
export const ArrowLeftRight = pixelIcon(
  'ArrowLeftRight',
) as typeof lucide.ArrowLeftRight
export const ArrowRight = pixelIcon('ArrowRight') as typeof lucide.ArrowRight
export const ArrowUp = pixelIcon('ArrowUp') as typeof lucide.ArrowUp
export const ArrowUpDown = pixelIcon('ArrowUpDown') as typeof lucide.ArrowUpDown
export const ArrowUpNarrowWide = pixelIcon(
  'ArrowUpNarrowWide',
) as typeof lucide.ArrowUpNarrowWide
export const ArrowUpRight = pixelIcon(
  'ArrowUpRight',
) as typeof lucide.ArrowUpRight
export const Baby = pixelIcon('Baby') as typeof lucide.Baby
export const Ban = pixelIcon('Ban') as typeof lucide.Ban
export const Banknote = pixelIcon('Banknote') as typeof lucide.Banknote
export const BanknoteArrowDown = pixelIcon(
  'BanknoteArrowDown',
) as typeof lucide.BanknoteArrowDown
export const BanknoteArrowUp = pixelIcon(
  'BanknoteArrowUp',
) as typeof lucide.BanknoteArrowUp
export const BanknoteCheck = pixelIcon(
  'BanknoteCheck',
) as typeof lucide.BanknoteCheck
export const BarChart3 = pixelIcon('BarChart3') as typeof lucide.BarChart3
export const Bell = pixelIcon('Bell') as typeof lucide.Bell
export const BellRing = pixelIcon('BellRing') as typeof lucide.BellRing
export const Bike = pixelIcon('Bike') as typeof lucide.Bike
export const Bitcoin = pixelIcon('Bitcoin') as typeof lucide.Bitcoin
export const BookOpen = pixelIcon('BookOpen') as typeof lucide.BookOpen
export const Bookmark = pixelIcon('Bookmark') as typeof lucide.Bookmark
export const Bug = pixelIcon('Bug') as typeof lucide.Bug
export const Bus = pixelIcon('Bus') as typeof lucide.Bus
export const Calculator = pixelIcon('Calculator') as typeof lucide.Calculator
export const Calendar = pixelIcon('Calendar') as typeof lucide.Calendar
export const CalendarArrowDown = pixelIcon(
  'CalendarArrowDown',
) as typeof lucide.CalendarArrowDown
export const CalendarArrowUp = pixelIcon(
  'CalendarArrowUp',
) as typeof lucide.CalendarArrowUp
export const CalendarClock = pixelIcon(
  'CalendarClock',
) as typeof lucide.CalendarClock
export const CalendarDays = pixelIcon(
  'CalendarDays',
) as typeof lucide.CalendarDays
export const CalendarIcon = pixelIcon(
  'CalendarIcon',
) as typeof lucide.CalendarIcon
export const CalendarRange = pixelIcon(
  'CalendarRange',
) as typeof lucide.CalendarRange
export const Camera = pixelIcon('Camera') as typeof lucide.Camera
export const CameraOff = pixelIcon('CameraOff') as typeof lucide.CameraOff
export const Car = pixelIcon('Car') as typeof lucide.Car
export const CarTaxiFront = pixelIcon(
  'CarTaxiFront',
) as typeof lucide.CarTaxiFront
export const Carrot = pixelIcon('Carrot') as typeof lucide.Carrot
export const ChartNoAxesCombined = pixelIcon(
  'ChartNoAxesCombined',
) as typeof lucide.ChartNoAxesCombined
export const ChartPie = pixelIcon('ChartPie') as typeof lucide.ChartPie
export const Check = pixelIcon('Check') as typeof lucide.Check
export const CheckCheck = pixelIcon('CheckCheck') as typeof lucide.CheckCheck
export const CheckCircle2 = pixelIcon(
  'CheckCircle2',
) as typeof lucide.CheckCircle2
export const ChevronDown = pixelIcon('ChevronDown') as typeof lucide.ChevronDown
export const ChevronLeft = pixelIcon('ChevronLeft') as typeof lucide.ChevronLeft
export const ChevronRight = pixelIcon(
  'ChevronRight',
) as typeof lucide.ChevronRight
export const ChevronUp = pixelIcon('ChevronUp') as typeof lucide.ChevronUp
export const ChevronsUpDown = pixelIcon(
  'ChevronsUpDown',
) as typeof lucide.ChevronsUpDown
export const Circle = pixelIcon('Circle') as typeof lucide.Circle
export const CircleHelp = pixelIcon('CircleHelp') as typeof lucide.CircleHelp
export const CircleOff = pixelIcon('CircleOff') as typeof lucide.CircleOff
export const Clapperboard = pixelIcon(
  'Clapperboard',
) as typeof lucide.Clapperboard
export const Clock = pixelIcon('Clock') as typeof lucide.Clock
export const ClockArrowDown = pixelIcon(
  'ClockArrowDown',
) as typeof lucide.ClockArrowDown
export const ClockArrowUp = pixelIcon(
  'ClockArrowUp',
) as typeof lucide.ClockArrowUp
export const Cloud = pixelIcon('Cloud') as typeof lucide.Cloud
export const CloudDownload = pixelIcon(
  'CloudDownload',
) as typeof lucide.CloudDownload
export const CloudOff = pixelIcon('CloudOff') as typeof lucide.CloudOff
export const Code2 = pixelIcon('Code2') as typeof lucide.Code2
export const Coins = pixelIcon('Coins') as typeof lucide.Coins
export const Copy = pixelIcon('Copy') as typeof lucide.Copy
export const Database = pixelIcon('Database') as typeof lucide.Database
export const Delete = pixelIcon('Delete') as typeof lucide.Delete
export const Dices = pixelIcon('Dices') as typeof lucide.Dices
export const Download = pixelIcon('Download') as typeof lucide.Download
export const Drama = pixelIcon('Drama') as typeof lucide.Drama
export const Droplets = pixelIcon('Droplets') as typeof lucide.Droplets
export const Edit3 = pixelIcon('Edit3') as typeof lucide.Edit3
export const Ellipsis = pixelIcon('Ellipsis') as typeof lucide.Ellipsis
export const ExternalLink = pixelIcon(
  'ExternalLink',
) as typeof lucide.ExternalLink
export const Eye = pixelIcon('Eye') as typeof lucide.Eye
export const EyeOff = pixelIcon('EyeOff') as typeof lucide.EyeOff
export const FerrisWheel = pixelIcon('FerrisWheel') as typeof lucide.FerrisWheel
export const FileArchive = pixelIcon('FileArchive') as typeof lucide.FileArchive
export const FileAudio = pixelIcon('FileAudio') as typeof lucide.FileAudio
export const FileInput = pixelIcon('FileInput') as typeof lucide.FileInput
export const FilePlus2 = pixelIcon('FilePlus2') as typeof lucide.FilePlus2
export const FileQuestion = pixelIcon(
  'FileQuestion',
) as typeof lucide.FileQuestion
export const FileSpreadsheet = pixelIcon(
  'FileSpreadsheet',
) as typeof lucide.FileSpreadsheet
export const FileText = pixelIcon('FileText') as typeof lucide.FileText
export const FileUp = pixelIcon('FileUp') as typeof lucide.FileUp
export const Filter = pixelIcon('Filter') as typeof lucide.Filter
export const Fingerprint = pixelIcon('Fingerprint') as typeof lucide.Fingerprint
export const FingerprintPattern = pixelIcon(
  'FingerprintPattern',
) as typeof lucide.FingerprintPattern
export const Flower2 = pixelIcon('Flower2') as typeof lucide.Flower2
export const FolderOpen = pixelIcon('FolderOpen') as typeof lucide.FolderOpen
export const FolderPlus = pixelIcon('FolderPlus') as typeof lucide.FolderPlus
export const Fuel = pixelIcon('Fuel') as typeof lucide.Fuel
export const Gift = pixelIcon('Gift') as typeof lucide.Gift
export const GitFork = pixelIcon('GitFork') as typeof lucide.GitFork
export const Globe = pixelIcon('Globe') as typeof lucide.Globe
export const Globe2 = pixelIcon('Globe2') as typeof lucide.Globe2
export const GraduationCap = pixelIcon(
  'GraduationCap',
) as typeof lucide.GraduationCap
export const HandCoins = pixelIcon('HandCoins') as typeof lucide.HandCoins
export const HandHelping = pixelIcon('HandHelping') as typeof lucide.HandHelping
export const Handshake = pixelIcon('Handshake') as typeof lucide.Handshake
export const Hash = pixelIcon('Hash') as typeof lucide.Hash
export const HatGlasses = pixelIcon('HatGlasses') as typeof lucide.HatGlasses
export const Heart = pixelIcon('Heart') as typeof lucide.Heart
export const HeartHandshake = pixelIcon(
  'HeartHandshake',
) as typeof lucide.HeartHandshake
export const HeartPulse = pixelIcon('HeartPulse') as typeof lucide.HeartPulse
export const History = pixelIcon('History') as typeof lucide.History
export const Home = pixelIcon('Home') as typeof lucide.Home
export const Hotel = pixelIcon('Hotel') as typeof lucide.Hotel
export const HousePlus = pixelIcon('HousePlus') as typeof lucide.HousePlus
export const IdCard = pixelIcon('IdCard') as typeof lucide.IdCard
export const Info = pixelIcon('Info') as typeof lucide.Info
export const KeyRound = pixelIcon('KeyRound') as typeof lucide.KeyRound
export const Landmark = pixelIcon('Landmark') as typeof lucide.Landmark
export const Languages = pixelIcon('Languages') as typeof lucide.Languages
export const Layers = pixelIcon('Layers') as typeof lucide.Layers
export const Layers3 = pixelIcon('Layers3') as typeof lucide.Layers3
export const Lightbulb = pixelIcon('Lightbulb') as typeof lucide.Lightbulb
export const Link = pixelIcon('Link') as typeof lucide.Link
export const Link2 = pixelIcon('Link2') as typeof lucide.Link2
export const List = pixelIcon('List') as typeof lucide.List
export const ListChecks = pixelIcon('ListChecks') as typeof lucide.ListChecks
export const ListPlus = pixelIcon('ListPlus') as typeof lucide.ListPlus
export const Loader2 = pixelIcon('Loader2') as typeof lucide.Loader2
export const LoaderCircle = pixelIcon(
  'LoaderCircle',
) as typeof lucide.LoaderCircle
export const LockKeyhole = pixelIcon('LockKeyhole') as typeof lucide.LockKeyhole
export const LogOut = pixelIcon('LogOut') as typeof lucide.LogOut
export const Mail = pixelIcon('Mail') as typeof lucide.Mail
export const MailCheck = pixelIcon('MailCheck') as typeof lucide.MailCheck
export const MailMinus = pixelIcon('MailMinus') as typeof lucide.MailMinus
export const Megaphone = pixelIcon('Megaphone') as typeof lucide.Megaphone
export const Menu = pixelIcon('Menu') as typeof lucide.Menu
export const MessageSquareText = pixelIcon(
  'MessageSquareText',
) as typeof lucide.MessageSquareText
export const Mic = pixelIcon('Mic') as typeof lucide.Mic
export const Minus = pixelIcon('Minus') as typeof lucide.Minus
export const MonitorPlay = pixelIcon('MonitorPlay') as typeof lucide.MonitorPlay
export const Moon = pixelIcon('Moon') as typeof lucide.Moon
export const MoreHorizontal = pixelIcon(
  'MoreHorizontal',
) as typeof lucide.MoreHorizontal
export const Music = pixelIcon('Music') as typeof lucide.Music
export const Paperclip = pixelIcon('Paperclip') as typeof lucide.Paperclip
export const ParkingMeter = pixelIcon(
  'ParkingMeter',
) as typeof lucide.ParkingMeter
export const PartyPopper = pixelIcon('PartyPopper') as typeof lucide.PartyPopper
export const PawPrint = pixelIcon('PawPrint') as typeof lucide.PawPrint
export const Pencil = pixelIcon('Pencil') as typeof lucide.Pencil
export const PencilLine = pixelIcon('PencilLine') as typeof lucide.PencilLine
export const Percent = pixelIcon('Percent') as typeof lucide.Percent
export const Plane = pixelIcon('Plane') as typeof lucide.Plane
export const Play = pixelIcon('Play') as typeof lucide.Play
export const Plug = pixelIcon('Plug') as typeof lucide.Plug
export const PlugZap = pixelIcon('PlugZap') as typeof lucide.PlugZap
export const Plus = pixelIcon('Plus') as typeof lucide.Plus
export const PlusCircle = pixelIcon('PlusCircle') as typeof lucide.PlusCircle
export const Printer = pixelIcon('Printer') as typeof lucide.Printer
export const QrCode = pixelIcon('QrCode') as typeof lucide.QrCode
export const Receipt = pixelIcon('Receipt') as typeof lucide.Receipt
export const ReceiptText = pixelIcon('ReceiptText') as typeof lucide.ReceiptText
export const RefreshCw = pixelIcon('RefreshCw') as typeof lucide.RefreshCw
export const Repeat = pixelIcon('Repeat') as typeof lucide.Repeat
export const Repeat2 = pixelIcon('Repeat2') as typeof lucide.Repeat2
export const RotateCcw = pixelIcon('RotateCcw') as typeof lucide.RotateCcw
export const RotateCw = pixelIcon('RotateCw') as typeof lucide.RotateCw
export const Save = pixelIcon('Save') as typeof lucide.Save
export const Scale = pixelIcon('Scale') as typeof lucide.Scale
export const ScanLine = pixelIcon('ScanLine') as typeof lucide.ScanLine
export const Search = pixelIcon('Search') as typeof lucide.Search
export const SearchX = pixelIcon('SearchX') as typeof lucide.SearchX
export const Send = pixelIcon('Send') as typeof lucide.Send
export const Settings = pixelIcon('Settings') as typeof lucide.Settings
export const Settings2 = pixelIcon('Settings2') as typeof lucide.Settings2
export const Shapes = pixelIcon('Shapes') as typeof lucide.Shapes
export const Share = pixelIcon('Share') as typeof lucide.Share
export const Share2 = pixelIcon('Share2') as typeof lucide.Share2
export const ShieldAlert = pixelIcon('ShieldAlert') as typeof lucide.ShieldAlert
export const ShieldCheck = pixelIcon('ShieldCheck') as typeof lucide.ShieldCheck
export const Shirt = pixelIcon('Shirt') as typeof lucide.Shirt
export const ShoppingCart = pixelIcon(
  'ShoppingCart',
) as typeof lucide.ShoppingCart
export const SlidersHorizontal = pixelIcon(
  'SlidersHorizontal',
) as typeof lucide.SlidersHorizontal
export const Smartphone = pixelIcon('Smartphone') as typeof lucide.Smartphone
export const Sparkles = pixelIcon('Sparkles') as typeof lucide.Sparkles
export const SprayCan = pixelIcon('SprayCan') as typeof lucide.SprayCan
export const Sprout = pixelIcon('Sprout') as typeof lucide.Sprout
export const Square = pixelIcon('Square') as typeof lucide.Square
export const Star = pixelIcon('Star') as typeof lucide.Star
export const Stethoscope = pixelIcon('Stethoscope') as typeof lucide.Stethoscope
export const Sun = pixelIcon('Sun') as typeof lucide.Sun
export const Tags = pixelIcon('Tags') as typeof lucide.Tags
export const ThermometerSun = pixelIcon(
  'ThermometerSun',
) as typeof lucide.ThermometerSun
export const Train = pixelIcon('Train') as typeof lucide.Train
export const Trash = pixelIcon('Trash') as typeof lucide.Trash
export const Trash2 = pixelIcon('Trash2') as typeof lucide.Trash2
export const TrendingUp = pixelIcon('TrendingUp') as typeof lucide.TrendingUp
export const TriangleAlert = pixelIcon(
  'TriangleAlert',
) as typeof lucide.TriangleAlert
export const Trophy = pixelIcon('Trophy') as typeof lucide.Trophy
export const Upload = pixelIcon('Upload') as typeof lucide.Upload
export const User = pixelIcon('User') as typeof lucide.User
export const UserPen = pixelIcon('UserPen') as typeof lucide.UserPen
export const UserPlus = pixelIcon('UserPlus') as typeof lucide.UserPlus
export const UserRound = pixelIcon('UserRound') as typeof lucide.UserRound
export const UserRoundCheck = pixelIcon(
  'UserRoundCheck',
) as typeof lucide.UserRoundCheck
export const UserRoundX = pixelIcon('UserRoundX') as typeof lucide.UserRoundX
export const Users = pixelIcon('Users') as typeof lucide.Users
export const UsersRound = pixelIcon('UsersRound') as typeof lucide.UsersRound
export const Utensils = pixelIcon('Utensils') as typeof lucide.Utensils
export const UtensilsCrossed = pixelIcon(
  'UtensilsCrossed',
) as typeof lucide.UtensilsCrossed
export const Wallet = pixelIcon('Wallet') as typeof lucide.Wallet
export const WalletCards = pixelIcon('WalletCards') as typeof lucide.WalletCards
export const Webhook = pixelIcon('Webhook') as typeof lucide.Webhook
export const Wifi = pixelIcon('Wifi') as typeof lucide.Wifi
export const WifiOff = pixelIcon('WifiOff') as typeof lucide.WifiOff
export const Wine = pixelIcon('Wine') as typeof lucide.Wine
export const Wrench = pixelIcon('Wrench') as typeof lucide.Wrench
export const X = pixelIcon('X') as typeof lucide.X
export const XCircle = pixelIcon('XCircle') as typeof lucide.XCircle
export const XIcon = pixelIcon('XIcon') as typeof lucide.XIcon
export const Zap = pixelIcon('Zap') as typeof lucide.Zap
